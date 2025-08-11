// 給人才端看的資料
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    requirement: { type: String, required: true },
    location: { type: String, required: true },
    isRemote: { type: Boolean, required: true },
    salaryRange: { type: String, required: true },
    contactEmail: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    },
    isOpen: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);