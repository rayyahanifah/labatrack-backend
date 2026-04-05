const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Tambahan
require('dotenv').config();

const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const hppCalculatorRoutes = require('./routes/hppCalculatorRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Update CORS agar bisa menerima cookie dari frontend
app.use(cors({
    origin: 'http://localhost:5173', // Ganti dengan URL Frontend kamu (misal React/Vite)
    credentials: true // Wajib true agar cookie bisa dikirim lintas port
}));

app.use(express.json());
app.use(cookieParser()); // Gunakan cookie-parser di sini

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/hpp-calculator', hppCalculatorRoutes); 
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('Server LabaTrack Hidup!');
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});