<template>
  <div class="app-container">
    <header v-if="isLoggedIn" class="app-header">
      <div class="logo">CMS 系统</div>
      <nav class="nav-menu">
        <router-link to="/">首页</router-link>
        <router-link to="/articles">文章管理</router-link>
        <router-link to="/users">用户管理</router-link>
      </nav>
      <div class="user-info">
        <span>{{ authStore.userInfo?.name || '用户' }}</span>
        <el-button type="primary" size="small" @click="handleLogout">退出登录</el-button>
      </div>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// 计算属性：检查用户是否已登录
const isLoggedIn = computed(() => authStore.isLogin)

// 登出方法
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: #409eff;
  color: white;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-menu a {
  color: white;
  text-decoration: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-main {
  flex: 1;
  padding: 20px;
}
</style>
