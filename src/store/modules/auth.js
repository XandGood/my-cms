import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { setToken, getToken, removeToken } from '@/utils/storage'
import { register } from '../../api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken() || '',
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
        
        setToken(token)
        return userInfo
      
    },
    logout() {
      this.token = ''
      this.userInfo = null
      removeToken()
      logoutApi()
    },
    async register(userData) {
      const response = await register(userData)
      if (response.success===false) {
        return response.messagee
      }else{
        return '注册成功，请登录'
      }
    }
  }
})