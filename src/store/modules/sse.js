import { EventSourcePolyfill } from 'event-source-polyfill'

let sseClient = null

export default {
  namespaced: true,
  state: {
    sseConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 10,
    reconnectInterval: 3000,
    heartbeatTimer: null,
    heartbeatInterval: 30000,
    scheduleId: null,
    eventListeners: {}
  },
  mutations: {
    SET_SSE_CONNECTED(state, connected) {
      state.sseConnected = connected
    },
    SET_RECONNECT_ATTEMPTS(state, attempts) {
      state.reconnectAttempts = attempts
    },
    SET_SCHEDULE_ID(state, scheduleId) {
      state.scheduleId = scheduleId
    },
    SET_HEARTBEAT_TIMER(state, timer) {
      state.heartbeatTimer = timer
    },
    ADD_EVENT_LISTENER(state, { event, handler }) {
      if (!state.eventListeners[event]) {
        state.eventListeners[event] = []
      }
      state.eventListeners[event].push(handler)
    },
    REMOVE_EVENT_LISTENER(state, { event, handler }) {
      if (state.eventListeners[event]) {
        state.eventListeners[event] = state.eventListeners[event].filter(h => h !== handler)
      }
    }
  },
  actions: {
    initSSE({ commit, state, dispatch }, scheduleId) {
      const token = sessionStorage.getItem('accessToken')

      if (!token) {
        console.error('未找到访问令牌，无法建立SSE连接')
        return Promise.reject(new Error('未找到访问令牌，请重新登录'))
      }

      if (sseClient) {
        dispatch('closeSSE')
      }

      commit('SET_SCHEDULE_ID', scheduleId)

      return new Promise((resolve, reject) => {
        const client = new EventSourcePolyfill(
          `${window.businessURL}/api/teacher/meeting/control/${scheduleId}/sse`,
          {
            headers: {
              token: `Bearer ${token}`
            },
            withCredentials: false
          }
        )

        client.onopen = () => {
          console.log('SSE连接已建立')
          commit('SET_SSE_CONNECTED', true)
          commit('SET_RECONNECT_ATTEMPTS', 0)
          dispatch('startHeartbeat')
          resolve()
        }

        client.onerror = (error) => {
          dispatch('handleSSEError', error)
          reject(error)
        }

        sseClient = client
      })
    },

    handleSSEError({ commit, state, dispatch }, error) {
      console.error('SSE连接错误:', error)
      commit('SET_SSE_CONNECTED', false)
      dispatch('stopHeartbeat')

      if (state.reconnectAttempts < state.maxReconnectAttempts) {
        commit('SET_RECONNECT_ATTEMPTS', state.reconnectAttempts + 1)
        const delay = state.reconnectInterval * Math.min(state.reconnectAttempts + 1, 5)
        console.log(`SSE连接断开，${delay / 1000}秒后尝试第${state.reconnectAttempts + 1}次重连...`)
        
        setTimeout(() => {
          if (state.scheduleId) {
            dispatch('initSSE', state.scheduleId)
          }
        }, delay)
      } else {
        console.error('SSE连接重连次数已达上限，停止重连')
      }
    },

    startHeartbeat({ commit, state, dispatch }) {
      dispatch('stopHeartbeat')
      const timer = setInterval(() => {
        if (sseClient && sseClient.readyState === 1) {
          console.log('SSE心跳检测: 连接正常')
        } else {
          console.warn('SSE心跳检测: 连接异常，尝试重连')
          dispatch('stopHeartbeat')
          dispatch('handleSSEError', new Error('心跳检测失败'))
        }
      }, state.heartbeatInterval)
      commit('SET_HEARTBEAT_TIMER', timer)
    },

    stopHeartbeat({ commit, state }) {
      if (state.heartbeatTimer) {
        clearInterval(state.heartbeatTimer)
        commit('SET_HEARTBEAT_TIMER', null)
      }
    },

    closeSSE({ commit, state, dispatch }) {
      dispatch('stopHeartbeat')
      if (sseClient) {
        sseClient.close()
        sseClient = null
      }
      commit('SET_SSE_CONNECTED', false)
      commit('SET_SCHEDULE_ID', null)
    },

    addEventListener({ commit, state }, { event, handler }) {
      if (sseClient) {
        sseClient.addEventListener(event, handler)
      }
      commit('ADD_EVENT_LISTENER', { event, handler })
    },

    removeEventListener({ commit, state }, { event, handler }) {
      if (sseClient) {
        sseClient.removeEventListener(event, handler)
      }
      commit('REMOVE_EVENT_LISTENER', { event, handler })
    },

    sendMessage({ state }, handler) {
      if (sseClient) {
        sseClient.onmessage = handler
      }
    }
  },
  getters: {
    getSseClient: () => sseClient,
    isSseConnected: state => state.sseConnected,
    getScheduleId: state => state.scheduleId
  }
}
