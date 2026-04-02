const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Panggil konfigurasi DB (sesuaikan dengan kodemu)
const db = require('./config/db');

// 1. Panggil semua routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // Tetap ada untuk CRUD produk nanti
const hppCalculatorRoutes = require('./routes/hppCalculatorRoutes'); // Rute baru untuk kalkulator
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 2. Pasang rute SEBELUM app.listen
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/hpp-calculator', hppCalculatorRoutes); // Endpoint: /api/hpp-calculator
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('Server LabaTrack Hidup!');
});

// 3. LISTEN HARUS PALING BAWAH
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});