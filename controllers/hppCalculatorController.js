// controllers/hppCalculatorController.js

exports.hitungHPP = (req, res) => {
    const {
        namaProduk,
        jumlahProduksi,
        biayaBahanBaku = 0,
        biayaTenagaKerja = 0,
        biayaOverhead = 0,
        metode,
        persentase
    } = req.body;

    // 1. Validasi Input Dasar
    if (!namaProduk || jumlahProduksi <= 0 || biayaBahanBaku <= 0 || persentase <= 0) {
        return res.status(400).json({ success: false, message: 'Input tidak valid.' });
    }

    // 2. Perhitungan HPP Dasar
    const hppTotal = biayaBahanBaku + biayaTenagaKerja + biayaOverhead;
    const hppPerUnit = hppTotal / jumlahProduksi;

    // 3. Penentuan Harga Jual Kotor (Belum Dibulatkan)
    let hargaJualKotor;
    if (metode === 'markup') {
        hargaJualKotor = hppPerUnit * (1 + (persentase / 100));
    } else if (metode === 'margin') {
        if (persentase >= 100) {
            return res.status(400).json({ success: false, message: 'Margin tidak boleh 100% atau lebih.' });
        }
        hargaJualKotor = hppPerUnit / (1 - (persentase / 100));
    } else {
        return res.status(400).json({ success: false, message: 'Metode harus markup atau margin.' });
    }

    // 4. PEMBULATAN HARGA JUAL (Ke Ratusan Terdekat ke Atas)
    // Contoh: 3214.28 menjadi 3300. Ini memudahkan transaksi UMKM.
    const hargaJualPerUnit = Math.ceil(hargaJualKotor / 100) * 100;

    // 5. Kalkulasi Keuntungan
    // Kita juga membulatkan HPP per unit agar bersih tanpa desimal di database
    const hppPerUnitBulat = Math.round(hppPerUnit); 
    
    // Keuntungan dihitung dari harga jual yang SUDAH dibulatkan
    const keuntunganPerUnit = hargaJualPerUnit - hppPerUnitBulat;

    const totalKeuntungan = keuntunganPerUnit * jumlahProduksi;
    const totalPendapatan = hargaJualPerUnit * jumlahProduksi;

    // 6. Kirim Response ke Client
    res.json({
        success: true,
        data: {
            namaProduk,
            jumlahProduksi,
            hppTotal,
            hppPerUnit: hppPerUnitBulat, // Kirim yang sudah bersih tanpa koma
            hargaJualPerUnit,            // Sudah dibulatkan ratusan (misal: 3300)
            keuntunganPerUnit,
            totalKeuntungan,
            totalPendapatan,
            labelMetode: metode === 'markup' ? `Markup ${persentase}%` : `Margin ${persentase}%`
        }
    });
};