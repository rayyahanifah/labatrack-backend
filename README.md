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

# 💰 LabaTrack

> Aplikasi Fullstack Web untuk tracking laba dan manajemen keuangan UMKM secara praktis, otomatis, dan berbasis Cloud.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📖 Deskripsi

**LabaTrack** adalah solusi digital yang membantu pemilik UMKM memantau dan menganalisis keuntungan usaha mereka secara *real-time*. Dikembangkan dengan arsitektur **Modern Web**, LabaTrack mengubah pencatatan manual menjadi sistem otomatis yang akurat untuk mendukung perkembangan bisnis UMKM.

---

## ✨ Fitur Utama

- 📊 **Dashboard Finansial** — Ringkasan laba harian & transaksi terbaru
- 🛒 **Smart Cashier** — Perhitungan transaksi otomatis
- 📈 **Kalkulator HPP** — Hitung harga pokok & margin keuntungan
- 📦 **Manajemen Produk** — CRUD produk terintegrasi database
- 🔐 **Autentikasi JWT** — Sistem login aman
- ☁️ **Cloud Database** — Supabase PostgreSQL

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi |
|-------|----------|
| Frontend | React.js (Vite) |
| Backend | Node.js & Express.js |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## 🚀 Cara Menjalankan Project (Local Setup)

### 1. Clone Repository

```bash
# Frontend
git clone https://github.com/rayyahanifah/labatrack.git

# Backend
git clone https://github.com/rayyahanifah/labatrack-backend.git

2. Setup Backend
cd labatrack-backend
npm install
