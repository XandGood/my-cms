import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/store/modules/auth'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 不需要登录的页面
  if (to.meta.requireAuth === false) {
    next()
    return
  }
  
  // 检查是否登录
  if (authStore.isLogin) {
    next()
  } else {
    next('auth/login')
  }
})

export default router