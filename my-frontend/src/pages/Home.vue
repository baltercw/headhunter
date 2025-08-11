<template>
<div>
    <!-- 主視覺 + 篩選 -->
    <div class="">
        <img 
            :src="businessImage"
            alt="主視覺"
            class="w-full h-[60vh] object-cover" 
        />
    </div>

    <Section class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- 左邊求職 -->
        <div class="bg-white rounded-xl shadow p-6 text-center transition-transform duration-300 hover:scale-105">
            <img :src="recruitmentImage" alt="求職圖片" class="h-32 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-blue-900 mb-2">我要求職</h3>
            <p class="text-gray-600 mb-4">探索適合職缺</p>
            <button
                @click="router.push('/jobs')"
                class="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
                更多職缺
            </button>
        </div>
        <!-- 右邊徵才 -->
        <div class="bg-white rounded-xl shadow p-6 text-center translate-transform duration-300 hover:scale-105">
            <img :src="job_hunting" alt="徵才圖片" class="h-32 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-blue-900 mb-2">企業求才</h3>
            <p class="text-gray-600 mb-4">發布職缺，精準媒合</p>
            <button
                @click="scrollToForm"
                class="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >  
                聯絡我們 
            </button>
        </div>
    </Section>
    <div>
        <!-- 兩個區塊 我要求職(如果還沒登入 就跳轉登入 登入了 跳轉工作列) -->
        <!-- 第二個區塊 獵才需求 跳轉到 下方 獵才表單 -->
    </div>

    <div>
        <!-- 熱門職缺 隨機抓幾個上來 自動左右滑動 -->
    </div>

    <div>
        <!-- 這裡放 熱門類別 可能5 6個 放個icon 可以自動篩選 -->
    </div>
    <!-- Hero 區塊 -->
    <section class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-2">歡迎來到獵頭平台</h1>
        <p class="text-gray-600">我們幫您找到最適合的人才</p>
    </section>

    <!-- 預留職缺展示區 -->
     <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">最新職缺</h2>
        <p class="text-gray-500">(這裡之後串資料近來)</p>
     </section>

     <div id="hire-form">
        <HireForm />
     </div>

     <div>
        <!-- 一般公司常見 最下方 可能是關於我們 -->
     </div>
</div>
</template>

<script setup>
import HireForm from '../pages/HireForm.vue'
import businessImage from '../assets/images/business2.jpg'
import recruitmentImage from '../assets/images/recruitment.png'
import job_hunting from '../assets/images/job-hunting.png'

import { useRouter } from 'vue-router'
const router = useRouter()

//滾動寒士
const scrollToForm = () => {
    const el = document.getElementById('hire-form')
    if(el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>