<template>

    <el-header class="app-header" :class="{ hidden: isHeaderHidden }">
      <div class="logo">墨记云博</div>
      <nav class="nav">
        <!-- 导航链接 -->
        <router-link to="/">首页</router-link>
        <router-link to="/auth/login" v-if="!isLoggedIn">登录</router-link>
      <el-popover
      :width="248"
      placement="bottom-end"
      transition="el-zoom-in-top"
      popper-style="
      box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;border-radius: 8px;"
      v-if="isLoggedIn && authStore.userInfo"
      >
          <template #reference >
             <router-link to="/profile">
            <el-avatar :src="userInfo.avatar" class="avatar" />
            </router-link>
          </template>
          <template #default>
            <div
              class="demo-rich-conent"
              style="display: flex; gap: 16px; flex-direction: column"
            >
              <el-avatar
                :size="60"
                :src="userInfo.avatar"
                style="margin-bottom: 8px"
              />
              <div>
                <p
                  class="demo-rich-content__name"
                  style="margin: 0; font-weight: 500; font-size: 18px;"
                >
                  {{userInfo.name}}
                </p>
                <p
                  class="demo-rich-content__mention"
                  style="margin: 0; font-size: 14px; color: var(--el-color-info)"
                >
                  {{userInfo.username}}
                </p>
              </div>
              <p class="demo-rich-content__desc" style="margin: 0;">
                {{ userInfo.bio }}
              </p>
                <el-divider style="margin: 0;"/>
              <div class="logout-container">
                <el-button type="danger" @click="logout" v-if="isLoggedIn">退出登录</el-button>
              </div>
            </div>
          </template>
        </el-popover>
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

.avatar {
  margin-left: 20px;
  cursor: pointer;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 15px;
  width: 126px;
}

nav a{
  color: white;
  margin-left: 20px;
  text-decoration: none;
  font-size: large;
}

.nav a .avatar {
  margin: 0;
}

.avatar {
  margin-left: 20px;
}

.logout-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
}




</style>
