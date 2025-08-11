// 管理前端頁面的路由設定，像是 SPA 的「切換不同畫面」
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import JobList from '../pages/JobList.vue';
import JobDetail from '../pages/JobDetail.vue';
import Profile from '../pages/Profile.vue';
import AdminHireList from '../pages/Admin/AdminHireList.vue';
import JobEditor from '../pages/Admin/JobEditor.vue';
import ApplicationList from '../pages/Admin/ApplicationList.vue';
import Register from '../pages/Register.vue';
import ApplyJob from '../pages/ApplyJob.vue';
import MyApplications from '../pages/MyApplications.vue';
import JobManagement from '../pages/Admin/JobManagement.vue';

const routes = [
    { path: '/', component: Home }, // 當網址是 / 時，顯示 Home 頁面
    { path: '/login', component: Login },

    { path: '/jobs', component: JobList },
    { path: '/job/:id', component: JobDetail },
    { path: '/apply/:jobId', component: ApplyJob },
    { path: '/profile', component: Profile },
    { path: '/my-applications', component: MyApplications },
    { path: '/admin/hire', component: AdminHireList },
    { path: '/admin/job-editor', component: JobEditor },
    { path: '/admin/applications', component: ApplicationList },
    { path: '/admin/jobs', component: JobManagement },
    { path: '/register', component: Register }
];

const router = createRouter({
    history: createWebHistory(),  // 使用 HTML5 模式（乾淨的 URL）
    routes // 將上面的 routes 陣列丟進來
});

// router.beforeEach((to, from, next) => {
//     const user = JSON.parse(localStorage.getItem('user'))

//     if(to.path.startsWith('/admin') && (!user || user.role !== 'admin')){
//         return next('/')
//     }

//     next()
// })
// admin守衛 但是暫時先做前端UI偵測就好 之後再處理 這個的問題是 梅登入會狂跳'/'

export default router; // 匯出 router，讓 main.js 可以用