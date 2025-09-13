<template>
  <el-container class="main-layout">
    <!-- 头部组件 - 所有页面都包含 -->
    <HeaderComponent />
    
    <div class="layout-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- 侧边栏组件 - 除登录注册外的页面包含 -->
      <AsideComponent @toggle="handleSidebarToggle" />
      
      <!-- 页面内容区域 -->
      <el-main class="page-content">
        <router-view />
      </el-main>
    </div>
  </el-container>
</template>

<script setup>
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
import AsideComponent from '@/components/layout/AsideComponent.vue'
import { ref } from 'vue'

const isSidebarCollapsed = ref(false)

const handleSidebarToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-content {
  display: flex;
  flex: 1;
  margin-top: 60px; 
}

.page-content {
  flex: 1;
  padding: 10px;
  margin-left: 0px; /* 默认侧边栏宽度 */
  transition: margin-left 0.3s ease;
  box-sizing: border-box;
  width: calc(100% - 200px); /* 计算内容区域宽度 */
}

.sidebar-collapsed .page-content {
  margin-left: 0px; /* 折叠后侧边栏宽度 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-content {
    margin-left: 0;
    width: 100%;
    padding: 15px;
  }
  
  .sidebar-collapsed .page-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>
