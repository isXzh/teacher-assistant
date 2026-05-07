import { EventSourcePolyfill } from 'event-source-polyfill';

let sseClient = null;

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
    eventListeners: {},
    connectionQuality: 100,
    messageCount: 0,
    lastMessageTime: null,
    isReconnecting: false,
    lastDisconnectTime: null,
    isConnecting: false,
  },
  mutations: {
    SET_SSE_CONNECTED(state, connected) {
      state.sseConnected = connected;
    },
    SET_RECONNECT_ATTEMPTS(state, attempts) {
      state.reconnectAttempts = attempts;
    },
    SET_SCHEDULE_ID(state, scheduleId) {
      state.scheduleId = scheduleId;
    },
    SET_HEARTBEAT_TIMER(state, timer) {
      state.heartbeatTimer = timer;
    },
    ADD_EVENT_LISTENER(state, { event, handler }) {
      if (!state.eventListeners[event]) {
        state.eventListeners[event] = [];
      }

      if (!state.eventListeners[event].includes(handler)) {
        state.eventListeners[event].push(handler);
        console.log(`添加事件监听器: ${event}, 当前该事件监听器数量: ${state.eventListeners[event].length}`);
      } else {
        console.log(`事件监听器已存在，跳过添加: ${event}`);
      }
    },
    REMOVE_EVENT_LISTENER(state, { event, handler }) {
      if (state.eventListeners[event]) {
        state.eventListeners[event] = state.eventListeners[event].filter(h => h !== handler);
      }
    },
    RESET_EVENT_LISTENERS(state) {
      state.eventListeners = {};
    },
    SET_CONNECTION_QUALITY(state, quality) {
      state.connectionQuality = quality;
    },
    INCREMENT_MESSAGE_COUNT(state) {
      state.messageCount++;
      state.lastMessageTime = new Date().getTime();
    },
    RESET_MESSAGE_COUNT(state) {
      state.messageCount = 0;
    },
    SET_IS_RECONNECTING(state, isReconnecting) {
      state.isReconnecting = isReconnecting;
    },
    SET_LAST_DISCONNECT_TIME(state, time) {
      state.lastDisconnectTime = time;
    },
    SET_IS_CONNECTING(state, isConnecting) {
      state.isConnecting = isConnecting;
    },
  },
  actions: {
    initSSE({ commit, dispatch, state }, scheduleId) {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        console.error('未找到访问令牌，无法建立SSE连接');
        return Promise.reject(new Error('未找到访问令牌，请重新登录'));
      }

      if (state.isConnecting) {
        console.warn('SSE连接正在建立中，拒绝重复连接请求');
        return Promise.reject(new Error('SSE连接正在建立中'));
      }

      if (sseClient && state.scheduleId === scheduleId && state.sseConnected) {
        console.log('SSE连接已存在且状态正常，跳过重复连接');
        return Promise.resolve();
      }

      if (sseClient && state.scheduleId !== scheduleId) {
        console.log('scheduleId变化，关闭现有SSE连接，建立新连接', { oldScheduleId: state.scheduleId, newScheduleId: scheduleId });
        dispatch('closeSSE', { clearListeners: false });
      } else if (sseClient) {
        console.log('关闭现有SSE连接，建立新连接');
        dispatch('closeSSE');
      }

      commit('SET_SCHEDULE_ID', scheduleId);
      commit('RESET_MESSAGE_COUNT');
      commit('SET_IS_CONNECTING', true);

      return new Promise((resolve, reject) => {
        try {
          const client = new EventSourcePolyfill(
            `${window.businessURL}/api/teacher/sse`,
            {
              headers: {
                token: `Bearer ${token}`,
              },
              withCredentials: false,
              // heartbeatTimeout: 120000,
              // connectionTimeout: 30000,
              heartbeatTimeout: 60000,
              connectionTimeout: 10000
            }
          );

          client.onopen = () => {
            console.log('SSE连接已建立');
            commit('SET_SSE_CONNECTED', true);
            commit('SET_RECONNECT_ATTEMPTS', 0);
            commit('SET_CONNECTION_QUALITY', 100);
            commit('SET_IS_RECONNECTING', false);
            commit('SET_LAST_DISCONNECT_TIME', null);
            commit('SET_IS_CONNECTING', false);
            dispatch('startHeartbeat');
            resolve();
          };

          client.onerror = error => {
            const errorInfo = {
              readyState: sseClient?.readyState,
              errorType: error?.type,
              errorMessage: error?.message,
              target: error?.target,
              timestamp: new Date().toISOString(),
            };
            console.error('SSE连接错误详情:', errorInfo);

            if (client.readyState === 2) {
              console.error('SSE连接已关闭，不再自动重连。可能原因：');
              console.error('1. 后端服务未运行或不可访问');
              console.error('2. Token已过期或无效');
              console.error('3. SSE端点路径错误');
              console.error('4. 后端不支持SSE连接');
              console.error('5. 网络连接问题');
              console.error(`当前token: ${token.substring(0, 20)}...`);
              console.error(`请求URL: ${window.businessURL}/api/teacher/meeting/control/${scheduleId}/sse`);
            }

            commit('SET_IS_CONNECTING', false);
            dispatch('handleSSEError', error);
            reject(error);
          };

          client.addEventListener('message', event => {
            commit('INCREMENT_MESSAGE_COUNT');
            if (event.data && event.data !== '') {
              console.log('SSE消息接收:', event.data.substring(0, 100) + (event.data.length > 100 ? '...' : ''));
            }
          });

          sseClient = client;
        } catch (error) {
          console.error('创建SSE客户端失败:', error);
          reject(error);
        }
      });
    },

    handleSSEError({ commit, state, dispatch }, error) {
      const currentTime = new Date().getTime();
      const timeSinceLastDisconnect = state.lastDisconnectTime ? currentTime - state.lastDisconnectTime : 99999;

      console.error('SSE连接错误详情:', {
        readyState: sseClient?.readyState,
        errorType: error?.type,
        errorMessage: error?.message,
        timestamp: new Date().toISOString(),
        reconnectAttempts: state.reconnectAttempts,
        timeSinceLastDisconnect: timeSinceLastDisconnect,
      });

      commit('SET_SSE_CONNECTED', false);
      commit('SET_CONNECTION_QUALITY', 0);
      commit('SET_LAST_DISCONNECT_TIME', currentTime);
      dispatch('stopHeartbeat');

      if (state.reconnectAttempts >= state.maxReconnectAttempts) {
        console.error('SSE连接重连次数已达上限，停止重连。请刷新页面重新连接。');
        commit('SET_IS_RECONNECTING', false);
        return;
      }

      if (state.isReconnecting) {
        console.warn('SSE正在重连中，跳过本次重连');
        return;
      }

      if (timeSinceLastDisconnect < 2000) {
        console.warn('距离上次断开不足2秒，延迟重连以避免频繁重连');
        setTimeout(() => {
          if (state.scheduleId && !state.sseConnected) {
            dispatch('initSSE', state.scheduleId);
          }
        }, 5000);
        return;
      }

      commit('SET_RECONNECT_ATTEMPTS', state.reconnectAttempts + 1);
      commit('SET_IS_RECONNECTING', true);

      const delay = Math.min(state.reconnectInterval * Math.pow(1.5, state.reconnectAttempts), 30000);
      console.log(`SSE连接断开，${delay / 1000}秒后尝试第${state.reconnectAttempts + 1}次重连...`);

      setTimeout(() => {
        if (state.scheduleId) {
          dispatch('initSSE', state.scheduleId);
        }
      }, delay);
    },

    startHeartbeat({ commit, state, dispatch }) {
      dispatch('stopHeartbeat');
      const timer = setInterval(() => {
        if (sseClient && sseClient.readyState === 1) {
          const timeSinceLastMessage = state.lastMessageTime
            ? (new Date().getTime() - state.lastMessageTime) / 1000
            : 0;

          if (timeSinceLastMessage > 60) {
            console.warn(`SSE心跳检测警告: 超过${timeSinceLastMessage}秒未收到消息`);
            commit('SET_CONNECTION_QUALITY', Math.max(0, state.connectionQuality - 20));

            if (state.connectionQuality < 30) {
              console.warn('SSE连接质量过低，尝试重连');
              dispatch('handleSSEError', new Error('连接质量过低'));
            }
          } else {
            commit('SET_CONNECTION_QUALITY', Math.min(100, state.connectionQuality + 5));
            console.log(`SSE心跳检测: 连接正常 (质量: ${state.connectionQuality}%, 消息数: ${state.messageCount})`);
          }
        } else {
          console.warn('SSE心跳检测: 连接异常，尝试重连');
          dispatch('stopHeartbeat');
          dispatch('handleSSEError', new Error('心跳检测失败'));
        }
      }, state.heartbeatInterval);
      commit('SET_HEARTBEAT_TIMER', timer);
    },

    stopHeartbeat({ commit, state }) {
      if (state.heartbeatTimer) {
        clearInterval(state.heartbeatTimer);
        commit('SET_HEARTBEAT_TIMER', null);
      }
    },

    closeSSE({ commit, dispatch }, { clearListeners = true } = {}) {
      dispatch('stopHeartbeat');
      if (sseClient) {
        console.log('关闭SSE连接，是否清空监听器:', clearListeners);
        sseClient.close();
        sseClient = null;
      }
      commit('SET_SSE_CONNECTED', false);
      commit('SET_SCHEDULE_ID', null);
      commit('SET_CONNECTION_QUALITY', 0);
      commit('RESET_MESSAGE_COUNT');
      if (clearListeners) {
        commit('RESET_EVENT_LISTENERS');
      }
    },

    addEventListener({ commit }, { event, handler }) {
      if (sseClient && sseClient.readyState === 1) {
        try {
          sseClient.addEventListener(event, handler);
          console.log(`已注册SSE事件监听器: ${event} (readyState: ${sseClient.readyState})`);
        } catch (error) {
          console.error(`注册SSE事件监听器失败 (${event}):`, error);
        }
      } else if (sseClient) {
        console.warn(`SSE连接尚未建立 (readyState: ${sseClient.readyState})，事件监听器已暂存: ${event}`);
      } else {
        console.warn(`SSE客户端未初始化，事件监听器已暂存: ${event}`);
      }
      commit('ADD_EVENT_LISTENER', { event, handler });
    },

    removeEventListener({ commit }, { event, handler }) {
      if (sseClient) {
        try {
          sseClient.removeEventListener(event, handler);
          console.log(`已移除SSE事件监听器: ${event}`);
        } catch (error) {
          console.error(`移除SSE事件监听器失败 (${event}):`, error);
        }
      }
      commit('REMOVE_EVENT_LISTENER', { event, handler });
    },

    reRegisterEventListeners({ state }) {
      if (!sseClient) {
        console.warn('SSE客户端未就绪，跳过重新注册事件监听器');
        return;
      }

      console.log(
        '重新注册所有SSE事件监听器',
        `当前readyState: ${sseClient.readyState}, 事件数量: ${Object.keys(state.eventListeners).length}`
      );

      Object.keys(state.eventListeners).forEach(event => {
        const handlers = state.eventListeners[event];
        if (handlers && handlers.length > 0) {
          handlers.forEach(handler => {
            try {
              sseClient.addEventListener(event, handler);
              console.log(`重新注册SSE事件监听器: ${event} (readyState: ${sseClient.readyState})`);
            } catch (error) {
              console.error(`重新注册SSE事件监听器失败 (${event}):`, error);
            }
          });
        }
      });

      console.log(`SSE事件监听器重新注册完成，共注册了${Object.keys(state.eventListeners).length}个事件类型`);
    },

    triggerEventListenersRegistration({ dispatch }) {
      console.log('手动触发SSE事件监听器注册');
      dispatch('reRegisterEventListeners');
    },

    sendMessage(handler) {
      console.warn('sendMessage方法已弃用，请使用addEventListener');
      if (sseClient) {
        sseClient.onmessage = handler;
      }
    },
  },
  getters: {
    getSseClient: () => sseClient,
    isSseConnected: state => state.sseConnected,
    getScheduleId: state => state.scheduleId,
    getConnectionQuality: state => state.connectionQuality,
    getMessageCount: state => state.messageCount,
    getLastMessageTime: state => state.lastMessageTime,
  },
};
