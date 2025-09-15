<template>

    <el-header class="app-header" :class="{ hidden: isHeaderHidden }">
      <div class="logo">墨记云博</div>
      <nav>
        <!-- 导航链接 -->
        <router-link to="/">首页</router-link>
        <router-link to="/auth/login" v-if="!isLoggedIn">登录</router-link>
        <router-link v-if="isLoggedIn && authStore.userInfo">{{userInfo.name}}</router-link>
        <el-button @click="logout" v-if="isLoggedIn">登出</el-button>
      </nav>
    </el-header>

  
</template>

<script setup>
import { computed} from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { useScrollHide } from '@/composables/useScrollHide'


const { isHidden: isHeaderHidden } = useScrollHide()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLogin)  // 使用computed属性绑定到store的isLogin getter
const userInfo = computed(() => authStore.userInfo) 



const logout = () => {
  authStore.logout()

}


</script>

<style scoped>
.app-header {
  height: 65px;
  background-color: rgba(129, 121, 121, 0.587);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  position: fixed;
  top: 0;           
  left: 0;          
  right: 0;         
  z-index: 1000;    
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
  transition: transform 0.4s ease-in-out;
  transform: translateY(0);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.app-header.hidden {
  transform: translateY(-100%);
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
}

nav a{
  color: white;
  margin-left: 20px;
  text-decoration: none;
}


:deep(.el-button) { 
  border: none;
  background-color: rgba(129, 121, 121, 0);
  margin-left: 8px;
  margin-bottom: 2px;
  margin-right: 0;
  text-decoration: none;
  font-size: 1rem;
  color: white;
}



</style>
