import { defineStore } from 'pinia' //從 Pinia 匯入 defineStore，用來定義一個狀態儲存區（Store）
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    //狀態 state 是這個 store 處存的資料
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: null,
    }),

    //actions 用來寫非同步邏輯或複雜操作 (登入 登出)
    actions: {
        async login(email, password){
            try{
                const res = await axios.post('/api/auth/login', { email, password })
                
                // 登入成功後，從回傳的資料中拿到 JWT token，存到 store 的狀態中
                this.token = res.data.token
                this.user = res.data.user

                // 順便存到 localStorage，確保重新整理後仍保留登入狀態
                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))

                //之後你每次用 axios 發 request，不用再一個一個手動加 token，axios 幫你自動附上
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

                const meRes = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${this.token}` }
                })

                this.user = meRes.data
            }catch(err){
                // 如果登入或取得 /me 資料失敗，直接丟出錯誤，讓呼叫端去處理（如顯示錯誤訊息）
                throw new Error('帳號或密碼錯誤')
            }
        },

        logout(){
            this.token = ''
            this.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            delete axios.defaults.headers.common['Authorization']
        },

        init(){
            const storedToken = localStorage.getItem('token')
            const storedUser = localStorage.getItem('user')

            console.log('authStore 初始化', this.token, this.user)

            try{
                if(storedToken && storedUser && storedUser !== 'undefined'){
                this.token = storedToken
                this.user = JSON.parse(storedUser)
                
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

            }
            }catch(e){
                this.token = ''
                this.user = null
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
    }
})