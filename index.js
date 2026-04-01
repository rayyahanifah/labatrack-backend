const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // 1. Panggil rute di atas
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 2. Pasang rute SEBELUM app.listen
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('Server LabaTrack Hidup!');
});

// 3. LISTEN HARUS PALING BAWAH
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});