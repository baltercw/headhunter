<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 頁面標題 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">職缺管理</h1>
        <p class="text-gray-600">管理所有已發布的職缺</p>
      </div>

      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">載入中...</p>
      </div>

      <!-- 職缺列表 -->
      <div v-else-if="jobs.length > 0" class="space-y-4">
        <div v-for="job in jobs" :key="job._id" class="bg-white rounded-lg shadow-md p-6">
          <!-- 職缺標題和狀態 -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{ job.jobTitle }}</h3>
              <p class="text-gray-600">{{ job.companyName }}</p>
              <p class="text-sm text-gray-500">{{ job.location }}</p>
            </div>
            <div class="text-right">
              <span :class="getStatusClass(job.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ getStatusText(job.status) }}
              </span>
            </div>
          </div>

          <!-- 職缺詳情 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-sm font-medium text-gray-500">薪資範圍：</span>
              <span class="text-sm text-gray-700">{{ job.salaryRange }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">工作模式：</span>
              <span class="text-sm text-gray-700">{{ job.isRemote ? '可遠端' : '需到場' }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">發布時間：</span>
              <span class="text-sm text-gray-700">{{ formatDate(job.createdAt) }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">聯絡信箱：</span>
              <span class="text-sm text-gray-700">{{ job.contactEmail }}</span>
            </div>
          </div>

          <!-- 工作描述預覽 -->
          <div class="mb-4">
            <span class="text-sm font-medium text-gray-500">工作描述：</span>
            <p class="text-sm text-gray-700 mt-1 line-clamp-3">{{ job.jobDescription }}</p>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex space-x-2 pt-4 border-t">
            <button
              v-if="job.status === 'active'"
              @click="updateJobStatus(job._id, 'inactive')"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              下架職缺
            </button>
            <button
              v-if="job.status === 'inactive'"
              @click="updateJobStatus(job._id, 'active')"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              上架職缺
            </button>
            <button
              @click="editJob(job)"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              編輯職缺
            </button>
            <button
              @click="viewJobDetails(job)"
              class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
            >
              查看詳情
            </button>
          </div>
        </div>
      </div>

      <!-- 無職缺資料 -->
      <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">還沒有職缺資料</h3>
        <p class="text-gray-500 mb-4">開始發布職缺吧！</p>
        <router-link 
          to="/admin/job-editor" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          發布職缺
        </router-link>
      </div>

      <!-- 成功訊息 -->
      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 資料狀態
const jobs = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')

// 載入職缺資料
const loadJobs = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get('/api/jobs/admin')
    jobs.value = response.data
    console.log('載入職缺資料成功', jobs.value)
  } catch (err) {
    console.error('載入職缺資料失敗', err)
    error.value = '載入職缺資料失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 更新職缺狀態
const updateJobStatus = async (jobId, newStatus) => {
  try {
    error.value = ''
    successMessage.value = ''
    
    await axios.put(`/api/jobs/${jobId}/status`, {
      status: newStatus
    })
    
    // 更新本地資料
    const job = jobs.value.find(j => j._id === jobId)
    if (job) {
      job.status = newStatus
      job.updatedAt = new Date().toISOString()
    }
    
    successMessage.value = `職缺狀態已更新為：${getStatusText(newStatus)}`
    console.log('職缺狀態更新成功')
    
    // 3秒後清除成功訊息
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('更新職缺狀態失敗', err)
    error.value = '更新職缺狀態失敗，請稍後再試'
  }
}

// 編輯職缺
const editJob = (job) => {
  // 將職缺資料存到 localStorage，然後跳轉到編輯器
  localStorage.setItem('editJobData', JSON.stringify(job))
  router.push('/admin/job-editor')
}

// 查看職缺詳情
const viewJobDetails = (job) => {
  // 跳轉到職缺詳情頁面
  router.push(`/job/${job._id}`)
}

// 取得狀態樣式
const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// 取得狀態文字
const getStatusText = (status) => {
  const texts = {
    'active': '上架中',
    'inactive': '已下架'
  }
  return texts[status] || '未知狀態'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知時間'
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 組件掛載時載入資料
onMounted(() => {
  loadJobs()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

