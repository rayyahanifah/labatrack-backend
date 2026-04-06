const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { requireAuth } = require('../middleware/authMiddleware');

// POST http://localhost:3000/api/transactions
router.post('/', requireAuth, transactionController.createTransaction);

module.exports = router;