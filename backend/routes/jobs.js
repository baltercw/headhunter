const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const verifyToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', verifyToken, isAdmin, async(req, res) => {
    try{
        const{
            companyName,
            jobTitle,
            jobDescription,
            requirement,
            location,
            isRemote,
            salaryRange,
            contactEmail,
        } = req.body;

        if(!companyName || !jobTitle || !jobDescription || !requirement || !location || !salaryRange || !contactEmail){
            return res.status(400).json({ message: '請填寫所有欄位' });
        }

        const newJob = new Job({
            companyName,
            jobTitle,
            jobDescription,
            requirement,
            location,
            isRemote,
            salaryRange,
            contactEmail
        });

        await newJob.save();

        res.status(201).json({ message: '職缺已成功上架' });
    }catch(err){
        console.error('職缺上架失敗', err);
        res.status(500).json({ message: '伺服器錯誤1' });
    }
});

router.get('/', async(req, res) => {
    try{
        const jobs = await Job.find({ isOpen: true }).sort({ createdAt: -1 });
        res.json(jobs);
    }catch(err){
        console.error('取得職缺失敗', err);
        res.status(500).json({ message: '伺服器錯誤2' });
    }
});

//取得單一職缺 (for JobDetail)
router.get('/:id', async(req, res) => {
    try{
        const job = await Job.findById(req.params.id)

        if(!job){
            return res.status(404).json({ message: '找不到職缺' })
        }

        res.json(job)
    }catch(err){
        console.log('取得單一職缺失敗', err)
        res.status(500).json({ message: '伺服器錯誤' })
    }
})

module.exports = router;