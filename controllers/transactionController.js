const supabase = require('../config/supabase');

exports.createTransaction = async (req, res) => {
    try {
        const { items, payment_method } = req.body;
        const user_id = req.user.id; // Ambil dari token JWT (Middleware)

        // 1. Ambil data produk untuk hitung laba & cek stok
        const productIds = items.map(item => item.product_id);
        const { data: products, error: prodErr } = await supabase
            .from('products')
            .select('id, base_price, sell_price, stock')
            .in('id', productIds);

        if (prodErr) throw prodErr;

        // Buat map produk supaya gampang dicari
        const productMap = {};
        products.forEach(p => { productMap[p.id] = p; });

        let total_amount = 0;
        let total_profit = 0;

        // Hitung total omzet dan total laba
        items.forEach(item => {
            const p = productMap[item.product_id];
            if (p) {
                const subtotal = item.quantity * p.sell_price;
                const profit = (p.sell_price - p.base_price) * item.quantity;
                total_amount += subtotal;
                total_profit += profit;
                item.subtotal = subtotal; // Simpan untuk insert detail nanti
            }
        });

        // 2. Simpan Header Transaksi
        const { data: txData, error: txErr } = await supabase
            .from('transactions')
            .insert([{ 
                user_id, 
                total_amount, 
                total_profit, 
                payment_method,
                transaction_date: new Date().toISOString().split('T')[0] 
            }])
            .select()
            .single();

        if (txErr) throw txErr;
        const transaction_id = txData.id;

        // 3. Simpan Detail Transaksi & Update Stok
        for (const item of items) {
            // Insert Detail
            await supabase.from('transaction_details').insert([{
                transaction_id,
                product_id: item.product_id,
                quantity: item.quantity,
                subtotal: item.subtotal
            }]);

            // Update Stok (PostgreSQL style: decrement)
            const p = productMap[item.product_id];
            await supabase
                .from('products')
                .update({ stock: p.stock - item.quantity })
                .eq('id', item.product_id);
        }

        // 4. LOGIKA STREAK
        const today = new Date().toISOString().split('T')[0];
        const { data: streakData } = await supabase
            .from('streaks')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (!streakData) {
            // Jika belum ada record streak, buat baru
            await supabase.from('streaks').insert([{ 
                user_id, 
                current_streak: 1, 
                last_transaction_date: today 
            }]);
        } else {
            // Jika sudah ada, cek apakah transaksi terakhir bukan hari ini
            if (streakData.last_transaction_date !== today) {
                await supabase
                    .from('streaks')
                    .update({ 
                        current_streak: streakData.current_streak + 1, 
                        last_transaction_date: today 
                    })
                    .eq('user_id', user_id);
            }
        }

        res.status(201).json({ 
            message: "Transaksi Berhasil!", 
            transactionId: transaction_id,
            total_bayar: total_amount,
            total_laba: total_profit
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};