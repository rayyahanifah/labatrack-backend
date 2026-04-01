const db = require('../config/db');
const bcrypt = require('bcrypt');

//REGIS
exports.register = async (req, res) => {
    const { store_name, email, password } = req.body;

    try {
        // 1. Enkripsi password (Saran Advisor: Bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Simpan ke database
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

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        
        db.query(sql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "User tidak ditemukan!" });
            }

            const user = result[0];

            try {
                // Pastikan await di sini ter-handle dengan try-catch internal
                const isMatch = await bcrypt.compare(password, user.PASSWORD || user.password);
                
                if (!isMatch) {
                    return res.status(401).json({ message: "Password salah!" });
                }

                return res.status(200).json({
                    message: "Login Berhasil!",
                    user: { id: user.id, store_name: user.store_name, email: user.email }
                });
            } catch (bcryptErr) {
                console.error("Error saat compare password:", bcryptErr);
                return res.status(500).json({ message: "Error saat memproses password" });
            }
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};