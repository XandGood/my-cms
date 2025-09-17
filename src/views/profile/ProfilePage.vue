<template>
  <div class="user-center-container">
    <!-- 左侧侧边栏：用户信息 + 功能导航 -->
    <aside class="user-sidebar">
      <!-- 用户基础信息区 -->
      <div class="user-info-card">
        <!-- 头像上传 -->
        <div class="avatar-wrapper">
          <el-upload
            class="avatar-uploader"
            action="/api/avatar/upload"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :headers="authHeader"
            :on-progress="handleUploadProgress"
          >
            <div class="avatar-container">
              <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar-img" />
              <el-icon v-else class="avatar-placeholder"><User /></el-icon>
              <!-- 上传进度/更换提示 -->
              <div v-if="uploadLoading" class="avatar-mask">
                <el-progress type="circle" :percentage="uploadPercent" size="24" />
              </div>
              <div v-else class="avatar-mask hover-mask">
                <span class="mask-text">更换头像</span>
              </div>
            </div>
          </el-upload>
        </div>

        <!-- 用户名/标识 -->
        <div class="user-meta">
          <h3 class="username">{{ userForm.username || '未设置' }}</h3>
          <p class="user-id" v-if="userForm.id">ID: {{ userForm.id }}</p>
          <p class="user-role" v-if="userForm.role">
            <el-tag size="small" :type="userForm.role === 'admin' ? 'primary' : 'success'">
              {{ userForm.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </p>
        </div>
      </div>

      <!-- 功能导航菜单 -->
      <nav class="user-nav">
        <ul>
          <li class="nav-item active">
            <el-icon class="nav-icon"><UserFilled /></el-icon>
            <span class="nav-text">个人资料</span>
          </li>
          <li class="nav-item">
            <el-icon class="nav-icon"><Lock /></el-icon>
            <span class="nav-text">账号安全(待实现)</span>
          </li>
          <li class="nav-item">
            <el-icon class="nav-icon"><Bell /></el-icon>
            <span class="nav-text">通知设置(待实现)</span>
          </li>
          <li class="nav-item">
            <el-icon class="nav-icon"><Setting /></el-icon>
            <span class="nav-text">偏好设置(待实现)</span>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 右侧内容区：资料编辑表单 -->
    <main class="user-content">
      <div class="content-header">
        <h2 class="page-title">编辑个人资料</h2>
        <p class="page-desc">完善您的个人信息，让账号更安全</p>
      </div>

      <el-card class="form-card">
        <el-form 
          :model="userForm" 
          :rules="rules" 
          ref="formRef" 
          label-width="120px"
          class="profile-form"
        >
          <!-- 基础信息分组 -->
          <div class="form-group">
            <h3 class="group-title">基础信息</h3>
            <div class="form-row">
              <el-form-item label="姓名" prop="name" class="form-item">
                <el-input 
                  v-model="userForm.name" 
                  placeholder="请输入您的真实姓名"
                  maxLength="20"
                  show-word-limit
                />
              </el-form-item>
            </div>

            <div class="form-row">
              <el-form-item label="邮箱" prop="email" class="form-item">
                <el-input 
                  v-model="userForm.email" 
                  placeholder="请输入您的邮箱地址"
                  type="email"
                />
                <template #help>
                  用于账号登录和密码找回，建议填写常用邮箱
                </template>
              </el-form-item>
            </div>

            <div class="form-row">
              <el-form-item label="手机号" prop="phone" class="form-item">
                <el-input 
                  v-model="userForm.phone" 
                  placeholder="请输入您的手机号"
                  maxLength="11"
                  show-word-limit
                />
              </el-form-item>
            </div>
          </div>

          <!-- 个人简介分组 -->
          <div class="form-group">
            <h3 class="group-title">个人简介</h3>
            <div class="form-row">
              <el-form-item label="简介" prop="bio" class="form-item">
                <el-input 
                  v-model="userForm.bio" 
                  placeholder="简单介绍一下自己吧（可选）"
                  type="textarea"
                  rows="4"
                  maxLength="200"
                  show-word-limit
                />
              </el-form-item>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="submitLoading"
            >
              保存修改
            </el-button>
            <el-button 
              type="default" 
              @click="handleReset"
              :disabled="submitLoading"
              style="margin-left: 12px;"
            >
              重置
            </el-button>
          </div>
        </el-form>
      </el-card>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { ElMessage, ElProgress } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
// 新增图标引入
import { 
  User, 
  UserFilled, 
  Lock, 
  Bell, 
  Setting 
} from '@element-plus/icons-vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const formRef = ref(null)

// 新增：上传/提交状态管理
const uploadLoading = ref(false)
const uploadPercent = ref(0)
const submitLoading = ref(false)
// 原始用户信息（用于重置）
const originalUserForm = reactive({})

// 认证头（不变）
const authHeader = {
  Authorization: `Bearer ${authStore.token}`
}

// 头像上传前校验（保留原逻辑，新增loading）
const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像只能是 JPG/PNG 格式！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像大小不能超过 2MB！')
    return false
  }

  // 开始上传：显示loading
  uploadLoading.value = true
  uploadPercent.value = 0
  return true
}

// 新增：上传进度监听
const handleUploadProgress = (event) => {
  uploadPercent.value = Math.round((event.loaded / event.total) * 100)
}

// 头像上传成功（保留原逻辑，新增loading关闭）
const handleSuccess = (response) => {
  uploadLoading.value = false
  userForm.value.avatar = response.url
  ElMessage.success('头像更新成功！')
}

// 用户表单（补充id/role字段，用于侧边栏显示）
const userForm = ref({
  id: '',
  username: '',
  name: '',
  email: '',
  phone: '',
  bio: '',
  avatar: '',
  role: '' // 角色字段，用于侧边栏标签
})

// 表单规则（优化提示文案，保持校验逻辑）
const rules = {
  name: [
    { required: true, message: '请输入您的真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度需在 2-20 个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: false, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入格式正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { 
      required: false, 
      message: '请输入手机号', 
      trigger: 'blur' 
    },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入11位有效手机号', 
      trigger: 'blur' 
    }
  ],
  bio: [
    { 
      max: 200, 
      message: '个人简介不能超过 200 个字符', 
      trigger: 'blur' 
    }
  ]
}

// 提交表单（新增loading状态，防止重复提交）
const handleSubmit = async () => {
  if (!formRef.value) return
  submitLoading.value = true

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      await userStore.fetchUpdateUser(userForm.value)
      await authStore.getUserInfo(userForm.value.id)
      // 更新原始数据（用于后续重置）
      Object.assign(originalUserForm, { ...userForm.value })
      ElMessage.success('个人资料保存成功！')
    }
  } catch (error) {
    // 表单校验失败时，error为数组；接口失败时，error为Error对象
    const errorMsg = error instanceof Error 
      ? `${error.message}（保存失败）` 
      : '表单填写有误，请检查后重试'
    ElMessage.error(errorMsg)
  } finally {
    submitLoading.value = false
  }
}

// 重置表单（恢复到初始加载状态）
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    Object.assign(userForm.value, { ...originalUserForm })
  }
}

// 页面加载：获取用户信息（新增原始数据备份）
onMounted(async () => {
  try {
    const currentUser = await userStore.fetchGetUser(authStore.userInfo.id)
    userForm.value = { ...currentUser }
    // 备份原始信息，用于重置
    Object.assign(originalUserForm, { ...currentUser})
  } catch (error) {
    ElMessage.error(error.message || '获取用户信息失败，请刷新页面重试')
  }
})
</script>

<style scoped>
/* 整体容器：左右分栏 */
.user-center-container {
  display: flex;
  min-height: calc(100vh - 150px); /* 适配顶部导航栏高度 */
}

/* 左侧侧边栏 */
.user-sidebar {
  width: 260px;
  background-color: #fafbfc;
  border-right: 1px solid #ebeef5;
  padding: 24px 0;
  flex-shrink: 0;
}

/* 侧边栏-用户信息卡片 */
.user-info-card {
  padding: 0 24px 24px;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
}

/* 头像容器 */
.avatar-wrapper {
  margin-bottom: 16px;
}
.avatar-container {
  position: relative;
  display: inline-block;
}
.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 头像遮罩（hover/上传中） */
.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.hover-mask:hover {
  opacity: 1;
}
.mask-text {
  color: #fff;
  font-size: 14px;
}

/* 侧边栏-用户元信息 */
.user-meta {
  text-align: center;
}
.username {
  font-size: 18px;
  font-weight: 500;
  color: #1f2329;
  margin: 0 0 8px;
}
.user-id {
  font-size: 12px;
  color: #86909c;
  margin: 0 0 12px;
}
.user-role {
  margin: 0;
}

/* 侧边栏-导航菜单 */
.user-nav {
  margin-top: 24px;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: #4e5969;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}
.nav-item:hover {
  background-color: #f0f2f5;
  color: #165dff;
}
.nav-item.active {
  background-color: #e8f3ff;
  color: #165dff;
  border-left: 3px solid #165dff;
}
.nav-icon {
  margin-right: 12px;
  font-size: 16px;
}

/* 右侧内容区 */
.user-content {
  flex: 1;
  padding: 32px 48px;
  background-color: #fff;
  overflow-y: auto;
}

/* 内容区-标题 */
.content-header {
  margin-bottom: 24px;
}
.page-title {
  font-size: 24px;
  font-weight: 500;
  color: #1f2329;
  margin: 0 0 8px;
}
.page-desc {
  font-size: 14px;
  color: #86909c;
  margin: 0;
}

/* 内容区-表单卡片 */
.form-card {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  height: 80%;
}

/* 表单分组 */
.form-group {
  margin-bottom: 32px;
}
.group-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

/* 表单行/项 */
.form-row {
  margin-bottom: 20px;
}
.form-item {
  width: 100%;
  max-width: 600px; /* 限制表单宽度，提升可读性 */
}

/* 表单操作按钮区 */
.form-actions {
  margin-top: 40px;
  max-width: 600px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式适配：小屏幕折叠侧边栏 */
@media (max-width: 992px) {
  .user-sidebar {
    width: 80px;
    padding: 24px 0;
  }
  .user-info-card {
    padding: 0 8px 16px;
  }
  .user-meta, .nav-text {
    display: none; /* 隐藏文字，只保留图标 */
  }
  .nav-item {
    justify-content: center;
    padding: 16px 0;
  }
  .nav-icon {
    margin-right: 0;
    font-size: 20px;
  }
  .user-content {
    padding: 24px 16px;
  }
}
</style>