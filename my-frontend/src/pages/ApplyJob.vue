<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- 職缺資訊區塊 -->
      <div v-if="job" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          應徵職缺：{{ job.jobTitle }}
        </h1>
        <p class="text-gray-600 mb-4">{{ job.companyName }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-semibold">地點：</span>{{ job.location }}
          </div>
          <div>
            <span class="font-semibold">薪資：</span>{{ job.salaryRange }}
          </div>
          <div>
            <span class="font-semibold">工作模式：</span>
            {{ job.isRemote === 'true' ? '可遠端' : '需到場' }}
          </div>
        </div>
      </div>

      <!-- 應徵表單 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-6">應徵表單</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 自動填入提示 -->
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-blue-800 text-sm">
                基本資料已從您的個人資料自動填入，您可以直接修改或補充履歷和自我推薦信。
              </span>
            </div>
          </div>
          
          <!-- 基本資料 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                姓名 *
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入您的姓名"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                電子郵件 *
              </label>
              <input
                v-model="formData.email"
                type="email"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入您的電子郵件"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 *
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入您的聯絡電話"
                required
              />
            </div>
          </div>

          <!-- 履歷 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              履歷 *
            </label>
            <textarea
              v-model="formData.resume"
              rows="8"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請詳細描述您的工作經驗、技能、教育背景等..."
              required
            ></textarea>
          </div>

          <!-- 自我推薦信 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              自我推薦信 *
            </label>
            <textarea
              v-model="formData.coverLetter"
              rows="6"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請說明為什麼您適合這個職位，以及您能為公司帶來什麼價值..."
              required
            ></textarea>
          </div>

          <!-- 按鈕區域 -->
          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '提交中...' : '提交應徵' }}
            </button>
            <button
              type="button"
              @click="goBack"
              class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              返回
            </button>
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- 成功訊息 -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-green-800 font-medium">{{ successMessage }}</span>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="router.push('/my-applications')"
                class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                查看我的應徵
              </button>
              <button 
                @click="router.push('/jobs')"
                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
              >
                繼續瀏覽職缺
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const jobId = route.params.jobId

// 資料狀態
const job = ref(null)
const formData = ref({
  name: '',
  email: '',
  phone: '',
  resume: '',
  coverLetter: ''
})

// UI 狀態
const isSubmitting = ref(false)
const error = ref('')
const successMessage = ref('')

// 載入職缺資料和個人資料
onMounted(async () => {
  try {
    // 載入職缺資料
    const res = await axios.get(`/api/jobs/${jobId}`)
    job.value = res.data
    console.log('職缺資料', job.value)
    
    // 載入個人資料並自動填入
    await loadUserProfile()
  } catch (err) {
    console.log('取得職缺失敗', err)
    error.value = '無法載入職缺資料'
  }
})

// 載入用戶個人資料並自動填入
const loadUserProfile = async () => {
  try {
    const response = await axios.get('/api/auth/profile')
    if (response.data.user?.profile) {
      const profile = response.data.user.profile
      
      // 自動填入基本資料
      formData.value.name = profile.name || ''
      formData.value.email = response.data.user.email || ''
      formData.value.phone = profile.phone || ''
      
      // 如果有履歷，也可以自動填入
      if (profile.resume) {
        formData.value.resume = profile.resume
      }
      
      console.log('個人資料已自動填入', formData.value)
    }
  } catch (err) {
    console.log('載入個人資料失敗', err)
  }
}

// 提交應徵
const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.phone || !formData.value.resume || !formData.value.coverLetter) {
    error.value = '請填寫所有必填欄位'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    await axios.post('/api/applications', {
      jobId: jobId,
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      resume: formData.value.resume,
      coverLetter: formData.value.coverLetter
    })

    successMessage.value = '應徵提交成功！'

  } catch (err) {
    console.log('提交應徵失敗', err)
    error.value = err.response?.data?.message || '提交應徵失敗，請稍後再試'
  } finally {
    isSubmitting.value = false
  }
}

// 返回上一頁
const goBack = () => {
  router.back()
}
</script> 