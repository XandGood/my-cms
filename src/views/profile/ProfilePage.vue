<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人资料</span>
        </div>
      </template>
      
      <el-form :model="userForm" :rules="rules" ref="formRef" label-width="100px">
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="avatar-upload">
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :headers="authHeader"
    >
      <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <div class="upload-tip">
      只能上传JPG/PNG文件，且不超过2MB
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const authStore = useAuthStore()
const formRef = ref(null)


const authHeader = {
  Authorization: `Bearer ${authStore.token}`
}

const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

const handleSuccess = (response) => {
  userForm.value.avatar = response.url
}


const userForm = ref({
  username: '',
  name: '',
  email: '',
  phone: '',
  bio: ''
})

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    {  message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await authStore.updateUserProfile(userForm.value)
        ElMessage.success('保存成功')
      } catch (error) {
        ElMessage.error(error.message+'保存失败')
      }
    }
  })
}

onMounted(async () => {
  const userInfo = await authStore.getUserInfo()
  userForm.value = { ...userInfo }
})
</script>

<style scoped>
.avatar-upload {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.upload-tip {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}
</style>
