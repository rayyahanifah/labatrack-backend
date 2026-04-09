const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/authMiddleware'); // Import middleware auth
const multer = require('multer');

// Konfigurasi Multer untuk simpan di memori (cocok buat Vercel + Supabase)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } 
});

router.post('/add', requireAuth, upload.single('image'), productController.addProduct);

router.get('/', requireAuth, productController.getProducts);

module.exports = router;