    const express = require('express');
const router = express.Router();
const hppCalculatorController = require('../controllers/hppCalculatorController');

// Endpoint API Kalkulator HPP (POST /api/hpp-calculator/hitung)
router.post('/hitung', hppCalculatorController.hitungHPP);

module.exports = router;