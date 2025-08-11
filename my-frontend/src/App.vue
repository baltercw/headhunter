<template>
  <Navbar />

  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore()

onMounted(() => {
  console.log('[App.vue] 呼叫 init()')
  authStore.init()
})
</script>