const mongoose = require('mongoose');
const { Roles } = require('../constants/roles');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [Roles.GENERAL, Roles.TALENT, Roles.COMPANY, Roles.ADMIN],
        default: Roles.GENERAL
    },
    // 個人資料
    profile: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        avatar: { type: String }, // 頭像URL
        // 人才相關欄位
        skills: [{ type: String }],
        experience: { type: String },
        education: { type: String },
        resume: { type: String }, // 履歷URL
        // 企業相關欄位
        company: { type: String, trim: true },
        position: { type: String, trim: true },
        companyDescription: { type: String },
        // 一般欄位
        location: { type: String, trim: true },
        bio: { type: String }
    },
    // 帳戶狀態
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    // 時間戳記
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 更新時自動更新 updatedAt
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);