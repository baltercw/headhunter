<template>
<!-- 導覽列外框，用 Tailwind 設定背景顏色、內距與排列方式 -->
<nav class="bg-red-100 shadow p-4 flex justify-between items-center">
    
    <!-- 左側：連結 -->
    <div>
        <router-link to="/" class="mr-4 hover:underline">主頁</router-link>
        <router-link to="/hire" class="mr-4 hover:underline">企業</router-link>
        <router-link to="/jobs" class="mr-4 hover:underline">職缺列表</router-link>
    </div>

     <!-- 右側：登入 -->
    <div class="flex items-center space-x-4">
        <template v-if="authStore.user">
            <span class="text-sm text-gray-700">
                �� {{ authStore.user.profile?.name || authStore.user.email }}
            </span>

            <router-link
                v-if="authStore.user && authStore.user?.role === 'admin'"
                to="/admin/hire"
                class="mr-4 hover:underline"
            >
                企業管理
            </router-link>
            <router-link
                v-if="authStore.user && authStore.user?.role === 'admin'"
                to="/admin/jobs"
                class="mr-4 hover:underline"
            >
                職缺管理
            </router-link>
            <router-link
                v-if="authStore.user && authStore.user?.role === 'admin'"
                to="/admin/applications"
                class="mr-4 hover:underline"
            >
                應徵管理
            </router-link>

            <router-link 
                to="/profile" 
                class="text-blue-600 hover:text-blue-800 hover:underline mr-4"
            >
                個人資料
            </router-link>
            <router-link 
                to="/my-applications" 
                class="text-green-600 hover:text-green-800 hover:underline"
            >
                我的應徵
            </router-link>
            
            <button @click="handleLogin" class="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500">
                登出
            </button>
        </template>
        <template v-else>
            <router-link to="/login" class="hover:underline">登入</router-link>
        </template>
    </div>
</nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = () => {
    authStore.logout()
    router.push('/')
}
</script>