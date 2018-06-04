import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Quiz from '@/components/Quiz'
import Broadcast from '@/components/Broadcast'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Vuex from 'vuex'

Vue.use(Router)
Vue.use(Vuex)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/broadcast',
      name: 'Broadcast',
      meta: {
        requiresAuth: true
      },
      component: Broadcast
    },
    {
      path: '/quiz',
      name: 'Quiz',
      meta: {
        requiresAuth: true
      },
      component: Quiz
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})

// Check before each page load whether the page requires authentication/
// if it does check whether the user is signed into the web app or
// redirect to the sign-in page to enable them to sign-in
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('user-token')
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (requiresAuth && isLoggedIn) {
    next()
  } else if (['Login', 'Register'].indexOf(to.name) !== -1 && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
