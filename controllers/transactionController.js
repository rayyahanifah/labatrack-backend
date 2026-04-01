const db = require('../config/db');

exports.createTransaction = (req, res) => {
    const { user_id, items, payment_method } = req.body;

    const productIds = items.map(item => item.product_id);
    const sqlGetProducts = "SELECT id, base_price, sell_price, stock FROM products WHERE id IN (?)";

    db.query(sqlGetProducts, [productIds], (err, products) => {
        if (err) return res.status(500).json({ error: "Gagal ambil data produk: " + err.message });

        let total_amount = 0;
        let total_profit = 0;
        const productMap = {};
        products.forEach(p => { productMap[p.id] = p; });

        items.forEach(item => {
            const p = productMap[item.product_id];
            if (p) {
                const subtotal = item.quantity * item.price;
                const profit = (item.price - p.base_price) * item.quantity;
                total_amount += subtotal;
                total_profit += profit;
                item.calculated_subtotal = subtotal; 
            }
        });

        const sqlTx = "INSERT INTO transactions (user_id, total_amount, total_profit, payment_method) VALUES (?, ?, ?, ?)";
        db.query(sqlTx, [user_id, total_amount, total_profit, payment_method], (err, result) => {
            if (err) return res.status(500).json({ error: "Gagal simpan transaksi: " + err.message });

            const transaction_id = result.insertId;

            const detailPromises = items.map(item => {
                return new Promise((resolve, reject) => {
                    const sqlDetail = "INSERT INTO transaction_details (transaction_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)";
                    db.query(sqlDetail, [transaction_id, item.product_id, item.quantity, item.calculated_subtotal], (err) => {
                        if (err) return reject(err);
                        const sqlUpdateStock = "UPDATE products SET stock = stock - ? WHERE id = ?";
                        db.query(sqlUpdateStock, [item.quantity, item.product_id], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                });
            });

            Promise.all(detailPromises)
                .then(() => {
                    // --- LOGIKA STREAK DIMULAI DI SINI ---
                    const today = new Date().toISOString().slice(0, 10);
                    const sqlCheckStreak = "SELECT * FROM streaks WHERE user_id = ?";
                    
                    db.query(sqlCheckStreak, [user_id], (err, streakResult) => {
                        if (streakResult.length === 0) {
                            db.query("INSERT INTO streaks (user_id, current_streak, last_transaction_date) VALUES (?, 1, ?)", [user_id, today]);
                        } else {
                            const lastDate = new Date(streakResult[0].last_transaction_date).toISOString().slice(0, 10);
                            if (lastDate !== today) {
                                db.query("UPDATE streaks SET current_streak = current_streak + 1, last_transaction_date = ? WHERE user_id = ?", [today, user_id]);
                            }
                        }

                        // Respon dikirim SETELAH streak diproses
                        res.status(201).json({ 
                            message: "Transaksi Berhasil!", 
                            transactionId: transaction_id,
                            total_bayar: total_amount,
                            total_laba: total_profit
                        });
                    });
                    // --- LOGIKA STREAK SELESAI ---
                })
                .catch(detailErr => {
                    res.status(500).json({ error: "Gagal update detail/stok: " + detailErr.message });
                });
        });
    });
};