import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const beforeEnterHook = (to, from, next) => {
  window.console.log(to, from)
  if (window.localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: beforeEnterHook
  },
  {
    path: '/albums',
    name: 'albums',
    component: () => import(/* webpackChunkName: "albums" */ '../views/Albums.vue'),
    beforeEnter: beforeEnterHook
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue'),
    beforeEnter: beforeEnterHook
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    beforeEnter: beforeEnterHook
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
