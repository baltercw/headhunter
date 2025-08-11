<template>
<!-- 外層卡片 -->
<div>
    <h2>企業招募需求與服務</h2>
    <h5>歡迎留下您企業的招募需求與問題</h5>
    <!-- 監聽submin事件 執行函示 -->
    <form @submit.prevent="submitForm"> 
        <label class="block mb-2 font-semibold">公司名稱</label>
        <input v-model="form.companyName" type="text" class="input" required />

        <label class="block mt-4 mb-2 font-semibold">聯絡信箱</label>
        <input v-model="form.contactEmail" type="email" class="input" required />

        <label class="block mt-4 mb-2 font-semibold">職缺名稱</label>
        <input v-model="form.jobTitle" type="text" class="input" required />

        <label class="block mt-4 mb-2 font-semibold">職缺描述</label>
        <textarea v-model="form.jobDescription" class="input" required></textarea>
    
        <label class="block mt-4 mb-2 font-semibold">薪資範圍</label>
        <input v-model="form.salaryRange" type="text" class="input" required />

        <button type="submit" class="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit</button>
    </form>

    <p v-if="successMessage" class="mt-4 text-green-600">
        {{  successMessage  }}
    </p>
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