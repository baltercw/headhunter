const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    //關聯資料
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    //應徵資料
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    coverLetter: { type: String, required: true },
    resume: { type: String, required: true },
    //狀態
    status: { 
        type: String, 
        enum: ['pending', 'shortlisted', 'rejected'], 
        default: 'pending' 
    },
    //時間戳記
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Application', applicationSchema)