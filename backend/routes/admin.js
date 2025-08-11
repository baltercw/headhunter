const express = require('express');
const router = express.Router();
const HireRequest = require('../models/HireRequest');
const Job = require('../models/Job');
const verifyToken = require('../middlewares/auth');

