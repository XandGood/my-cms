import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi,register } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    userInfo: null
  }),
  getters: {
    isLogin() {
      return !!this.token
    }
  },
  actions: {
    async login(userData) {
        const response = await loginApi(userData)
        const { token, userInfo } = response.data
        
        this.token = token
        this.userInfo = userInfo
        return userInfo
      
    },

    logout() {
      this.token = ''
      this.userInfo = null
      logoutApi()
    },

    async register(userData) {
      const response = await register(userData)
      if (response.success===false) {
        return response.messagee
      }else{
        return '注册成功，请登录'
      }
    },

  }
})