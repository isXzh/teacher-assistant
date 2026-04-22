import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
    meta: {
      title: '教师助手',
      requiresAuth: true
    }
  },
  {
    path: '/interaction/:courseId',
    name: 'InteractionPanel',
    component: () => import('@/views/InteractionPanel.vue'),
    meta: {
      title: '互动面板',
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '教师助手'
  const refreshToken = sessionStorage.getItem('refreshToken');
  
  if (to.path === '/login') {
    next();
    // if (token) {
    //   next({ path: '/' })
    // } else {
    //   next()
    // }
  } else {
    // 非登录页
    if (refreshToken) {
      next();
    } else {
      // 没有刷新Token，跳转到登录页
      next(`/login`);
    }
  }
})

export default router
