const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi bantuan untuk membuat Token JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'rahasia_super_aman_labatrack', {
        expiresIn: '3d'
    });
};

// 1. PASTIKAN FUNGSI REGISTER ADA DI SINI
exports.register = async (req, res) => {
    const { store_name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (store_name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [store_name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Email sudah terdaftar!" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Pendaftaran Toko Berhasil!", userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. FUNGSI LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0) return res.status(404).json({ message: "User tidak ditemukan!" });

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.PASSWORD || user.password);
            
            if (!isMatch) return res.status(401).json({ message: "Password salah!" });

            const token = createToken(user.id);
            res.cookie('jwt', token, { 
                httpOnly: true, 
                maxAge: 3 * 24 * 60 * 60 * 1000 
            });

            return res.status(200).json({
                message: "Login Berhasil!",
                user: { id: user.id, store_name: user.store_name, email: user.email }
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. FUNGSI LOGOUT
exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: "Logout berhasil!" });
};