<template>
  <el-container class="main-layout">
    <!-- 头部组件 - 所有页面都包含 -->
    <HeaderComponent />
    
    <div class="layout-content">
      <!-- 侧边栏组件 - 除登录注册外的页面包含 -->
      <AsideComponent />
      
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
  box-sizing: border-box;
  max-width: 90%;
  margin: 0 auto;
  padding: 50px 20px 20px 20px;
}


/* 响应式调整 */
@media (max-width: 768px) {
  .page-content {
    margin-left: 0;
    width: 100%;
    padding: 15px;
  }
}
</style>
