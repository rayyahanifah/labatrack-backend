const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth } = require('../middleware/authMiddleware');

// Cukup panggil http://localhost:3000/api/reports/summary
// Ganti /summary menjadi /dashboard-summary
router.get('/dashboard-summary', requireAuth, reportController.getSummary);

module.exports = router;