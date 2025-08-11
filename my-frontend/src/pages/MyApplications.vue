<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 頁面標題 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">我的應徵</h1>
        <p class="text-gray-600">查看您的所有應徵記錄和狀態</p>
      </div>

      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">載入中...</p>
      </div>

      <!-- 應徵列表 -->
      <div v-else-if="applications.length > 0" class="space-y-4">
        <div v-for="application in applications" :key="application._id" class="bg-white rounded-lg shadow-md p-6">
          <!-- 應徵標題和狀態 -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ application.jobId?.jobTitle || '職缺標題載入中...' }}
              </h3>
              <p class="text-gray-600">{{ application.jobId?.companyName || '公司名稱載入中...' }}</p>
            </div>
            <div>
              <span :class="getStatusClass(application.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ getStatusText(application.status) }}
              </span>
            </div>
          </div>

          <!-- 應徵詳情 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-sm font-medium text-gray-500">應徵時間：</span>
              <span class="text-sm text-gray-700">{{ formatDate(application.createdAt) }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">最後更新：</span>
              <span class="text-sm text-gray-700">{{ formatDate(application.updatedAt) }}</span>
            </div>
          </div>

          <!-- 應徵內容預覽 -->
          <div class="border-t pt-4">
            <div class="mb-3">
              <span class="text-sm font-medium text-gray-500">履歷內容：</span>
              <p class="text-sm text-gray-700 mt-1 line-clamp-2">{{ application.resume }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">自我推薦信：</span>
              <p class="text-sm text-gray-700 mt-1 line-clamp-2">{{ application.coverLetter }}</p>
            </div>
          </div>

          <!-- 查看詳情按鈕 -->
          <div class="mt-4 pt-4 border-t">
            <button 
              @click="viewApplicationDetail(application)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              查看詳情 →
            </button>
          </div>
        </div>
      </div>

      <!-- 無應徵記錄 -->
      <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">還沒有應徵記錄</h3>
        <p class="text-gray-500 mb-4">開始瀏覽職缺並應徵您感興趣的工作吧！</p>
        <router-link 
          to="/jobs" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          瀏覽職缺
        </router-link>
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
const applications = ref([])
const loading = ref(true)
const error = ref('')

// 載入應徵記錄
const loadApplications = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('開始載入應徵記錄...')
    const response = await axios.get('/api/applications/my')
    console.log('API 回應:', response)
    applications.value = response.data
    console.log('載入應徵記錄成功', applications.value)
    console.log('應徵記錄數量:', applications.value.length)
  } catch (err) {
    console.error('載入應徵記錄失敗', err)
    console.error('錯誤詳情:', err.response?.data)
    error.value = '載入應徵記錄失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 取得狀態樣式
const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'shortlisted': 'bg-blue-100 text-blue-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// 取得狀態文字
const getStatusText = (status) => {
  const texts = {
    'pending': '待審核',
    'shortlisted': '已審核',
    'rejected': '已拒絕'
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

// 查看應徵詳情
const viewApplicationDetail = (application) => {
  // 這裡可以跳轉到詳情頁面或開啟彈窗
  console.log('查看應徵詳情', application)
  // 暫時先顯示 alert
  alert(`應徵詳情：\n職缺：${application.jobId?.jobTitle}\n狀態：${getStatusText(application.status)}`)
}

// 組件掛載時載入資料
onMounted(() => {
  loadApplications()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
