const express = require('express');
const router = express.Router();
const User = require('../models/User'); //匯入 model
const bcrypt = require('bcrypt'); // 密碼加密用
const jwt = require('jsonwebtoken'); //發token用的

// 定義一個 POST API，路徑是 /register，用來處理「使用者註冊」請求
router.post('/register', async(req, res) => {
    try{
        const { email, password, role } = req.body;

        //檢查是否有相同
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'Email 已被註冊 '});
        }

        // 加密密碼 強度10
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role
        });

        //儲存進資料庫
        await newUser.save();

        //回傳成功訊息給前端
        res.status(201).json({ message: '註冊成功'});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if(!existingUser){
            return res.status(400).json({ message: '帳號或密碼錯誤1 '});
        }
        const isMatch = await bcrypt.compare(password, existingUser.password)

        if(!isMatch){
            return res.status(400).json({ message: '帳號或密碼錯誤2 '});
        }

        const token = jwt.sign(
            {
                userId: existingUser._id,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: '登入成功',
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role,
                profile: existingUser.profile
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: '伺服器錯誤 '});
    }
});

const verifyToken = require('../middlewares/auth');

router.get('/me', verifyToken, (req, res) => {
    res.status(200).json(req.user)
});

// 更新個人資料
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { profile } = req.body;
        const userId = req.user.userId;

        console.log('=== 收到更新個人資料請求 ===')
        console.log('用戶ID:', userId)
        console.log('要更新的個人資料:', profile)

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profile },
            { new: true, runValidators: true }
        );

        console.log('=== 資料庫更新結果 ===')
        console.log('更新後的用戶資料:', updatedUser)
        console.log('更新後的個人資料:', updatedUser.profile)

        if (!updatedUser) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        res.json({
            message: '個人資料更新成功',
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                role: updatedUser.role,
                profile: updatedUser.profile
            }
        });
    } catch (err) {
        console.error('更新個人資料失敗', err);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// 取得個人資料
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        console.log('=== 收到取得個人資料請求 ===')
        console.log('用戶ID:', userId)
        
        const user = await User.findById(userId).select('-password');

        console.log('=== 資料庫查詢結果 ===')
        console.log('用戶資料:', user)
        console.log('個人資料:', user?.profile)

        if (!user) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        });
    } catch (err) {
        console.error('取得個人資料失敗', err);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// GET /api/user
router.get('/user', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

module.exports = router;