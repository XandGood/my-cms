<template>
      <div class="home-container">
        <!-- 欢迎区域 -->
        <div class="welcome-section">
          <h1>欢迎使用墨记云博</h1>
          <p>简洁高效的云端博客系统，让每一段思考都有处安放</p>
        </div>
          <el-carousel height="580px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
             <el-image :src="item.url" :alt="item.title" class="carousel-image" fit="cover" lazy/>
          </el-carousel-item>
        </el-carousel>

        <!-- 快速操作卡片 -->
        <div class="quick-actions">
          <h2>快速操作</h2>
          <div class="action-cards">
            <div class="action-card">
              <el-icon size="40"><Document /></el-icon>
              <h3>创建内容</h3>
              <p>快速创建新的文章或页面</p>
              <el-button type="primary" size="small" @click="$router.push('/post/handle/new')">开始创建</el-button>
            </div>
            <div class="action-card">
              <el-icon size="40"><Setting /></el-icon>
              <h3>个人中心</h3>
              <p>上传喜欢的头像和完善信息</p>
              <el-button type="primary" size="small">个人中心</el-button>
            </div>
          </div>
        </div>
        
        <!-- 近期数据-->
        <div class="recent-data">
          <div class="recent-data-header">
            <h2>近期数据 </h2>           
          </div>
          <div class="data-overview">
            <div class="data-card">
              <div class="data-value">{{userList.length * 7}}</div>
              <div class="data-label">用户总量</div>
            </div>
            <div class="data-card">
              <div class="data-value">{{ articlesCount * 58}}</div>
              <div class="data-label">文章总量</div>
            </div>
            <div class="data-card">
              <div class="data-value">{{recentArticleCount * 27}}</div>
              <div class="data-label">近期发文数量</div>
            </div>
          </div>
  
          <!-- 图表容器 -->
          <div class="chart-container" ref="chartRef"></div>

          
          
        </div>
      </div>

</template>

<script setup>
import { Document,  Setting } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { computed, onBeforeMount, onMounted, ref} from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useArticlesStore } from '@/store/modules/articles'

const userStore = useUserStore()
const articleStore = useArticlesStore()

const chartRef = ref(null)
const userList = ref([])

const monthlyCounts = articleStore.monthlyArticleCounts;
const labels = articleStore.monthLabels;
const articlesCount = articleStore.totalArticlesCount;


const carouselImages = [
  {
    url: '/images/banner_1.jpg',
    title: '墨记云博'
  },
  {
    url: '/images/banner_2.jpg',
    title: '简洁高效'
  },
  {
    url: '/images/banner_3.jpg',
    title: '云端存储'
  }
]

const recentArticleCount = computed(() => {
  return  monthlyCounts.reduce((sum, count) => sum + count, 0);
})

onBeforeMount( async () => {
  userList.value =  await userStore.getUserList()
  await articleStore.getArticlesLength()
  await articleStore.getMonthlyArticleCounts()
})

onMounted(() => {
  if (chartRef.value) {
    const chart = echarts.init(chartRef.value)
    
    // 图表配置
    const option = {
      title: {
        text: '近期发文趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '发文数量',
          type: 'line',
          data: monthlyCounts.map(count => count * 17),
          smooth: true
        }
      ]
    }
    
    // 设置图表配置
    chart.setOption(option)
    
    // 响应式调整
    window.addEventListener('resize', () => {
      chart.resize()
    })
  }
})


</script>

<style scoped>
.home-container {
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(169, 144, 144, 0.587) 0%, rgba(132, 119, 119, 0.387) 100%);
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

/* 轮播图样式 */
.el-carousel {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
}

.carousel-item-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: white;
}

.carousel-title h3 {
  margin: 0;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .carousel-title h3 {
    font-size: 18px;
  }
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

.recent-data {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.recent-data-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.recent-data-header h2 {
  font-size: 1.8em;
  color: #2c3e50;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
  margin: 0;
  margin-right: 10px; 
}


.data-overview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.data-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  flex: 1;
  margin: 0 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-card:first-child {
  margin-left: 0;
}

.data-card:last-child {
  margin-right: 0;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.data-label {
  font-size: 14px;
  color: #666;
}

.chart-container {
  width: 100%;
  height: 300px;
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

   .data-overview {
    flex-direction: column;
  }
  
  .data-card {
    margin: 0 0 10px 0;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>
