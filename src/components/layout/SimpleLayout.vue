<template>
  <div class="simple-layout">
    <!-- 头部组件 - 所有页面都包含 -->
    <HeaderComponent />
    
    <!-- 页面内容区域 -->
    <main class="page-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
</script>

<style scoped>
.simple-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 0px;
}
</style>
