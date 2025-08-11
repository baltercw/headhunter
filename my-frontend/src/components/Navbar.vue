<template>
<nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
            
            <!-- 主要導覽選單 -->
            <div class="hidden md:flex items-center space-x-6">
                <router-link 
                    to="/" 
                    class="text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-md text-lg font-medium transition-colors"
                >
                    主頁
                </router-link>
                <a 
                    href="/#hire-form" 
                    class="text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-md text-lg font-medium transition-colors cursor-pointer"
                >
                    企業徵才
                </a>
                <router-link 
                    to="/jobs" 
                    class="text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-md text-lg font-medium transition-colors"
                >
                    職缺列表
                </router-link>
            </div>

            <!-- 用戶功能 -->
            <div class="hidden md:flex items-center space-x-4">
                <template v-if="authStore.user">
                    <span class="text-sm text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                        👤 {{ authStore.user.profile?.name || authStore.user.email }}
                    </span>

                    <!-- 管理員選單 -->
                    <div v-if="authStore.user?.role === 'admin'" class="relative group">
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            管理後台
                        </button>
                        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <router-link to="/admin/hire" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">企業管理</router-link>
                            <router-link to="/admin/jobs" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">職缺管理</router-link>
                            <router-link to="/admin/applications" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">應徵管理</router-link>
                        </div>
                    </div>

                    <router-link to="/profile" class="text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">個人資料</router-link>
                    <router-link to="/my-applications" class="text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">我的應徵</router-link>
                    <button @click="handleLogin" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">登出</button>
                </template>
                <template v-else>
                    <router-link to="/login" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">登入</router-link>
                </template>
            </div>

            <!-- 手機版漢堡選單按鈕 -->
            <div class="md:hidden">
                <button @click="toggleMobileMenu" class="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- 手機版選單 -->
    <div v-show="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-blue-100">
            <router-link to="/" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">主頁</router-link>
            <a href="/#hire-form" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer">企業徵才</a>
            <router-link to="/jobs" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">職缺列表</router-link>

            <template v-if="authStore.user">
                <div class="border-t border-gray-200 pt-4 mt-4">
                    <div class="px-3 py-2 text-sm text-gray-500">👤 {{ authStore.user.profile?.name || authStore.user.email }}</div>
                    
                    <template v-if="authStore.user?.role === 'admin'">
                        <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">管理功能</div>
                        <router-link to="/admin/hire" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">企業管理</router-link>
                        <router-link to="/admin/jobs" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">職缺管理</router-link>
                        <router-link to="/admin/applications" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">應徵管理</router-link>
                    </template>

                    <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">個人功能</div>
                    <router-link to="/profile" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">個人資料</router-link>
                    <router-link to="/my-applications" @click="closeMobileMenu" class="text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">我的應徵</router-link>
                    <button @click="handleLogin" class="w-full text-left text-blue-700 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">登出</button>
                </div>
            </template>
            <template v-else>
                <div class="border-t border-gray-200 pt-4 mt-4">
                    <router-link to="/login" @click="closeMobileMenu" class="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors">登入</router-link>
                </div>
            </template>
        </div>
    </div>
</nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
}



const handleLogin = () => {
    authStore.logout()
    router.push('/')
    closeMobileMenu()
}
</script>