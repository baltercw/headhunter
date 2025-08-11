<template>
<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">登入</h1>

        <!-- 登入表單 -->
        <form @submit.prevent="handleLogin">
            <div class="mb-4">
                <label class="block mb-1 text-sm">Email</label>
                <input v-model="email" type="email" required class="w-full border p-2 rounded" />
            </div>

            <div clas="mb-6">
                <label class="block mb-1 text-sm">密碼</label>
                <input v-model="password" type="password" required class="w-full border p-2 rounded" />
            </div>

            <div class="flex space-x-4">
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    登入
                </button>

                <router-link
                    to="/register"
                    class="w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    註冊
                </router-link>
            </div>

            <p v-if="error" class="text-red-500 text-sm mt-4">
                {{ error }}
            </p>
        </form>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const authStore = useAuthStore()
const router = useRouter()

//表單送出邏輯
const handleLogin = async () => {
    error.value = ''
    try{
        await authStore.login(email.value, password.value) //呼叫pinia的登入方法
        router.push('/') //登入成功後導回首頁，可根據腳色導頁
    }catch(err){
        error.value = err.message || '登入失敗'
    }
}
</script>