const mongoose = require('mongoose');

const hireRequestSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true},
    salaryRange: { type: String, required: true},
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('HireRequest', hireRequestSchema);