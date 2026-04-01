const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Alamat: POST http://localhost:3000/api/products/add
router.post('/add', productController.addProduct);

// Alamat: GET http://localhost:3000/api/products?user_id=1
router.get('/', productController.getProducts);

module.exports = router;