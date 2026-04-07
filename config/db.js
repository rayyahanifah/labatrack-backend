// const mysql = require('mysql2');
// require('dotenv').config();

// // Buat koneksi ke db
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// // Cek koneks
// db.connect((err) => {
//     if (err) {
//         console.error('Koneksi DB gagal huuhu: ' + err.stack);
//         return;
//     }
//     console.log('Yess, DB terkoneksi.');
// });

// module.exports = db;