<template>
  <div class="user-list-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>用户列表</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户名"
        style="width: 200px"
        :prefix-icon="Search"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table :data="userList" style="width: 100%" v-loading="loading" class="table-user" size="large">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="role" label="角色" column-key="role" 
       :filters="[
        { text: 'user', value: 'user' },
        { text: 'editor', value: 'editor' },
        { text: 'admin', value: 'admin' },
      ]"
      :filter-method="filterHandler"
      filter-class-name ="filter-class"
      />
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑用户对话框-->
    <el-dialog title="编辑用户" v-model="editDialogVisible" width="30%">
      <el-form :model="editUserForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editUserForm.role" placeholder="请选择角色">
            <el-option label="user" value="user"></el-option>
            <el-option label="editor" value="editor"></el-option>
            <el-option label="admin" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer"></span>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[5, 10]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'

const userStore = useUserStore()
const authStore = useAuthStore()
const currentUserId = authStore.userInfo?.id
     
const loading = ref(false)
const userList = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const editDialogVisible = ref(false)


const getUserTotal = async () => {
  const res = await userStore.getUserList()
  total.value = res.length
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const res = await userStore.fetchGetUserByPage(currentPage.value, pageSize.value)
    await getUserTotal()
    userList.value = res
    authStore.getUserInfo(currentUserId)
  } finally {
    loading.value = false

  }
}

const editUserForm = ref({
  username: '',
  name: '',
  role: ''
})


const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}


// 搜索处理
const handleSearch = async () => {
  if(searchQuery.value === '') {
    getUserList()
  }else {
    currentPage.value = 1
    const res = await userStore.fetchSearchUser(searchQuery.value)
    total.value = res.length
    userList.value = res
  }

}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  getUserList(currentPage.value, pageSize.value)
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getUserList(currentPage.value, pageSize.value)
}


const handleEdit = async (row) => {
  editDialogVisible.value = true
  editUserForm.value = { ...row }
}

const handleEditConfirm = async () => {
  try {
    await userStore.fetchUpdateUser(editUserForm.value)
    editDialogVisible.value = false
    getUserList()
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await userStore.fetchDeleteUser(row.id)
      getUserList()
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })
}

onMounted(() => {
  getUserList()
})
</script>

<style scoped>
.user-list-container {
  
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 0px;
  padding: 20px;
  background: linear-gradient(135deg,  rgba(146, 126, 126, 0.521) 100%,rgba(187, 161, 161, 0.587) 0%);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  color: white;
  font-size: 1.8em;
  margin: 0;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.search-area {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.table-user {
  font-size: 1.1rem;
}


.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 80px;
}
</style>
