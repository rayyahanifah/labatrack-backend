const db = require('../config/db');

// API: Tambah Produk Baru (Create)
exports.addProduct = (req, res) => {
    const { user_id, name, category, base_price, sell_price, stock } = req.body;

    // Logika: Hitung estimasi laba per item (Smart Pricing)
    const profit_per_item = sell_price - base_price;

    const sql = "INSERT INTO products (user_id, name, category, base_price, sell_price, stock) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [user_id, name, category, base_price, sell_price, stock], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.status(201).json({ 
            message: "Produk berhasil ditambahkan!", 
            productId: result.insertId,
            estimasi_laba: profit_per_item 
        });
    });
};

// API: Ambil Semua Produk per User (Read)
exports.getProducts = (req, res) => {
    const { user_id } = req.query; // Ambil user_id dari parameter URL

    const sql = "SELECT * FROM products WHERE user_id = ?";
    
    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};