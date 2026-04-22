import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import course from './modules/course'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    course,
    app
  },
  strict: process.env.NODE_ENV !== 'production'
})
