<template>
<div v-if="job">
    <div class="bg-gray-100 min-h-screen p-6">
        <div class="bg-white max-w-6xl mx-auto p-6 rounded-md shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 space-y-6 mt-6">
                <div>
                    <h1 class="text-3xl font-bold">
                        {{ job.jobTitle }}
                    </h1>
                    <p class="text-gray-600">
                        {{ job.companyName }}
                    </p>
                </div>
                <div>
                    <h2 class="text-xl font-semibold mb-2">職缺描述</h2>
                    <p class="text-gray-700 whitespace-pre-line">
                        {{ job.jobDescription }}
                    </p>
                </div>
                <div>
                    <h2 class="text-xl font-semibold mb-2">職務需求</h2>
                    <ul class="list-disc list-inside text-gray-700">
                        <li>{{ job.requirement }}</li>
                    </ul>
                </div>

                <button 
                    @click="goToApply"
                    class="w-[18%] bg-green-600 text-white py-2 rounded hover:bg-green-400"
                >
                    立即應徵
                </button>
            </div>

            <div class="md:col-span-1 space-y-4">
                <div>
                    <button 
                        @click="goToApply"
                        class="w-[30%] bg-green-600 text-white py-2 rounded hover:bg-green-400"
                    >
                        立即應徵
                    </button>
                </div>
                <div class="bg-gray-100 p-4 rounded shadow">
                    <p><strong>薪資：</strong>{{ job.salaryRange }}</p>
                    <p><strong>應徵人數：</strong>2 人</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div v-else>
    <p>載入中...</p>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const job = ref(null)
const route = useRoute()
const router = useRouter()
const jobId = route.params.id //抓到網址id

onMounted(async() => {
    try{
        const res = await axios.get(`/api/jobs/${jobId}`)
        job.value = res.data //成功讀取資料
        console.log('職缺資料', job.value)
    }catch(err){
        console.log('取得職缺失敗', err)
    }
})

// 跳轉到應徵頁面
const goToApply = () => {
    router.push(`/apply/${jobId}`)
}

console.log('ID:',jobId);
</script>