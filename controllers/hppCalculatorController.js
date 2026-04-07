// controllers/hppCalculatorController.js
const supabase = require('../config/supabase');

exports.hitungHPP = (req, res) => {
    try {
        const {
            namaProduk,
            jumlahProduksi,
            biayaBahanBaku,
            biayaTenagaKerja = 0,
            biayaOverhead = 0,
            metode,
            persentase
        } = req.body;

        // 1. Validasi Input
        if (!namaProduk || !jumlahProduksi || !biayaBahanBaku || !persentase) {
            return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi!' });
        }

        // 2. Hitung HPP Dasar
        const hppTotal = Number(biayaBahanBaku) + Number(biayaTenagaKerja) + Number(biayaOverhead);
        const hppPerUnitRaw = hppTotal / Number(jumlahProduksi);

        // 3. Penentuan Harga Jual (Markup vs Margin)
        let hargaJualKotor;
        const persenDecimal = Number(persentase) / 100;

        if (metode === 'markup') {
            hargaJualKotor = hppPerUnitRaw * (1 + persenDecimal);
        } else if (metode === 'margin') {
            if (persenDecimal >= 1) return res.status(400).json({ message: 'Margin tidak boleh 100% atau lebih!' });
            hargaJualKotor = hppPerUnitRaw / (1 - persenDecimal);
        }

        // 4. PEMBULATAN (Ratusan Terdekat ke Atas)
        // Contoh: 3214 -> 3300
        const hargaJualPerUnit = Math.ceil(hargaJualKotor / 100) * 100;
        const hppPerUnit = Math.round(hppPerUnitRaw);
        
        // 5. Kalkulasi Keuntungan & Total
        const keuntunganPerUnit = hargaJualPerUnit - hppPerUnit;
        const totalPendapatan = hargaJualPerUnit * Number(jumlahProduksi);
        const totalKeuntungan = keuntunganPerUnit * Number(jumlahProduksi);

        res.status(200).json({
            success: true,
            data: {
                namaProduk,
                jumlahProduksi,
                hppTotal,
                hppPerUnit,
                hargaJualPerUnit,
                keuntunganPerUnit,
                totalKeuntungan,
                totalPendapatan,
                labelMetode: `${metode.toUpperCase()} ${persentase}%`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};