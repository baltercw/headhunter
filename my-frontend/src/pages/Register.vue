<template>
<div class="max-x-md mx-auto mt-10 p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">註冊帳號</h2>
    <form @submit.prevent="register">
        <input v-model="form.name" placeholder="姓名" class="w-full mb-3 p-2 border" />
        <input v-model="form.email" placeholder="Email" class="w-full mb-3 p-2 border" />
        <input type="password" v-model="form.password" placeholder="密碼" class="w-full mb-3 p-2 border" />
        <input type="password" v-model="form.confirmPassword" placeholder="確認密碼" class="w-full mb-3 p-2 border" />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">註冊</button> 
    </form>
</div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'

const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})
const router = useRouter()

async function register(){
    if(form.value.password !== form.value.confirmPassword){
        alert('密碼不一致')
        return
    }

    try{
        const res = await axios.post('api/auth/register', {
            name: form.value.name,
            email: form.value.email,
            password: form.value.password,
            role: 'talent'
        })
        alert('註冊成功')
        router.push('/login')
    }catch(err){
        alert('註冊失敗')
        console.error(err)
    }
}
</script>