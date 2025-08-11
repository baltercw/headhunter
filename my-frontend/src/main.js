// 將整個 Vue App 初始化並掛載到 index.html 上的 #app
import { createApp } from 'vue'; // 匯入建立 Vue App 的方法
import App from './App.vue'; // 匯入主元件
import router from './router'; // 匯入 Vue Router 設定
import { createPinia } from 'pinia'; // 匯入 Pinia 狀態管理
import './style.css' // 匯入 Tailwind CSS 樣式（已經透過 PostCSS 處理好）
import axios from 'axios'

// 根據環境設定 API 網址
const isDevelopment = import.meta.env.DEV
axios.defaults.baseURL = isDevelopment 
  ? 'http://localhost:3000' 
  : 'https://your-backend-url.railway.app' // 這個我們等一下會設定
axios.defaults.withCredentials = true 

// 全域錯誤處理 - 自動處理 token 過期
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Token 過期，自動登出')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 跳轉到登入頁面
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const app = createApp(App); // 建立一個 Vue App 實例

app.use(createPinia()); // 啟用 Pinia（讓所有組件可以共用狀態）
app.use(router); // 啟用 Vue Router（讓我們能跳頁面）
app.mount('#app'); // 把整個 App 掛載到 HTML 裡的 <div id="app">