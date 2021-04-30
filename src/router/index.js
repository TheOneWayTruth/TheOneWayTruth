import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Rooms',
    component: () => import(/* webpackChunkName: "game" */ '../views/Rooms.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "user" */ '../views/Login.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "user" */ '../views/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile/:id',
    name: 'ProfileId',
    component: () => import(/* webpackChunkName: "user" */ '../views/Profile.vue'),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: '/game/:id',
    name: 'GameId',
    component: () => import(/* webpackChunkName: "game" */ '../views/Game.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
