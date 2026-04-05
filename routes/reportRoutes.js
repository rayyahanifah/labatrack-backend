const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// Import middleware yang baru dibuat
const { requireAuth } = require('../middleware/authMiddleware');

// Alamat: GET http://localhost:3000/api/reports/summary?user_id=1
// Sisipkan requireAuth di tengah sebelum reportController dipanggil
router.get('/summary', requireAuth, reportController.getSummary);

module.exports = router;