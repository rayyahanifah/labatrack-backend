const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// POST http://localhost:3000/api/transactions
router.post('/', transactionController.createTransaction);

module.exports = router;