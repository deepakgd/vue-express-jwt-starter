import { to } from 'await-to-js'
import router from '../../router'
import Vue from 'vue'
const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'
const SIGNUP = 'SIGNUP'
const LOGIN_FAILED = 'LOGIN_FAILED'

const actions = {

  async signin({ commit, state }, { email, password }) {
    commit(LOGIN)
    let [err, resposne] = await to(Vue.http.post('/api/auth/signin', { username: email, password: password }))

    if (err && err.status) {
      commit(LOGIN_FAILED, true)
      setTimeout(() => { commit(LOGIN_FAILED, false) }, 2000)
      return false
    }

    if (resposne.data && resposne.data.user) {
      localStorage.setItem('user-token', resposne.data.token)
      commit(LOGIN_SUCCESS, true, resposne.data.user)
    }

    if (err) { console.log(err) }
    return resposne.data
  },

  async signup({ commit, state, email, password }) {
    let [err, resposne] = await to(Vue.http.post('/api/auth/register', { username: email, password: password }))
    if (err) { console.log(err) }
    if (resposne.data && resposne.data.user) {
      localStorage.setItem('user-token', resposne.data.token)
      commit(LOGIN_SUCCESS, resposne.data.user)
    }
    commit(SIGNUP, resposne.data.user)
  }

}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  pending: state => state.pending,
  showNotif: state => state.showNotif,
  notificationText: state => state.notificationText
}

const mutations = {

  [LOGIN](state) {
    state.pending = true
  },
  [LOGIN_SUCCESS](state, user) {
    state.user = user
    state.pending = false
    state.isLoggedIn = true
    state.notificationText = 'Login success'
    state.showNotif = true
    router.push('/')
  },
  [LOGIN_FAILED](state, showNotif) {
    state.pending = false
    state.notificationText = 'Invalid credentials'
    state.showNotif = showNotif
  },
  [LOGOUT](state) {
    state.showNotif = false
    state.isLoggedIn = false
  },
  [SIGNUP](state, user) {
    state.user = user
    router.push('/')
  }
}

export default {
  mutations,
  actions,
  getters,
  state: {
    isLoggedIn: !!localStorage.getItem('user-token'),
    pending: false,
    showNotif: false,
    notificationText: ''
  }
}
