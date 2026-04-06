const supabase = require('../config/supabase');

exports.getSummary = async (req, res) => {
    try {
        // Ambil user_id otomatis dari token (requireAuth)
        const user_id = req.user.id; 

        // Ambil semua data transaksi milik user tersebut
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('total_amount, total_profit')
            .eq('user_id', user_id);

        if (error) throw error;

        // Proses hitung manual dari data yang didapat
        let totalOmzet = 0;
        let totalLaba = 0;
        let jumlahTransaksi = transactions.length;

        transactions.forEach(item => {
            totalOmzet += parseFloat(item.total_amount) || 0;
            totalLaba += parseFloat(item.total_profit) || 0;
        });

        res.status(200).json({
            message: "Data Laporan Berhasil Ditarik!",
            data: {
                omzet: totalOmzet,
                laba: totalLaba,
                jumlah_penjualan: jumlahTransaksi
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};