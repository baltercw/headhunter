const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middlewares/auth');

// 設定 multer 儲存檔案
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/')  // 儲存到 uploads/avatars/ 資料夾
  },
  filename: function (req, file, cb) {
    // 檔案名稱：時間戳 + 原始檔名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  }
});

// 檔案過濾器
const fileFilter = (req, file, cb) => {
  // 只允許圖片檔案
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳圖片檔案'), false);
  }
};

// 設定 multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024  // 限制 2MB
  }
});

// POST /api/upload/avatar - 上傳頭像
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    console.log('=== 收到檔案上傳請求 ===')
    console.log('用戶ID:', req.user.userId)
    
    if (!req.file) {
      console.log('沒有選擇檔案')
      return res.status(400).json({ message: '沒有選擇檔案' });
    }

    console.log('上傳的檔案資訊:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    })

    // 建立檔案網址
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    
    console.log('=== 檔案上傳成功 ===')
    console.log('檔案名稱:', req.file.filename);
    console.log('檔案網址:', avatarUrl);

    res.status(200).json({
      message: '頭像上傳成功',
      avatarUrl: avatarUrl
    });

  } catch (error) {
    console.error('檔案上傳失敗:', error);
    res.status(500).json({ message: '檔案上傳失敗' });
  }
});

module.exports = router;
