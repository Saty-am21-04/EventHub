const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// --- Multer Config (Temp Storage) ---
const upload = multer({ dest: uploadDir });

// Import the Controller
const { smartRegister } = require('../controllers/aiController');

// --- Define the Route ---
// This handles POST requests to /api/ai/scan
// 'image' matches the FormData key sent from React
router.post('/scan', upload.single('image'), smartRegister);

module.exports = router;