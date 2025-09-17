<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    :collapse="isCollapsed || isScrolling"
    background-color="rgba(129, 121, 121, 0.587)"
    text-color="#fff"
    active-text-color="#ffd04b"
    :unique-opened="true"
    :collapse-transition="true"
    style="backdrop-filter: blur(10px); "
    router
  >
    <div class="toggle-button" @click="toggleSidebar" style="border-top-right-radius:10px">
      <el-icon :size="20">
        <Fold v-if="isCollapsed || isScrolling" />
        <Expand v-else />
      </el-icon>
    </div>
    
    <el-menu-item index="/">
      <el-icon><HomeFilled /></el-icon>
       <span>首页</span>
    </el-menu-item>
    

    <el-sub-menu index="1">
      <template #title>
        <el-icon><Document /></el-icon>
        <span>文章内容</span>
      </template>
      <el-menu-item index="/post">文章速递</el-menu-item>
      <el-menu-item index="/post/handle/new">发布文章</el-menu-item>
    </el-sub-menu>
    
    <el-menu-item index="/profile">
      <el-icon><User /></el-icon>
      <span>个人资料</span>
    </el-menu-item>

    <el-menu-item index="/user" v-if="userRole === 'admin'">
      <el-icon><Monitor /></el-icon>
      <span>用户管理</span>
    </el-menu-item>

    <el-menu-item @click="scrollToTop" class="back-to-top" index="">
      <el-icon><Top /></el-icon>
      <span>返回顶部</span>
    </el-menu-item>

  </el-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Expand, Fold, HomeFilled, Monitor, User, Document,Top} from '@element-plus/icons-vue'
import { useScrollHide } from '@/composables/useScrollHide'
import { useAuthStore } from '@/store/modules/auth'


const authStore = useAuthStore()
const userRole = computed(() => authStore.userInfo?.role || '')


const { isScrolling } = useScrollHide()
const route = useRoute()
const isCollapsed = ref(true)
const emit = defineEmits(['toggle'])

// 当前激活的菜单项
const activeMenu = computed(() => route.path)


const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle', isCollapsed.value, isScrolling.value)
}

</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 170px;
}

.toggle-button {
  padding: 15px;
  text-align: center;
  cursor: pointer;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(129, 121, 121, 0.587);
}

.toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.el-menu {
  position: fixed; 
  top: 50%; 
  transform: translateY(-55%); 
  left: 0; 
  height: 60vh; 
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-top-right-radius: 10px;
  border-bottom-right-radius:10px;
  z-index: 999;
}

.back-to-top {
  position: absolute !important;
  bottom: 0;
  width: 100%;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.el-menu:not(.el-menu--collapse) .back-to-top {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}


.el-menu-item, .el-sub-menu__title {
  height: 56px;
  line-height: 56px;
}

.el-menu-item:hover, .el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.25) !important;
}

.el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.3) !important;
}



</style>
