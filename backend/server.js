const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
// 解決跨網域需求
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://headhunter-ochre.vercel.app'] // 部署後的前端網址
        : ['http://localhost:5173'], // 開發時的前端網址
    credentials: true
}));
//解析 JSON 格式的 request body
app.use(express.json());

// 設定靜態檔案服務 - 讓瀏覽器可以存取上傳的圖片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGO_URI, {
    dbName: 'headhunter',
    serverSelectionTimeoutMS: 5000 //最多等5秒
})
.then(() => {
    console.log('MongoDB 連線成功');
    const authRoutes = require('./routes/auth');
const hireRoutes = require('./routes/hire');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const uploadRoutes = require('./routes/upload');

    app.use('/api/auth', authRoutes);
app.use('/api/hire', hireRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);

    app.get('/', (req, res) => {
        res.send('後端伺服器成功運行');
    });

    app.use((req, res) => {
        res.status(404).send('跑錯囉');
    });

    app.listen(3000, () => {
        console.log('伺服器已經啟動');
    });

})
.catch(err => {
    console.log('MongoDB 連接失敗',err);
    process.exit(1);
});