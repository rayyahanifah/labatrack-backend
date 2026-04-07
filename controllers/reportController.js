exports.getSummary = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Ambil range waktu hari ini
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // 1. Ambil transaksi hari ini
        const { data: transactions, error: txErr } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user_id)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString())
            .order('created_at', { ascending: false });

        if (txErr) throw txErr;

        // 2. Ambil detail transaksi (Produk Terjual)
        let totalUnitTerjual = 0;
        if (transactions.length > 0) {
            // Ambil semua ID transaksi hari ini
            const txIds = transactions.map(t => t.id);

            const { data: details, error: detErr } = await supabase
                .from('transaction_details')
                .select('quantity')
                .in('transaction_id', txIds); // Filter berdasarkan ID transaksi yang kita dapat tadi

            if (detErr) throw detErr;
            
            totalUnitTerjual = details.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);
        }

        // 3. Ambil data produk (Sisa Stok)
        const { data: products, error: prodErr } = await supabase
            .from('products')
            .select('stock')
            .eq('user_id', user_id);

        if (prodErr) throw prodErr;

        const totalLaba = transactions.reduce((acc, curr) => acc + (parseFloat(curr.total_profit) || 0), 0);
        const totalSisaStok = products.reduce((acc, curr) => acc + (parseInt(curr.stock) || 0), 0);

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