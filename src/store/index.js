import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth
  },
  strict: debug
})

/* if (module.hot) {
  module.hot.accept([
    './actions',
    './mutations'
  ], () => {
    store.hotUpdate({
      actions: require('./actions'),
      mutations: require('./mutations')
    })
  })
} */
