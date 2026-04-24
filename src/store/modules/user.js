import auth from '@/api/auth'

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: (() => {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr || userInfoStr === 'undefined' || userInfoStr === 'null') {
        return null;
      }
      try {
        return JSON.parse(userInfoStr);
      } catch (error) {
        console.error('解析userInfo失败:', error);
        localStorage.removeItem('userInfo');
        return null;
      }
    })(),
    isLoggedIn: !!localStorage.getItem('token')
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      state.isLoggedIn = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      if (userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      } else {
        localStorage.removeItem('userInfo')
      }
    },
    CLEAR_USER_DATA(state) {
      state.token = ''
      state.userInfo = null
      state.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
  actions: {
    login({ commit }, { token, userInfo }) {
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
    },
    async logout({ commit }) {
      try {
        await auth.logout()
      } catch (error) {
        console.error('退出登录API调用失败:', error)
      } finally {
        commit('CLEAR_USER_DATA')
      }
    },
    updateUserInfo({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  },
  getters: {
    getToken: state => state.token,
    getUserInfo: state => state.userInfo,
    isLoggedIn: state => state.isLoggedIn,
    getUserName: state => state.userInfo?.name || '',
    getUserAvatar: state => state.userInfo?.avatar || ''
  }
}
