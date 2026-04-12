# 🚀 LabaTrack - Backend API
Sistem Manajemen Keuangan UMKM untuk memantau laba dan stok secara real-time.

 **✨ Fitur Utama:**
- **Auth:** Login & Register (Secure with Bcrypt)
- **Inventory:** Manajemen stok barang otomatis
- **POS System:** Transaksi penjualan & perhitungan laba bersih
- **Streak System:** Motivasi jualan harian (Daily Streak)
- **Reports:** Summary total omzet dan laba
- **HPP Calculator:** Making cost of goods sold calculations and profit estimates

 **🛠️ Tech Stack:**
- Node.js & Express
- MySQL Database
- Git & GitHub

### 2. Konfigurasi Backend (Express.js)
Masuk ke folder backend untuk mengatur koneksi server dan database:

1. `cd labatrack-backend`
2. `npm install`
3. Buat file **.env** dan masukkan konfigurasi berikut:

```env
# API Key dari Supabase Dashboard (Settings > API)
SUPABASE_URL=link_url_supabase_anda
SUPABASE_ANON_KEY=key_anon_supabase_anda

# Rahasia untuk enkripsi Token Login
JWT_SECRET=kode_rahasia_jwt_anda

# Port server lokal
PORT=3000

3. Konfigurasi Frontend (React)
Buka terminal baru untuk menjalankan antarmuka aplikasi:

cd labatrack

npm install

Buat file .env di root folder frontend agar bisa terhubung ke backend:

Cuplikan kode
VITE_API_URL=http://localhost:3000
Jalankan aplikasi: npm run dev
