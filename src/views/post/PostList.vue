<template>
  <div class="post-list-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>文章列表</h2>
      <el-button type="primary" @click="handleCreate">新建文章</el-button>
    </div>

    <!-- 主内容区（全局滚动） -->
    <div class="main-content">
      <div class="left-content">
        <!-- 文章列表 -->
        <div class="article-grid">
          <div v-for="article in articleList" :key="article.id" class="article-card">
            <div class="article-header">
              <h3 class="article-title">{{ article.title }}</h3>
              <el-tag :type="article.status === 'published' ? 'success' : 'info'" size="small">
                {{ article.status === 'published' ? '已发布' : '草稿' }}
              </el-tag>
            </div>
            
            <div class="article-content">
              <p class="article-excerpt">{{ article.content.substring(0, 100) }}...</p>
            </div>

            <div class="article-meta">
              <div class="meta-info">
                <span class="category">{{ getCategoryName(article.categoryId) }}</span>
                <span class="date">{{ formatDate(article.createdAt) }}</span>
              </div>
              <div class="article-actions">
                <el-button type="primary" link @click="handleEdit(article)">编辑</el-button>
                <el-button type="danger" link @click="handleDelete(article)">删除</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载状态提示 -->
        <div v-if="isLoading" class="loading-tip">加载更多文章...</div>
        <div v-if="!hasMore && !isLoading" class="no-more-tip">已加载全部文章</div>
      </div>

      <!-- 右侧分类栏 -->
      <div class="right-content">
        <div class="right-sidebar">
          <div class="category-nav">
            <h3>文章分类</h3>
            <el-menu>
              <el-menu-item v-for="category in categories" :key="category.id">
                {{ category.name }}
                <span class="category-count">({{ categoryCounts[category.id] || 0 }})</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useArticlesStore } from '@/store/modules/articles';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useCategoryStore } from '@/store/modules/category';
import { useWindowInfiniteScroll } from '@/composables/useInfiniteScroll';

// 状态管理
const categoryStore = useCategoryStore();
const articleStore = useArticlesStore();
const categories = ref([]);
const categoryCounts = ref({});

// 定义接口请求函数（根据页码加载数据）
const fetchArticles = async (page) => {
  // 实际项目中可传入搜索参数
  const res = await articleStore.getArticlesListByPage(page, 8);
  return res;
};

//  使用全局滚动
const {
  list: articleList, // 文章列表数据
  isLoading,         // 加载状态
  hasMore,           // 是否有更多数据
  reset              // 重置列表（用于搜索）
} = useWindowInfiniteScroll(fetchArticles, {
  threshold: 150,    // 距离底部150px时触发加载
  immediate: true    // 初始化时自动加载第一页
});

// 获取分类相关数据
const getCategoryList = async () => {
  const res = await categoryStore.fetchCategoryList();
  categories.value = res;
};

const getCategoryCounts = async () => {
  const counts = await articleStore.getArticleCountsByCategory();
  categoryCounts.value = counts;
};

// 辅助函数
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => String(c.id) === String(categoryId));
  return category ? category.name : '未分类';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};



// 删除文章后重置列表
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await articleStore.deleteArticle(row.id);
      reset(); // 删除后重置列表
      ElMessage.success('删除成功');
    } catch (error) {
      console.error(error);
    }
  });
};

// 初始化分类数据
onMounted(async () => {
  await getCategoryList();
  await getCategoryCounts();
});

// 其他未实现的方法（根据实际需求补充）
// const handleCreate = () => { /* 新建文章逻辑 */ };
// const handleEdit = (article) => { /* 编辑文章逻辑 */ };
</script>

<style scoped>
/* 关键：不限制容器高度，让内容自然撑开页面 */
.post-list-container {
  padding: 20px;
  /* 移除固定高度和overflow，确保页面能全局滚动 */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(146, 126, 126, 0.521) 100%, rgba(187, 161, 161, 0.587) 0%);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.main-content {
  display: flex;
  gap: 20px;
}

.left-content {
  flex: 1;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 60px; /* 底部留足够空间，确保最后一次加载能触发 */
}

.article-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
}

.article-title {
  margin: 0;
  font-size: 1.2em;
  color: #2c3e50;
  flex: 1;
  margin-right: 10px;
}

.article-content {
  margin-bottom: 15px;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.meta-info {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #999;
}

.category {
  color: #409EFF;
}

.date {
  color: #999;
}

.article-actions {
  display: flex;
  gap: 10px;
}

/* 加载提示样式 */
.loading-tip, .no-more-tip {
  text-align: center;
  padding: 30px 0;
  color: #666;
  font-size: 1em;
}

/* 右侧边栏样式 */
.right-content {
  width: 200px;
}

.right-sidebar {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.category-nav {
  margin-bottom: 20px;
}

.category-nav h3 {
  margin: 0;
  font-size: 1em;
  color: #333;
  margin-bottom: 10px;
}

.category-nav .el-menu {
  border: none;
}

.category-nav .el-menu-item {
  color: #333;
  font-size: 0.9em;
  padding: 10px 0;
}

.category-nav .el-menu-item:hover {
  color: #409EFF;
}

.category-nav .category-count {
  color: #999;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  .right-content {
    width: 100%;
  }
}
</style>