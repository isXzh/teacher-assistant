export default {
  namespaced: true,
  state: {
    sidebarCollapsed: false,
    loading: false,
    notifications: []
  },
  mutations: {
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.unshift({
        id: Date.now(),
        ...notification,
        timestamp: new Date().toISOString()
      })
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    },
    CLEAR_NOTIFICATIONS(state) {
      state.notifications = []
    }
  },
  actions: {
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    addNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)
    },
    removeNotification({ commit }, id) {
      commit('REMOVE_NOTIFICATION', id)
    },
    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS')
    }
  },
  getters: {
    isSidebarCollapsed: state => state.sidebarCollapsed,
    isLoading: state => state.loading,
    getNotifications: state => state.notifications,
    getUnreadCount: state => state.notifications.filter(n => !n.read).length
  }
}
