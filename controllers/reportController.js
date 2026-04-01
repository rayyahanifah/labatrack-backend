const db = require('../config/db');

exports.getSummary = (req, res) => {
    const { user_id } = req.query;

    // Query untuk hitung Total Omzet, Total Laba, dan Jumlah Transaksi
    const sql = `
        SELECT 
            SUM(total_amount) as total_omzet, 
            SUM(total_profit) as total_laba, 
            COUNT(id) as total_transaksi 
        FROM transactions 
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const summary = result[0];
        res.status(200).json({
            message: "Data Laporan Berhasil Ditarik!",
            data: {
                omzet: summary.total_omzet || 0,
                laba: summary.total_laba || 0,
                jumlah_penjualan: summary.total_transaksi || 0
            }
        });
    });
};