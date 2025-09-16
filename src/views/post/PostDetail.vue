<template>
  <div class="post-detail-container">
    
    <div class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="author">作者：{{ userName }}</span>
        <span class="date">{{ formatDate(article.createdAt) }}</span>
        <el-tag :type="article.status === 'published' ? 'success' : 'info'">
          {{ article.status === 'published' ? '已发布' : '草稿' }}
        </el-tag>
      </div>
    </div>

    <div class="article-content">
      <div class="content-text" v-html="parseContent(article.content)"></div>
    </div>

    <div class="article-footer">
      <div class="article-actions">
        <el-button v-if="isAuthor" type="primary" @click="handleEdit">编辑</el-button>
        <el-button v-if="isAuthor || isAdmin" type="danger" @click="handleDelete">删除</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/store/modules/articles'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const route = useRoute()
const router = useRouter()
const articleStore = useArticlesStore()
const authStore = useAuthStore()
const userStore = useUserStore()

const article = ref({})
const isAuthor = computed(() => authStore.userInfo?.id === article.value.authorId)
const isAdmin = computed(() => authStore.userInfo?.role === 'admin')
const userName = ref('')

const getUsername = async () => {
  const user =  await userStore.fetchGetUser(article.value.authorId)
  userName.value = user.name
}

// 初始化 markdown-it
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value
    }
    return ''
  }
})

// 获取文章详情
const getArticleDetail = async () => {
  const id = route.params.id
  article.value = await articleStore.fetchArticleById(id)
}

const parseContent = (content) => {
  if (!content) return ''
  return md.render(content)
}



// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 编辑文章
const handleEdit = () => {
  router.push(`/post/handle/${article.value.id}`)
}

// 删除文章
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await articleStore.deleteArticleById(article.value.id)
      ElMessage.success('删除成功')
      router.push('/post')
    } catch (error) {
      console.error(error)
    }
  })
}

// 返回列表
const handleBack = () => {
  router.push('/post')
}

onMounted(async () => {
  await getArticleDetail()
  getUsername()
})
</script>

<style scoped>
.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.article-title {
  font-size: 2em;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.article-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  color: #666;
}

.article-content {
  margin-bottom: 30px;
}

.content-text {
  line-height: 1.8;
  color: #333;
}

/* Markdown 内容样式 */
.content-text :deep(h1) {
  font-size: 2em;
  margin: 1em 0;
  font-weight: 600;
}

.content-text :deep(h2) {
  font-size: 1.5em;
  margin: 0.83em 0;
  font-weight: 600;
}

.content-text :deep(h3) {
  font-size: 1.17em;
  margin: 1em 0;
  font-weight: 600;
}

.content-text :deep(p) {
  margin: 1em 0;
}

.content-text :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
  margin: 1em 0;
}

.content-text :deep(code) {
  background-color: rgba(175,184,193,0.2);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.content-text :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.content-text :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  padding-left: 16px;
  margin: 1em 0;
  color: #6a737d;
}

.content-text :deep(ul),
.content-text :deep(ol) {
  padding-left: 2em;
  margin: 1em 0;
}

.content-text :deep(li) {
  margin: 0.5em 0;
}

.content-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.content-text :deep(th),
.content-text :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.content-text :deep(th) {
  background-color: #f6f8fa;
  font-weight: 600;
}

.content-text :deep(img) {
  max-width: 100%;
  height: auto;
}

.article-footer {
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.article-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .post-detail-container {
    padding: 15px;
  }

  .article-title {
    font-size: 1.5em;
  }

  .article-meta {
    flex-direction: column;
    gap: 10px;
  }

  .article-actions {
    flex-direction: column;
  }
}
</style>

