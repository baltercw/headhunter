const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const verifyToken = require('../middlewares/auth');

// POST /api/applications - 提交應徵
router.post('/', verifyToken, async(req, res) => {
    try{
        const { jobId, resume, coverLetter, name, email, phone } = req.body;
        const userId = req.user.userId;

        //基本驗證
        if( !jobId || !resume || !coverLetter || !name || !email || !phone ){
            return res.status(400).json({ message: '請填寫所有必填欄位' })
        }

        //建立新應徵
        const newApplication = new Application({
            userId,
            jobId,
            name,
            email,
            phone,
            resume,
            coverLetter
        });

        await newApplication.save();

        res.status(201).json({ message: '應徵提交成功'})
    }catch(err){
        console.error('提交應徵失敗', err);
        res.status(500).json({ message: '伺服器錯誤' })
    }
});

// GET /api/applications/my - 取得當前用戶的應徵記錄 (必須放在 /:id 路由之前)
router.get('/my', verifyToken, async(req, res) => {
    try{
        const userId = req.user.userId;
        console.log('=== 收到取得用戶應徵記錄請求 ===')
        console.log('用戶ID:', userId)
        
        const applications = await Application.find({ userId })
            .populate('jobId', 'jobTitle companyName location salaryRange')
            .sort({ createdAt: -1 });

        console.log('查詢到的應徵記錄數量:', applications.length)
        console.log('應徵記錄:', applications)

        res.status(200).json(applications);
    }catch(err){
        console.error('取得用戶應徵記錄失敗', err);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// GET /api/applications - 取得所有應徵 (管理員用)
router.get('/', verifyToken, async(req, res) => {
    try{
        const applications = await Application.find()
            .populate('userId', 'email profile')
            .populate('jobId', 'jobTitle companyName')
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    }catch(err){
        console.error('取得應徵失敗', err);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// PUT /api/applications/:id/status - 更新應徵狀態
router.put('/:id/status', verifyToken, async(req, res) => {
    try{
        const { id } = req.params;
        const { status } = req.body;

        // 驗證狀態值
        const validStatuses = ['pending', 'shortlisted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: '無效的狀態值' });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ message: '應徵不存在' });
        }

        res.json({ message: '狀態更新成功', application: updatedApplication });
    }catch(err){
        console.error('更新應徵狀態失敗', err);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

module.exports = router;