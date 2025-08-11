<template>
<div class="p-6">
    <SearchBox @search="handleSearch"/>
    <h1 class="text-2xl font-bold mb-6">目前職缺</h1>
    <div v-if="isSearching" class="text-left text-gray-500 mb-4">
        搜尋結果：{{ jobs.length }}個
    </div>
    <JobCard v-for="job in jobs" :key="job._id" :job="job" />
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import JobCard from '../components/JobCard.vue';
import SearchBox from '../components/SearchBox.vue';

const jobs = ref([])
const allJobs = ref([])
const isSearching = ref(false)

const loadJobs = async () => {
    try{
        const res = await axios.get('/api/jobs')
        allJobs.value = res.data
        jobs.value = res.data
    } catch(err){
        console.log('取得職缺失敗', err)
    }
}

onMounted(loadJobs)

const handleSearch = (keyword) => {
    console.log('搜尋關鍵字:', keyword)

    if(!keyword.trim()){
        loadJobs()
        isSearching.value = false
        return
    }

    isSearching.value = true

    const filteredJobs = allJobs.value.filter(job => {
        const titleMatch = job.jobTitle.toLowerCase().includes(keyword.toLowerCase())
        const companyMatch = job.companyName.toLowerCase().includes(keyword.toLowerCase())
        return titleMatch || companyMatch
    })

    jobs.value = filteredJobs
}
</script>