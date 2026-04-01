const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Alamat: GET http://localhost:3000/api/reports/summary?user_id=1
router.get('/summary', reportController.getSummary);

module.exports = router;