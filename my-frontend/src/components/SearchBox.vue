<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- 搜尋區域 -->
    <div class="flex items-center space-x-4 mb-4">
      <div class="flex-1">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="placeholder"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="handleSearch"
        />
      </div>
      <button 
        @click="handleSearch"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        搜尋
      </button>
    </div>

    <!-- 推薦工作 -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="recommendation in recommendations"
        :key="recommendation"
        @click="handleRecommendationClick(recommendation)"
        class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
      >
        {{ recommendation }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props - 父組件傳入的參數
const props = defineProps({
  placeholder: {
    type: String,
    default: '搜尋...'
  }
})

// Emits - 組件要發送的事件
const emit = defineEmits(['search', 'clear'])

// 資料
const searchQuery = ref('')
const recommendations = ['工程師', '設計師', '行銷', '業務', '客服', 'PT']

// 方法
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

const handleRecommendationClick = (recommendation) => {
  searchQuery.value = recommendation
  emit('search', recommendation)
}
</script>

