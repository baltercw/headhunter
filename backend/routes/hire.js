const express = require('express');
const router = express.Router();
const HireRequest = require('../models/HireRequest');
const verifyToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

//取得所有企業填單(admin)
router.get('/',verifyToken, isAdmin, async(req, res) => {
    try{
        const request = await HireRequest.find().sort({ createdAt: -1 }) //最新的在前面
        res.status(200).json(request);
    }catch(err){
        console.error('取得企業填單失敗', err);
        res.status(500).json({ message: '伺服器錯誤 '});
    }
})

//Post /api/hire 企業填表單api
router.post('/', async(req, res) => {
    console.log('[前端送來的資料]', req.body);
    try{
        const { companyName, contactEmail, jobTitle, jobDescription, salaryRange, createdAt} = req.body;

        //基本欄位驗證
        if(!companyName || !contactEmail || !jobTitle || !jobDescription || !salaryRange){
            return res.status(400).json({ message: '所有欄位都是必填' });
        }

        //建立新職缺
        const newRequest = new HireRequest({
            companyName,
            contactEmail,
            jobTitle,
            jobDescription,
            salaryRange,
            createdAt: createdAt || new Date()
        });

        await newRequest.save(); //存入資料庫

        res.status(201).json({ message: '職缺已送出，我們會盡快處理 '});
    }catch(err){
        console.error('企業田單失敗', err);
        res.status(500).json({ message: '伺服器錯誤 '});
    }
});

module.exports = router;