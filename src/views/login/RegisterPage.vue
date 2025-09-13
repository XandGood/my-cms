<template>
  <div class="login-container">
    <el-container>
      <el-main>
        <el-card class="login-card">
          <el-header class="login-header">
            <h1>欢迎加入</h1>
            <p class="subtitle">请设置您的用户名和密码</p>
        </el-header>
          <el-form 
            :model="RegisterForm" 
            :rules="rules" 
            ref="RegisterFormRef"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="RegisterForm.username"
                placeholder="用户名"

                style="width: 360px;height: 50px;"
              />
            </el-form-item>

          <el-form-item prop="name">
              <el-input
                v-model="RegisterForm.name"
                placeholder="姓名"
                style="width: 360px;height: 50px;"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="RegisterForm.password"
                type="password"
                placeholder="密码"
                style="width: 360px;height: 50px;"
                show-password
              />
            </el-form-item>
            
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="RegisterForm.confirmPassword"
                type="password"
                placeholder="确认密码"
                style="width: 360px;height: 50px;"
                show-password
              />
            </el-form-item>
            
            <el-button 
              type="primary" 
              size="large" 
              class="login-button"
              @click="handleRegister"
              :loading="loading"
            >
              注册
            </el-button>

            <div class="register-link">
              已有账户？
              <el-link type="primary" @click="$router.push('/login')">返回登陆</el-link>
            </div>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../../store/modules/auth'
import { ElMessage } from 'element-plus'


const RegisterFormRef = ref(null)
const loading = ref(false)

const authStore = useAuthStore()

const RegisterForm = reactive({
  username: '',
  password: '',
  name: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== RegisterForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

const handleRegister = async () => {
  if (!RegisterFormRef.value) return
  
  await RegisterFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      authStore.register(RegisterForm).then(() => {
        window.location.href = '/login'
        ElMessage.success('注册成功，请登录')
      }).catch(() => {
        ElMessage.error('注册失败，请重试')
      })
      setTimeout(() => {
        loading.value = false
      }, 1500)
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/images/register-bg.png');
  background-size: cover;
  background-position: center;
  padding: 20px;
}
 
.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 520px;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  background: rgba(240, 228, 228, 0.694);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 16px;
}

.login-form {
  padding: 20px ;
}


.login-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}


.register-link {
  text-align: center;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #dbdfe8cf;
  padding: 12px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}



:deep(.el-form-item) {
  margin-bottom: 25px; 
}
:deep(.el-form-item__error) {
  padding-top: 3px;
  font-size: 12px;
}

@media (max-width: 480px) {
  .login-card {
    max-width: 100%;
  }
}
</style>
