<template>

      <div class="home-container">
        <!-- 欢迎区域 -->
        <div class="welcome-section">
          <h1>欢迎使用内容管理系统</h1>
          <p>一个简洁、高效的内容管理解决方案</p>
        </div>

        <!-- 快速操作卡片 -->
        <div class="quick-actions">
          <h2>快速操作</h2>
          <div class="action-cards">
            <div class="action-card">
              <el-icon size="40"><Document /></el-icon>
              <h3>创建内容</h3>
              <p>快速创建新的文章或页面</p>
              <el-button type="primary" size="small">开始创建</el-button>
            </div>
            <div class="action-card">
              <el-icon size="40"><DataLine /></el-icon>
              <h3>查看统计</h3>
              <p>了解网站访问和用户数据</p>
              <el-button type="primary" size="small">查看数据</el-button>
            </div>
            <div class="action-card">
              <el-icon size="40"><Setting /></el-icon>
              <h3>系统设置</h3>
              <p>配置系统参数和用户权限</p>
              <el-button type="primary" size="small">进入设置</el-button>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="recent-activity">
          <h2>最近活动</h2>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

</template>

<script setup>
import { ref } from 'vue'
import { Document, DataLine, Setting } from '@element-plus/icons-vue'

const activities = ref([
  {
    content: '更新了系统设置',
    timestamp: '2024-01-20 10:30',
    type: 'primary'
  },
  {
    content: '发布了新文章 "如何使用 CMS 系统"',
    timestamp: '2024-01-19 15:45',
    type: 'success'
  },
  {
    content: '添加了新用户 "editor1"',
    timestamp: '2024-01-18 09:15',
    type: 'info'
  },
  {
    content: '系统维护完成',
    timestamp: '2024-01-17 23:00',
    type: 'warning'
  }
])
</script>

<style scoped>
.home-container {
  padding: 85px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(129, 121, 121, 0.587) 0%, rgba(129, 121, 121, 0.387) 100%);
  border-radius: 10px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.welcome-section h1 {
  font-size: 2.2em;
  color: white;
  margin-bottom: 15px;
}

.welcome-section p {
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.9);
}

.quick-actions {
  margin-bottom: 30px;
}

.quick-actions h2 {
  font-size: 1.8em;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.action-card:hover {
  transform: translateY(-5px);
}

.action-card .el-icon {
  color: #409EFF;
  margin-bottom: 15px;
}

.action-card h3 {
  font-size: 1.3em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.action-card p {
  color: #666;
  margin-bottom: 20px;
}

.recent-activity {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.recent-activity h2 {
  font-size: 1.8em;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-cards {
    grid-template-columns: 1fr;
  }
  
  .welcome-section {
    padding: 30px 15px;
  }
  
  .welcome-section h1 {
    font-size: 1.8em;
  }
}
</style>
