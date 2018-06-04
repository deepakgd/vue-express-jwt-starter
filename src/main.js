// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import VueResource from 'vue-resource'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import App from './App'
import router from './router'
import store from './store'

Vue.use(Vuelidate)
Vue.use(VueMaterial)
Vue.use(VueResource)
Vue.config.productionTip = false

Vue.http.interceptors.push(function (request) {
  request.headers.set('Authorization', `Bearer ${localStorage.getItem('user-token')}`)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  template: '<App/>'
})
