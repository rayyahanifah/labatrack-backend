const supabase = require('../config/supabase');

// API: Tambah Produk Baru (Create) + UPLOAD GAMBAR
exports.addProduct = async (req, res) => {
    try {
        // Ambil data dari body (user_id diambil dari req.user jika pakai middleware auth)
        const { name, category, base_price, sell_price, stock } = req.body;
        const user_id = req.user.id; // Diambil dari middleware requireAuth
        const file = req.file; // File gambar dari multer

        let imageUrl = null;

        // 1. Logika Upload ke Supabase Storage
        if (file) {
            // Buat nama file unik (timestamp + nama asli)
            const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product-images') // Nama bucket yang kamu buat tadi
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // 2. Ambil Public URL gambar yang baru diupload
            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }

        // 3. Simpan data ke Database Supabase
        const { data, error } = await supabase
            .from('products')
            .insert([{ 
                user_id, 
                name, 
                category: category || 'Umum', 
                base_price, 
                sell_price, 
                stock, 
                image_url: imageUrl // Simpan link gambarnya di sini
            }])
            .select();

        if (error) throw error;

        // Hitung estimasi laba untuk response (Smart Pricing)
        const profit_per_item = sell_price - base_price;

        res.status(201).json({ 
            message: "Produk berhasil ditambahkan!", 
            product: data[0],
            estimasi_laba: profit_per_item 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Ambil Semua Produk per User (Read)
exports.getProducts = async (req, res) => {
    try {
        const user_id = req.user.id; // Pakai ID dari token login agar lebih aman

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};