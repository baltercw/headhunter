<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">上架職缺編輯器</h1>

      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">載入中...</p>
      </div>

      <!-- 工作表單 -->
      <form v-else @submit.prevent="submitJob" class="space-y-8">
        <!-- 基本資訊區塊 -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">基本資訊</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">公司名稱 *</label>
              <input
                v-model="jobForm.companyName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入公司名稱"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">職缺名稱 *</label>
              <input
                v-model="jobForm.jobTitle"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入職缺名稱"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">工作地點 *</label>
              <input
                v-model="jobForm.location"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：台北市信義區"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">薪資範圍 *</label>
              <input
                v-model="jobForm.salaryRange"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：月薪 50,000-80,000"
              />
            </div>
          </div>
        </div>

        <!-- 聯絡資訊區塊 -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">聯絡資訊</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">聯絡信箱 *</label>
              <input
                v-model="jobForm.contactEmail"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入聯絡信箱"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">工作模式</label>
              <div class="flex items-center space-x-4 h-10">
                <label class="flex items-center">
                  <input
                    v-model="jobForm.isRemote"
                    type="checkbox"
                    class="mr-2"
                  />
                  遠端工作
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 詳細描述區塊 -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">詳細描述</h3>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">工作描述 *</label>
              <textarea
                v-model="jobForm.jobDescription"
                rows="6"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請詳細描述工作內容、職責範圍..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">職位要求 *</label>
              <textarea
                v-model="jobForm.requirement"
                rows="6"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請描述應徵者需要具備的技能、經驗、學歷等要求..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 按鈕 -->
        <div class="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            重置
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
          >
            {{ saving ? '上架中...' : '上架職缺' }}
    </button>
        </div>
      </form>

      <!-- 成功訊息 -->
      <div v-if="successMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 響應式變數
const loading = ref(false)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// 工作表單
const jobForm = ref({
    companyName: '',
    jobTitle: '',
  jobDescription: '',
  requirement: '',
  location: '',
  isRemote: false,
  salaryRange: '',
  contactEmail: ''
})

// 頁面載入時讀取 localStorage 資料
onMounted(() => {
    const prefillJobData = localStorage.getItem('prefillJobData')
  if (prefillJobData) {
    try {
            const parsed = JSON.parse(prefillJobData)
      jobForm.value = { ...jobForm.value, ...parsed }
    } catch (err) {
            console.log('prefill 解析失敗', err)
        }
    }
})

// 提交工作
async function submitJob() {
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // 基本驗證
    if (!jobForm.value.companyName || !jobForm.value.jobTitle || !jobForm.value.jobDescription || 
        !jobForm.value.requirement || !jobForm.value.location || !jobForm.value.salaryRange || 
        !jobForm.value.contactEmail) {
      errorMessage.value = '請填寫所有必填欄位'
      return
    }

    // 發送 API 請求
    const response = await axios.post('/api/jobs', jobForm.value)
    
    // 成功處理
    successMessage.value = response.data.message || '職缺上架成功！'
    
    // 清空表單
    resetForm()
    
    // 3秒後跳轉到工作列表
    setTimeout(() => {
      router.push('/jobs')
    }, 3000)
    
  } catch (error) {
    console.error('上架失敗', error)
    errorMessage.value = error.response?.data?.message || '上架失敗，請重試'
  } finally {
    saving.value = false
  }
}

// 重置表單
function resetForm() {
  jobForm.value = {
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    requirement: '',
    location: '',
    isRemote: false,
    salaryRange: '',
    contactEmail: ''
  }
  localStorage.removeItem('prefillJobData')
}
</script>