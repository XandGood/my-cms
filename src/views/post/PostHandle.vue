<template>
  <div class="article-handle-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h2>{{ title }}</h2>
        </div>
      </template>

      <el-form 
        :model="articleInfo" 
        label-width="100px"
        class="article-form"
        :rules="rules"
        ref="formRef"
      >
        <!-- 文章标题 -->
        <el-form-item label="文章标题" prop="title">
          <el-input 
            v-model="articleInfo.title"
            placeholder="请输入文章标题"
          />
        </el-form-item>

        <!-- 文章分类 -->
        <el-form-item label="文章分类"  prop="categoryId">
          <el-select 
            v-model="articleInfo.categoryId"
            placeholder="请选择分类"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <!-- 文章状态 -->
        <el-form-item label="文章状态" prop="status">
          <el-radio-group v-model="articleInfo.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">已发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 文章内容 -->
        <el-form-item label="文章内容" prop="content">
          <div class="markdown-editor">
            <div class="editor-toolbar">
              <el-button-group>
                <el-button size="small" @click="insertMarkdown('**', '**')">加粗</el-button>
                <el-button size="small" @click="insertMarkdown('*', '*')">斜体</el-button>
                <el-button size="small" @click="insertMarkdown('## ', '')">标题</el-button>
                <el-button size="small" @click="insertMarkdown('\n- ', '')">列表</el-button>
                <el-button size="small" @click="insertMarkdown('\n```\n', '\n```')">代码块</el-button>
                <el-button size="small" @click="insertMarkdown('[', '](url)')">链接</el-button>
                <el-button size="small" @click="insertMarkdown('![', '](url)')">图片</el-button>
              </el-button-group>
            </div>
            <div class="editor-container">
              <div class="editor-input">
                <el-input
                  v-model="articleInfo.content"
                  type="textarea"
                  :rows="15"
                  placeholder="请输入 Markdown 内容"
                  @input="updatePreview"
                />
              </div>
              <div class="editor-preview" v-html="previewContent"></div>
            </div>
          </div>
        </el-form-item>



        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSave">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/store/modules/articles'
import { useCategoryStore } from '@/store/modules/category'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const articleStore = useArticlesStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const categories = ref([])
const previewContent = ref('')
const formRef = ref(null)
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择文章状态', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, message: '内容至少需要 10 个字符', trigger: 'blur' }
  ]
}
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value
    }
    return ''
  }
})

// 更新预览
const updatePreview = () => {
  previewContent.value = md.render(articleInfo.value.content || '')
}

// 插入 Markdown 语法
const insertMarkdown = (prefix, suffix) => {
  const textarea = document.querySelector('.el-textarea__inner')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = articleInfo.value.content
  const beforeText = text.substring(0, start)
  const afterText = text.substring(end)
  const selectedText = text.substring(start, end)
  
  articleInfo.value.content = beforeText + prefix + selectedText + suffix + afterText
  updatePreview()
  
  // 设置光标位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length)
  })
}


const isEdit = computed(() => route.params.id !== 'new')
const articleId = computed(() => isEdit.value ? route.params.id : null)
const articleInfo = ref({})
const title = computed(() => isEdit.value ? '编辑文章' : '新建文章')
const userInfoId = computed(() => authStore.userInfo?.id || '')

// 获取分类列表
const getCategories = async () => {
  categories.value = await categoryStore.fetchCategoryList()
}

// 保存文章
const onSave = async () => {
  try {
    await formRef.value.validate()
    articleInfo.value.authorId = userInfoId.value
    const date = new Date()
    articleInfo.value.createdAt = date.toISOString().replace(/\.\d+Z$/, 'Z')
    console.log(articleInfo.value)
    if (isEdit.value) {
      await articleStore.editArticle({
        ...articleInfo.value,
        id: articleId.value
      })
    } else {
      await articleStore.createArticle(articleInfo.value)
    }
    ElMessage.success('保存成功')
    goBack()
  } catch (error) {
    ElMessage.error('保存失败',error)
  }
}

// 返回列表页
const goBack = () => {
  router.push('/post')
}

onMounted(async () => {
  await getCategories()
  
  if (isEdit.value) {
    articleInfo.value = await articleStore.fetchArticleById(articleId.value)
  } else {
    articleInfo.value = articleStore.resetArticle()
    // 设置默认状态为草稿
    articleInfo.value.status = 'draft'
  }
})

onUnmounted(() => {
  articleStore.resetArticle()
})
</script>

<style scoped>
.article-handle-container {
  margin-top: 0px;
  padding: 1rem;
  background-color: #f8fafc;
  min-height: calc(100vh-80px);
  border-radius: 10px;
}

/* 卡片样式 */
.form-card {
  max-width: 2000px;
  margin: 0 auto;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

/* 卡片头部样式 */
.card-header {
  padding: 1.5rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  position: relative;
  padding-left: 0.75rem;
}

.card-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.25rem;
  background-color: #3b82f6;
  border-radius: 2px;
}

/* 表单样式 */
.article-form {
  padding: 2rem;
  background-color: #ffffff;
}

/* 表单项样式 */
.el-form-item {
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.el-form-item:hover {
  background-color: rgba(59, 130, 246, 0.02);
}

.el-form-item__label {
  font-weight: 500;
  color: #334155;
  font-size: 0.95rem;
  padding: 0.6rem 0.5rem 0.6rem 0;
}

/* 输入框样式 */
.el-input__inner, 
.el-select__inner,
.el-textarea__inner {
  border-radius: 8px;
  border-color: #e2e8f0;
  padding: 0.65rem 1rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.el-input__inner:focus, 
.el-select__inner:focus,
.el-textarea__inner:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

/* 文本域样式 */
.el-textarea__inner {
  min-height: 300px;
  resize: vertical;
  line-height: 1.6;
}

/* 单选按钮样式 */
.el-radio-group {
  display: flex;
  gap: 1.5rem;
  padding-top: 0.3rem;
}

.el-radio {
  color: #475569;
  transition: all 0.2s ease;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #3b82f6;
  background-color: #3b82f6;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #3b82f6;
  font-weight: 500;
}

/* 按钮样式 */
.el-form-item:last-child {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.el-button {
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.el-button--primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.el-button--primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.el-button:not(.el-button--primary) {
  color: #64748b;
  border-color: #e2e8f0;
  background-color: #f8fafc;
}

.el-button:not(.el-button--primary):hover {
  color: #3b82f6;
  border-color: #bfdbfe;
  background-color: #f1f5f9;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-handle-container {
    padding: 1rem;
  }
  
  .form-card {
    border-radius: 8px;
  }
  
  .card-header,
  .article-form {
    padding: 1rem;
  }
  
  .card-header h2 {
    font-size: 1.25rem;
  }
  
  .el-form-item__label {
    width: 70px;
    font-size: 0.9rem;
  }
  
  .el-radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .el-form-item:last-child {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .el-button {
    width: 100%;
  }
}

/* Markdown 编辑器样式 */
.markdown-editor {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

.editor-toolbar {
  padding: 0.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.editor-container {
  display: flex;
  height: 500px;
}

.editor-input {
  flex: 1;
  padding: 1rem;
}

.editor-input :deep(.el-textarea__inner) {
  border: none;
  padding: 0;
  font-family: monospace;
  resize: none;
  height: 480px !important;
}

.editor-preview {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  border-left: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.editor-preview :deep(h1),
.editor-preview :deep(h2),
.editor-preview :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.editor-preview :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.editor-preview :deep(pre) {
  background-color: #f6f8fa;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.editor-preview :deep(code) {
  background-color: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.editor-preview :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6a737d;
}

.editor-preview :deep(ul),
.editor-preview :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 1rem;
}

.editor-preview :deep(li) {
  margin-bottom: 0.25rem;
}

.editor-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
}

.editor-preview :deep(th),
.editor-preview :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 0.5rem 1rem;
}

.editor-preview :deep(th) {
  background-color: #f6f8fa;
}

.editor-preview :deep(img) {
  max-width: 100%;
  height: auto;
}


</style>
