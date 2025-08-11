<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">個人資料</h1>
      
      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">載入中...</p>
      </div>

      <!-- 個人資料表單 -->
      <form v-else @submit.prevent="updateProfile" class="space-y-6">
        <!-- 基本資料 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <input
              v-model="profile.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入姓名"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">電話</label>
            <input
              v-model="profile.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入電話"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">所在地</label>
            <input
              v-model="profile.location"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入所在地"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">頭像</label>
              <!-- 圖片預覽 -->
              <div class="mb-2">
                <img
                  v-if="avatarPreview || profile.avatar"
                  :src="avatarPreview || profile.avatar"
                  class="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  alt="頭像預覽"
                />
                <div v-else class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-500 text-sm">無頭像</span>
                </div>
              </div>

              <!-- 檔案選擇 -->
              <input
                type="file"
                accept="image/jpeg, image/png"
                @change="handleFileSelect"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <!-- 錯誤提示 -->
              <p v-if="fileError" class="text-red-500 text-sm mt-2">
                {{ fileError }}
              </p>

              <!-- 檔案資訊 -->
              <p v-if="selectedFile" class="text-sm text-gray-500 mt-2">
                已選擇：{{ selectedFile.name }} ({{ formatFileSize(selectedFile.size)}})
              </p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">自我介紹</label>
          <textarea
            v-model="profile.bio"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請簡單介紹自己..."
          ></textarea>
        </div>

        <!-- 人才相關欄位 -->
        <div v-if="user?.role === 'talent'" class="space-y-6 border-t pt-6">
          <h3 class="text-xl font-semibold text-gray-800">人才資料</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">技能 (用逗號分隔)</label>
            <input
              v-model="skillsInput"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：JavaScript, Vue.js, Node.js"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">工作經驗</label>
            <textarea
              v-model="profile.experience"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請描述您的工作經驗..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">學歷</label>
            <textarea
              v-model="profile.education"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請描述您的學歷背景..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">履歷URL</label>
            <input
              v-model="profile.resume"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入履歷檔案網址"
            />
          </div>
        </div>

        <!-- 企業相關欄位 -->
        <div v-if="user?.role === 'company'" class="space-y-6 border-t pt-6">
          <h3 class="text-xl font-semibold text-gray-800">企業資料</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">公司名稱</label>
              <input
                v-model="profile.company"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入公司名稱"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">職位</label>
              <input
                v-model="profile.position"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入您的職位"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">公司介紹</label>
            <textarea
              v-model="profile.companyDescription"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請介紹您的公司..."
            ></textarea>
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
            {{ saving ? '儲存中...' : '儲存變更' }}
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
// 引入 Vue 3 的 Composition API 函式
import { ref, computed, onMounted } from 'vue'
// ref: 建立響應式變數
// computed: 建立計算屬性（會根據其他變數自動重新計算）
// onMounted: 組件掛載完成時執行的生命週期函數

// 引入認證狀態管理
import { useAuthStore } from '../stores/authStore'
// 引入 HTTP 客戶端，用來發送 API 請求
import axios from 'axios'

// 取得認證狀態管理實例
const authStore = useAuthStore()

// 計算屬性：取得當前用戶資料
// 當 authStore.user 改變時，user 會自動更新
const user = computed(() => authStore.user)

// 響應式變數：控制頁面狀態
const loading = ref(false)      // 載入狀態：true = 顯示載入動畫
const saving = ref(false)       // 儲存狀態：true = 顯示儲存中，禁用按鈕
const successMessage = ref('')  // 成功訊息：有值時顯示綠色成功訊息
const errorMessage = ref('')    // 錯誤訊息：有值時顯示紅色錯誤訊息
const selectedFile = ref(null)
const avatarPreview = ref(null)
const fileError = ref('')
// 響應式物件：個人資料
// 使用 ref() 包裝，確保資料改變時頁面會自動更新
const profile = ref({
  // 基本資料
  name: '',           // 姓名
  phone: '',          // 電話
  location: '',       // 所在地
  bio: '',           // 自我介紹
  avatar: '',        // 頭像URL
  
  // 人才相關欄位
  skills: [],        // 技能陣列
  experience: '',    // 工作經驗
  education: '',     // 學歷
  resume: '',        // 履歷URL
  
  // 企業相關欄位
  company: '',       // 公司名稱
  position: '',      // 職位
  companyDescription: ''  // 公司介紹
})

// 計算屬性：技能輸入處理
// 因為技能在資料庫是陣列，但輸入框要字串，所以需要轉換
const skillsInput = computed({
  // getter：當顯示在輸入框時，將陣列轉成字串
  get: () => profile.value.skills?.join(', ') || '',
  // 例如：['JavaScript', 'Vue.js'] → 'JavaScript, Vue.js'
  
  // setter：當用戶在輸入框輸入時，將字串轉成陣列
  set: (value) => {
    profile.value.skills = value
      .split(',')                    // 用逗號分割
      .map(skill => skill.trim())    // 去除每個技能的前後空格
      .filter(skill => skill)        // 過濾掉空字串
    // 例如：'JavaScript, Vue.js, ' → ['JavaScript', 'Vue.js']
  }
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if(file){
    //驗證檔案
    const error = validateFile(file)
    if(error){
      fileError.value = error
      selectedFile.value = null
      avatarPreview.value = null
      return
    }

    //清除錯誤
    fileError.value = ''
    selectedFile.value = file

    //建立預覽
    createImagePreview(file)

    console.log('選擇的檔案:', file)
    selectedFile.value = file
  }
}

//驗證檔案
const validateFile = (file) => {
  //檢查檔案類型
  if(!file.type.match(/image\/(jpeg|png)/)) {
    return '只支援 JPG 和 PNG 格式'
  }

  //檢查檔案大小
  if(file.size > 2 * 1024 * 1024){
    return '檔案大小不能超過 2MB'
  }

  return null
}

//建立預覽
const createImagePreview = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

//格式化檔案大小
const formatFileSize = (bytes) => {
  if(bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}


// 載入個人資料函數
const loadProfile = async () => {
  loading.value = true  // 開始載入，顯示載入動畫
  
  try {
    // 發送 GET 請求到後端 API
    const response = await axios.get('/api/auth/profile')
    
    // 如果後端回傳了用戶資料
    if (response.data.user?.profile) {
      // 將後端的個人資料合併到本地的 profile 物件
      // ...profile.value 保留原有資料，...response.data.user.profile 覆蓋新資料
      profile.value = { ...profile.value, ...response.data.user.profile }
      
      // 如果有頭像，清除之前的預覽（避免衝突）
      if (profile.value.avatar) {
        avatarPreview.value = null
        selectedFile.value = null
      }
    }
  } catch (error) {
    // 如果載入失敗
    console.error('載入個人資料失敗:', error)
    errorMessage.value = '載入個人資料失敗'  // 顯示錯誤訊息
  } finally {
    loading.value = false  // 結束載入，隱藏載入動畫
  }
}

// 更新個人資料函數
const updateProfile = async () => {
  console.log('=== updateProfile 函數開始 ===')
  console.log('profile.value:', profile.value)
  
  saving.value = true  // 開始儲存，顯示儲存中狀態
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    if(selectedFile.value){
      console.log('準備上傳檔案')

      const formData = new FormData()
      formData.append('avatar', selectedFile.value)

      console.log('FormData建立完成')

      const uploadResponse = await axios.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      profile.value.avatar = uploadResponse.data.avatarUrl

      console.log('上傳完成，網址：',uploadResponse.data.avatarUrl)                                                                                                                                                                                             
    }

    console.log('準備更新個人資料到後端')
    console.log('要更新的資料:', profile.value)
    
    const response = await axios.put('/api/auth/profile', { profile: profile.value })
    
    console.log('個人資料更新成功:', response.data)
    
    successMessage.value = response.data.message
    
    // 更新 store 中的用戶資料，確保其他組件也能看到最新資料
    if (response.data.user) {
      authStore.user = response.data.user
    }
  } catch (error) {
    console.error('更新個人資料失敗:', error)
    errorMessage.value = error.response?.data?.message || '更新失敗'
  } finally {
    saving.value = false
  }
}

// 重置表單函數
const resetForm = () => {
  loadProfile()  // 重新載入個人資料，覆蓋所有修改
}

// 組件掛載完成時執行
onMounted(() => {
  loadProfile()  // 載入個人資料
})
</script> 