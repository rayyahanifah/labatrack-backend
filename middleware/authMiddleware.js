const jwt = require('jsonwebtoken');
require('dotenv').config();

const requireAuth = (req, res, next) => {
    // 1. Ambil token JWT dari cookie yang dikirim klien
    const token = req.cookies.jwt;

    // 2. Cek apakah token ada
    if (token) {
        // 3. Verifikasi token
        jwt.verify(token, process.env.JWT_SECRET || 'rahasia_super_aman_labatrack', (err, decodedToken) => {
            if (err) {
                console.log("Token tidak valid:", err.message);
                return res.status(401).json({ message: "Sesi tidak valid, silakan login kembali." });
            } else {
                // Token valid, simpan id user ke req agar bisa dipakai di controller
                req.user = decodedToken; 
                next(); // Lanjut ke controller (misal: getSummary)
            }
        });
    } else {
        return res.status(401).json({ message: "Akses ditolak, silakan login terlebih dahulu!" });
    }
};

module.exports = { requireAuth };