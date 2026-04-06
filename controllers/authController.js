const supabase = require('../config/supabase'); // Pastikan path ke file koneksi bener
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi bantuan untuk membuat Token JWT (Tetap sama)
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'rahasia_super_aman_labatrack', {
        expiresIn: '3d'
    });
};

// 1. FUNGSI REGISTER
exports.register = async (req, res) => {
    const { store_name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Gaya Supabase: .from().insert()
        const { data, error } = await supabase
            .from('users')
            .insert([{ store_name, email, password: hashedPassword }])
            .select(); // Mengambil data yang baru diinsert

        if (error) {
            // Cek error email duplikat (PostgreSQL code 23505)
            if (error.code === '23505') {
                return res.status(400).json({ message: "Email sudah terdaftar!" });
            }
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json({ 
            message: "Pendaftaran Toko Berhasil!", 
            user: data[0] 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. FUNGSI LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Gaya Supabase: .from().select().eq()
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single(); // Ambil satu data saja

        if (error || !users) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }

        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah!" });

        const token = createToken(users.id);
        
        // Simpan ke Cookie
        res.cookie('jwt', token, { 
            httpOnly: true, 
            maxAge: 3 * 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({
            message: "Login Berhasil!",
            user: { id: users.id, store_name: users.store_name, email: users.email }
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