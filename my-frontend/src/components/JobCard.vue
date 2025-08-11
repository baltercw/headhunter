<template>
<div class="border p-4 rounded shadow bg-white mb-4">
    <h2 class="text-xl font-semibold text-gray-800 hover:underline cursor-pointer"
        @click="goToDetail"
    >
        {{ job.jobTitle }} ({{ job.companyName }})
    </h2>
    <p class="text-gray-600 mt-1">
        地點：{{ job.location }} // {{ job.isRemote === 'true' ? '可遠端' : '需到場' }}
    </p>
    <p class="text-gray-600 mt-1">
        薪資範圍：{{ job.salaryRange }}
    </p>
    <p class="mt-2 text-gray-700 line-clamp-2">
        {{ job.jobDescription }}
    </p>
    
    <!-- 應徵按鈕 -->
    <div class="mt-4 flex justify-end">
        <button 
            @click="goToApply"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
            立即應徵
        </button>
    </div>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
    job: Object
})

const router = useRouter()

function goToDetail(){
    router.push(`/job/${props.job._id}`)
}

function goToApply(){
    router.push(`/apply/${props.job._id}`)
}
</script>