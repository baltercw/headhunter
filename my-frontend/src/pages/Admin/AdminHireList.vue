<template>
<div class="p-6">
    <h1 class="text-2xl font-bold mb-6">企業填單資料總覽</h1>

    <div v-if="forms.length === 0">目前尚無企業填單</div>

    <div
        v-for="form in forms"
        :key="form._id"
        class="border rounded p-4 shadow mb-4 bg-white"
    >
        <h2 class="text-lg font-semibold">{{ form.jobTitle }}</h2>
        <p class="text-gray-600">{{ form.companyName }}</p>
        <p class="text-gray-700 mt-2">{{ form.jobDescription }}</p>
        <!-- 剩下資料 -->
        <p class="text-sm text-gray-600 mt-2">
            <button
                @click="goToEditor(form)"
                class="text-blue-500 underline hover:text-blue-700"
            >
                帶入上架編輯器
            </button>
        </p>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const forms = ref([])
const router = useRouter()

onMounted(async() => {
    console.log('onMounted 執行了！')

    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    console.log('Token:', token)
    console.log('User:', user)
    
    if(!token){
        console.warn('未登入')
        return
    }

    try{
        console.log('發送 API 請求到 /api/hire')
        // 設定認證標頭
        const res = await axios.get('/api/hire', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log('API 回應:', res)
        forms.value = res.data
        console.log('取得企業填單成功', res.data)
    }catch(err){
        console.log('取得企業填單失敗', err)
        console.log('錯誤狀態碼:', err.response?.status)
        console.log('錯誤訊息:', err.response?.data)
        if(err.response?.status === 401) {
            console.error('認證失敗，請重新登入')
        }
    }
})

function goToEditor(formData){
    localStorage.setItem('prefillJobData', JSON.stringify(formData))
    router.push('/admin/job-editor')
}
</script>