<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 頁面標題 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">應徵管理</h1>
        <p class="text-gray-600">查看和管理所有應徵</p>
      </div>

      <!-- 載入中 -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">載入中...</p>
      </div>

      <!-- 應徵列表 -->
      <div v-else-if="applications.length > 0" class="space-y-4">
        <div 
          v-for="application in applications" 
          :key="application._id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <!-- 應徵者資訊 -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ application.name }}
              </h3>
              <p class="text-gray-600">{{ application.email }}</p>
              <p class="text-gray-600">{{ application.phone }}</p>
            </div>
            <div class="text-right">
              <span 
                :class="getStatusClass(application.status)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ getStatusText(application.status) }}
              </span>
            </div>
          </div>

          <!-- 職缺資訊 -->
          <div class="bg-gray-50 p-4 rounded mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">應徵職缺</h4>
            <p class="text-gray-700">
              {{ application.jobId?.jobTitle }} - {{ application.jobId?.companyName }}
            </p>
          </div>

          <!-- 履歷 -->
          <div class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">履歷</h4>
            <div class="bg-gray-50 p-4 rounded max-h-32 overflow-y-auto">
              <p class="text-gray-700 whitespace-pre-line">{{ application.resume }}</p>
            </div>
          </div>

          <!-- 自我推薦信 -->
          <div class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">自我推薦信</h4>
            <div class="bg-gray-50 p-4 rounded max-h-32 overflow-y-auto">
              <p class="text-gray-700 whitespace-pre-line">{{ application.coverLetter }}</p>
            </div>
          </div>

          <!-- 應徵時間 -->
          <div class="text-sm text-gray-500 mb-4">
            應徵時間：{{ formatDate(application.createdAt) }}
          </div>

          <!-- 狀態管理按鈕 -->
          <div class="flex space-x-2">
            <button
              v-if="application.status === 'pending'"
              @click="updateStatus(application._id, 'shortlisted')"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              標記為已審核
            </button>
            <button
              v-if="application.status === 'shortlisted'"
              @click="updateStatus(application._id, 'rejected')"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              拒絕應徵
            </button>
          </div>
        </div>
      </div>

      <!-- 無應徵資料 -->
      <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
        <p class="text-gray-600">目前尚無應徵資料</p>
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
import axios from 'axios'

// 資料狀態
const applications = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')

// 載入應徵資料
onMounted(async () => {
  try {
    const res = await axios.get('/api/applications')
    applications.value = res.data
    console.log('應徵資料', applications.value)
  } catch (err) {
    console.log('取得應徵失敗', err)
    error.value = '無法載入應徵資料'
  } finally {
    loading.value = false
  }
})

// 更新應徵狀態
const updateStatus = async (applicationId, newStatus) => {
  try {
    error.value = ''
    successMessage.value = ''
    
    await axios.put(`/api/applications/${applicationId}/status`, {
      status: newStatus
    })
    
    // 更新本地資料
    const application = applications.value.find(app => app._id === applicationId)
    if (application) {
      application.status = newStatus
      application.updatedAt = new Date().toISOString()
    }
    
    successMessage.value = `應徵狀態已更新為：${getStatusText(newStatus)}`
    console.log('狀態更新成功')
    
    // 3秒後清除成功訊息
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.log('更新狀態失敗', err)
    error.value = '更新狀態失敗，請稍後再試'
  }
}

// 取得狀態樣式
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status] || classes.pending
}

// 取得狀態文字
const getStatusText = (status) => {
  const texts = {
    pending: '待審核',
    shortlisted: '已審核',
    rejected: '已拒絕'
  }
  return texts[status] || '待審核'
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW')
}
</script> 