import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi,register } from '@/api/auth'
import { getCurrentUser } from '../../api/auth'

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
        const { token , userInfo} = response.data
        this.token = token
        await this.getUserInfo(userInfo.id)
        return response
      
    },

    logout() {
      this.token = ''
      this.userInfo = null
      logoutApi()
    },

    async getUserInfo(id) {
      const response = await getCurrentUser(id)
      this.userInfo = {
        id: response[0].id,
        username: response[0].username,
        role: response[0].role,
        name: response[0].name,
      }
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