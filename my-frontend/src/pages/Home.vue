<template>
<div class="min-h-screen bg-gray-50">
    <!-- Hero 區塊 -->
    <section class="relative text-white min-h-screen flex items-center">
        <div class="absolute inset-0">
            <img 
                :src="businessImage"
                alt="主視覺"
                class="w-full h-full object-cover opacity-90" 
            />
            <!-- 背景遮罩 -->
            <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                    歡迎來到
                    <span class="block text-blue-100">獵頭平台</span>
                </h1>
                <p class="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                    我們幫您找到最適合的人才，也幫您找到最理想的工作
                </p>
                <div class="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                        @click="router.push('/jobs')"
                        class="group relative overflow-hidden bg-white text-blue-800 px-10 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span class="relative z-10">探索職缺</span>
                        <div class="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <button
                        @click="scrollToForm"
                        class="group relative overflow-hidden border-2 border-white text-white px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300 transform hover:scale-105"
                    >
                        <span class="relative z-10">企業徵才</span>
                        <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- 功能卡片區塊 -->
    <section class="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">選擇您的需求</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">我們提供完整的求職和徵才服務，為您打造最佳的職場體驗</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <!-- 左邊求職 -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <img :src="recruitmentImage" alt="求職圖片" class="h-32 mx-auto mb-6" />
                <h3 class="text-2xl font-bold text-blue-800 mb-3">我要求職</h3>
                <p class="text-gray-600 mb-6 text-lg">探索適合職缺，找到理想工作</p>
                <button
                    @click="router.push('/jobs')"
                    class="group relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <span class="relative z-10">更多職缺</span>
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
            <!-- 右邊徵才 -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <img :src="job_hunting" alt="徵才圖片" class="h-32 mx-auto mb-6" />
            <h3 class="text-2xl font-bold text-blue-800 mb-3">企業求才</h3>
                <p class="text-gray-600 mb-6 text-lg">發布職缺，精準媒合人才</p>
                <button
                    @click="scrollToForm"
                    class="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >  
                    <span class="relative z-10">聯絡我們</span>
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
        </div>
    </section>

    <!-- 最新職缺區塊 -->
    <section class="bg-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-6">最新職缺</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">發現最新的工作機會，找到您理想的工作</p>
            </div>
            
            <!-- 職缺卡片網格 -->
            <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <JobCard 
                    v-for="job in latestJobs" 
                    :key="job._id" 
                    :job="job" 
                />
            </div>
            
            <!-- 載入中狀態 -->
            <div v-if="loading" class="text-center py-12">
                <div class="bg-gray-100 rounded-lg p-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p class="text-gray-500 text-lg">載入最新職缺中...</p>
                </div>
            </div>
            
            <!-- 空狀態 -->
            <div v-if="!loading && latestJobs.length === 0" class="text-center py-12">
                <div class="bg-gray-100 rounded-lg p-8">
                    <p class="text-gray-500 text-lg">目前沒有最新職缺</p>
                </div>
            </div>
            
            <!-- 查看更多按鈕 -->
            <div v-if="!loading && latestJobs.length > 0" class="text-center">
                <button
                    @click="router.push('/jobs')"
                    class="group relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <span class="relative z-10">查看更多職缺</span>
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
        </div>
    </section>

    <!-- 獵才表單區塊 -->
    <section id="hire-form" class="text-gray-900 py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-6">企業獵才需求</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">告訴我們您的需求，我們會為您找到最適合的人才，提供專業的獵才服務</p>
            </div>
            
            <!-- 表單容器 -->
            <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <HireForm />
                         </div>
         </div>
     </section>

     <!-- Footer 區塊 -->
     <footer class="bg-gray-900 text-white py-16">
         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <!-- 公司資訊 -->
                 <div class="col-span-1 md:col-span-2">
                     <h3 class="text-2xl font-bold mb-4">獵頭平台</h3>
                     <p class="text-gray-300 mb-6 max-w-md">
                         專業的獵才服務，為企業找到最適合的人才，也為求職者找到理想的工作機會。
                     </p>
                     <div class="flex space-x-4">
                         <a href="#" class="text-gray-400 hover:text-white transition-colors">
                             <span class="sr-only">Facebook</span>
                             <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                             </svg>
                         </a>
                         <a href="#" class="text-gray-400 hover:text-white transition-colors">
                             <span class="sr-only">LinkedIn</span>
                             <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                             </svg>
                         </a>
                     </div>
                 </div>

                 <!-- 快速連結 -->
                 <div>
                     <h4 class="text-lg font-semibold mb-4">快速連結</h4>
                     <ul class="space-y-2">
                         <li><a href="/jobs" class="text-gray-300 hover:text-white transition-colors">瀏覽職缺</a></li>
                         <li><a href="#hire-form" class="text-gray-300 hover:text-white transition-colors">企業徵才</a></li>
                         <li><a href="/about" class="text-gray-300 hover:text-white transition-colors">關於我們</a></li>
                         <li><a href="/contact" class="text-gray-300 hover:text-white transition-colors">聯絡我們</a></li>
                     </ul>
                 </div>

                 <!-- 聯絡資訊 -->
                 <div>
                     <h4 class="text-lg font-semibold mb-4">聯絡資訊</h4>
                     <ul class="space-y-2 text-gray-300">
                         <li>📧 info@headhunter.com</li>
                         <li>📞 (02) 1234-5678</li>
                         <li>📍 彰化縣彰化市</li>
                         <li>🕒 週一至週五 9:00-18:00</li>
                     </ul>
                 </div>
             </div>

             <!-- 版權資訊 -->
             <div class="border-t border-gray-800 mt-12 pt-8 text-center">
                 <p class="text-gray-400">
                     © 2025 獵頭平台. 保留所有權利.
                 </p>
             </div>
         </div>
     </footer>
 </div>
 </template>

<script setup>
import HireForm from '../pages/HireForm.vue'
import JobCard from '../components/JobCard.vue'
import businessImage from '../assets/images/business2.jpg'
import recruitmentImage from '../assets/images/recruitment.png'
import job_hunting from '../assets/images/job-hunting.png'

import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

// 職缺數據
const latestJobs = ref([])
const loading = ref(true)

// 滾動到表單
const scrollToForm = () => {
    const el = document.getElementById('hire-form')
    if(el) el.scrollIntoView({ behavior: 'smooth' })
}

// 獲取最新職缺
const fetchLatestJobs = async () => {
    try {
        loading.value = true
        console.log('開始獲取職缺...')
        const response = await fetch('http://localhost:3000/api/jobs')
        console.log('API 響應狀態:', response.status)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('API 返回數據:', data)
        
        // 後端直接返回職缺陣列，不是 {jobs: [...]} 格式
        latestJobs.value = Array.isArray(data) ? data.slice(0, 6) : []
        console.log('處理後的職缺數據:', latestJobs.value)
    } catch (error) {
        console.error('獲取職缺失敗:', error)
        latestJobs.value = []
    } finally {
        loading.value = false
        console.log('載入完成，職缺數量:', latestJobs.value.length)
    }
}

onMounted(() => {
    fetchLatestJobs()
})
</script>