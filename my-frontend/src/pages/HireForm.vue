<template>
<div>
    <!-- 表單標題 -->
    <div class="text-center mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">企業招募需求與服務</h3>
        <p class="text-gray-600">歡迎留下您企業的招募需求與問題，我們會為您提供專業的獵才服務</p>
    </div>

    <!-- 表單內容 -->
    <form @submit.prevent="submitForm" class="space-y-6"> 
        <!-- 公司名稱 -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">公司名稱 *</label>
            <input 
                v-model="form.companyName" 
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200" 
                placeholder="請輸入您的公司名稱"
                required 
            />
        </div>

        <!-- 聯絡信箱 -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">聯絡信箱 *</label>
            <input 
                v-model="form.contactEmail" 
                type="email" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200" 
                placeholder="請輸入您的聯絡信箱"
                required 
            />
        </div>

        <!-- 職缺名稱 -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">職缺名稱 *</label>
            <input 
                v-model="form.jobTitle" 
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200" 
                placeholder="例如：前端工程師、產品經理"
                required 
            />
        </div>

        <!-- 職缺描述 -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">職缺描述 *</label>
            <textarea 
                v-model="form.jobDescription" 
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200 resize-none" 
                placeholder="請詳細描述職缺內容、工作職責、技能要求等"
                required
            ></textarea>
        </div>
    
        <!-- 薪資範圍 -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">薪資範圍 *</label>
            <input 
                v-model="form.salaryRange" 
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200" 
                placeholder="例如：月薪 50,000-80,000 元"
                required 
            />
        </div>

        <!-- 提交按鈕 -->
        <div class="pt-4">
            <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
                送出需求
            </button>
        </div>
    </form>

    <!-- 成功訊息 -->
    <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-700 font-medium">
            {{ successMessage }}
        </p>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
    companyName: '',
    contactEmail: '',
    jobTitle: '',
    jobDescription: '',
    salaryRange: '',
})

const successMessage = ref('')

// async 是非同步函試 適用 資料等後端回傳 配合await
const submitForm = async () => {
    console.log('表單送出！');

    try{
        await axios.post(`${import.meta.env.VITE_API_URL}/api/hire`, {
            ...form.value,
            createAt: new Date(),
        })

        successMessage.value = '職缺已送出，我們會盡快處理'

        form.value = {
            companyName: '',
            contactEmail: '',
            jobTitle: '',
            jobDescription: '',
            salaryRange: '',
        }
    }catch(err){
        console.error('送出失敗', err)
        successMessage.value = '發生錯誤，請稍後再試'
    }
}
</script>