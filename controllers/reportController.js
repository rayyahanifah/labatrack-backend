const supabase = require('../config/supabase');

exports.getSummary = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Ambil tanggal hari ini (YYYY-MM-DD)
        const today = new Date().toLocaleDateString('en-CA');

        // 1. Ambil transaksi hari ini (LEBIH AMAN pakai transaction_date)
        const { data: transactions, error: txErr } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user_id)
            .eq('transaction_date', today)
            .order('created_at', { ascending: false });

        if (txErr) throw txErr;

        console.log("Transactions:", transactions);

        // 2. Ambil total produk terjual (PAKAI JOIN 🔥)
        let totalUnitTerjual = 0;

        const { data: details, error: detErr } = await supabase
            .from('transaction_details')
            .select(`
                quantity,
                transactions!inner(user_id, transaction_date)
            `)
            .eq('transactions.user_id', user_id)
            .eq('transactions.transaction_date', today);

        if (detErr) throw detErr;

        console.log("Details:", details);

        totalUnitTerjual = details.reduce(
            (acc, curr) => acc + (parseInt(curr.quantity) || 0),
            0
        );

        // 3. Ambil total stok
        const { data: products, error: prodErr } = await supabase
            .from('products')
            .select('stock')
            .eq('user_id', user_id);

        if (prodErr) throw prodErr;

        console.log("Products:", products);

        const totalLaba = transactions.reduce(
            (acc, curr) => acc + (parseFloat(curr.total_profit) || 0),
            0
        );

        const totalSisaStok = products.reduce(
            (acc, curr) => acc + (parseInt(curr.stock) || 0),
            0
        );

        res.status(200).json({
            stats: {
                labaHariIni: totalLaba,
                transaksiHariIni: transactions.length,
                totalProduk: totalSisaStok,
                produkTerjual: totalUnitTerjual
            },
            recent: transactions.slice(0, 5)
        });

    } catch (error) {
        console.error("Error Detail:", error);
        res.status(500).json({ error: error.message });
    }
};