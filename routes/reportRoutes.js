const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth } = require('../middleware/authMiddleware');

// Cukup panggil http://localhost:3000/api/reports/summary
router.get('/summary', requireAuth, reportController.getSummary);

module.exports = router;