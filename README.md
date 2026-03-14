# 🏪 KasirPintar AI — Smart POS Ecosystem

> Sistem kasir modern berbasis web dengan kecerdasan buatan (AI), manajemen inventaris real-time, dan laporan penjualan terintegrasi.

---

## 📋 Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Cara Menjalankan](#cara-menjalankan)
- [Konfigurasi Database (Supabase)](#konfigurasi-database-supabase)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Mode Offline & Fallback](#mode-offline--fallback)
- [Akun Login Default](#akun-login-default)
- [Troubleshooting](#troubleshooting)

---

## Tentang Aplikasi

**KasirPintar AI** adalah aplikasi Point of Sale (POS) berbasis web yang dirancang untuk usaha kecil dan menengah di bidang kuliner maupun retail. Aplikasi ini menggabungkan kemudahan operasional kasir harian dengan fitur manajemen bisnis cerdas yang didukung oleh **Google Gemini AI**.

Aplikasi berjalan langsung di browser tanpa perlu instalasi khusus, dan dapat digunakan secara **online** (tersinkronisasi dengan Supabase) maupun **offline** (menggunakan penyimpanan lokal browser).

---

## Fitur Utama

### 🖥️ Mode Admin (Panel Manajemen)
| Fitur | Keterangan |
|---|---|
| **Dashboard** | Ringkasan penjualan, grafik transaksi, dan statistik produk terlaris |
| **Inventaris Produk** | Tambah, edit, hapus produk dengan filter kategori dan status stok |
| **Filter Inventaris** | Filter produk berdasarkan kategori dan status stok dengan tombol Simpan |
| **Asisten AI** | Analisis bisnis otomatis menggunakan Google Gemini AI |

### 🛒 Mode Kasir (POS Terminal)
| Fitur | Keterangan |
|---|---|
| **Pencarian Produk** | Cari produk dengan cepat menggunakan nama |
| **Filter Kategori** | Filter produk berdasarkan kategori (Makanan, Minuman, Cemilan, Penutup) |
| **Keranjang Belanja** | Tambah/kurangi item, hitung total otomatis |
| **Pajak Layanan** | Kalkulasi pajak 10% otomatis |
| **Pembayaran Tunai** | Input nominal + kalkulasi kembalian otomatis |
| **Pembayaran QRIS** | Mode pembayaran non-tunai/digital |

### 🤖 Asisten AI (Powered by Gemini)
- Analisis tren penjualan berdasarkan data transaksi
- Rekomendasi produk dan strategi bisnis
- Laporan ringkasan kinerja bisnis
- Percakapan interaktif tentang operasional toko

---

## Teknologi yang Digunakan

| Teknologi | Versi | Kegunaan |
|---|---|---|
| **React** | 19.x | Framework UI utama |
| **TypeScript** | 5.8.x | Type safety & pengembangan |
| **Vite** | 6.x | Build tool & dev server |
| **Supabase** | 2.x | Database & real-time sync (PostgreSQL) |
| **Google Gemini AI** | `@google/genai` | Asisten kecerdasan buatan |
| **Recharts** | 3.x | Grafik & visualisasi data |
| **Lucide React** | 0.563.x | Icon library |
| **TailwindCSS** | (via CDN) | Styling & desain UI |

---

## Struktur Proyek

```
kasirpintar-ai/
├── components/
│   ├── AIAssistant.tsx     # Halaman asisten AI (Gemini)
│   ├── Dashboard.tsx       # Halaman dashboard & laporan
│   ├── Inventory.tsx       # Halaman manajemen inventaris
│   ├── Login.tsx           # Halaman login
│   ├── POS.tsx             # Terminal kasir (mode kasir)
│   └── Sidebar.tsx         # Navigasi sidebar admin
├── services/
│   ├── geminiService.ts    # Integrasi Google Gemini AI
│   ├── supabaseClient.ts   # Koneksi Supabase
│   └── supabaseService.ts  # Operasi CRUD database
├── App.tsx                 # Komponen root & routing
├── constants.ts            # Data produk awal (default)
├── types.ts                # TypeScript interfaces & enums
├── index.html              # Entry point HTML
├── .env.local              # Konfigurasi environment (API keys)
├── supabase-schema.sql     # Schema database SQL
└── vite.config.ts          # Konfigurasi Vite
```

---

## Cara Menjalankan

### Prasyarat
Pastikan sudah terinstal di komputer Anda:
- **Node.js** versi 18 ke atas → [Download Node.js](https://nodejs.org)
- **npm** (sudah termasuk dalam instalasi Node.js)

### Langkah Instalasi

**1. Clone atau download proyek ini**
```bash
git clone <url-repository>
cd kasirpintar-ai
```

**2. Install dependensi**
```bash
npm install
```

**3. Konfigurasi environment**

Buka file `.env.local` dan isi dengan konfigurasi Anda:
```env
# URL dan kunci dari dashboard Supabase Anda
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API key dari Google AI Studio
GEMINI_API_KEY=AIzaSy...
```

**4. Jalankan aplikasi**
```bash
npm run dev
```

**5. Buka di browser**
```
http://localhost:3000
```

---

## Konfigurasi Database (Supabase)

Aplikasi ini menggunakan **Supabase** sebagai database cloud. Ikuti langkah berikut untuk menyiapkan database:

### Langkah 1: Buat Akun & Proyek Supabase
1. Daftar di [supabase.com](https://supabase.com) (gratis)
2. Buat **New Project**
3. Catat **Project URL** dan **anon/public key** dari menu **Project Settings → API**

### Langkah 2: Buat Tabel Database
1. Buka **SQL Editor** di dashboard Supabase
2. Copy seluruh isi file `supabase-schema.sql` dari folder proyek ini
3. Paste ke SQL Editor dan klik **Run**

File `supabase-schema.sql` akan membuat 3 tabel:
- `products` — menyimpan data produk
- `transactions` — menyimpan header transaksi
- `transaction_items` — menyimpan detail item per transaksi

### Langkah 3: Update `.env.local`
Masukkan URL dan key dari Supabase ke file `.env.local` seperti pada langkah instalasi di atas.

> 💡 **Catatan:** Jika Supabase tidak dikonfigurasi atau tidak dapat dijangkau, aplikasi akan otomatis beralih ke mode offline menggunakan **localStorage** browser.

---

## Panduan Penggunaan

### 🔐 Login ke Aplikasi

Saat pertama kali membuka aplikasi, Anda akan diarahkan ke halaman login. Masukkan username dan password yang telah terdaftar.

> Username dan password dapat dikonfigurasi melalui database Supabase pada tabel autentikasi, atau menggunakan fitur Auth bawaan Supabase.

---

### 📊 Dashboard

Halaman pertama setelah login. Menampilkan:
- **Total Pendapatan** — akumulasi semua transaksi
- **Total Transaksi** — jumlah transaksi yang telah dilakukan
- **Produk Terlaris** — produk dengan penjualan tertinggi
- **Grafik Penjualan** — visualisasi tren pendapatan harian/mingguan

---

### 📦 Inventaris Produk

Kelola seluruh produk bisnis Anda di sini.

#### Menambah Produk Baru
1. Klik tombol **"+ Tambah Produk Baru"** di pojok kanan atas
2. Isi form: Nama Produk, Harga Jual, Stok, dan Kategori
3. Klik **"Finalisasi Produk"** untuk menyimpan

#### Mengedit Produk
1. Arahkan kursor ke baris produk yang ingin diedit
2. Klik ikon **pensil (✏️)** yang muncul di kolom Aksi
3. Ubah data yang diperlukan
4. Klik **"Perbarui Data"** untuk menyimpan perubahan

#### Menghapus Produk
1. Arahkan kursor ke baris produk
2. Klik ikon **tempat sampah (🗑️)**
3. Konfirmasi penghapusan pada dialog yang muncul

#### Menggunakan Filter
1. Klik tombol **"Filter"** di sebelah kanan kolom pencarian
2. Pilih **Kategori** yang ingin ditampilkan (bisa multi-pilih)
3. Pilih **Status Stok**: Semua / Ready / Low
4. Klik **"Simpan Filter"** untuk menerapkan
5. Klik **"Reset"** untuk menghapus semua filter

---

### 🛒 Mode Kasir (POS Terminal)

Klik tombol **"Buka Mode Kasir"** di sidebar untuk masuk ke tampilan kasir.

#### Proses Transaksi
1. **Cari produk** menggunakan kolom pencarian atau filter kategori
2. **Klik produk** untuk menambahkannya ke keranjang
3. Di panel keranjang (kanan):
   - Gunakan **+** / **-** untuk mengatur jumlah item
   - Lihat subtotal, pajak 10%, dan **grand total** secara real-time
4. Klik **"Lanjutkan Pembayaran"**

#### Proses Pembayaran
**Tunai:**
1. Pilih **"Uang Tunai"**
2. Masukkan nominal uang yang diterima (dapat menggunakan tombol cepat)
3. Kembalian dihitung otomatis
4. Klik **"Finalisasi Transaksi"**

**Non-Tunai (QRIS):**
1. Pilih **"Non-Tunai"**
2. Arahkan pelanggan untuk melakukan scan QRIS
3. Klik **"Konfirmasi Pembayaran QRIS"**

#### Kembali ke Panel Admin
Klik tombol **"Panel Admin"** di pojok kanan atas header kasir.

---

### 🤖 Asisten AI

Akses dari sidebar menu **"Asisten AI"**.

- Ketik pertanyaan tentang bisnis Anda di kolom chat
- AI akan menganalisis data produk dan transaksi Anda
- Contoh pertanyaan:
  - *"Produk apa yang paling sering terjual minggu ini?"*
  - *"Berikan rekomendasi strategi harga untuk produk kami"*
  - *"Bagaimana tren pendapatan kami bulan ini?"*

> Fitur ini membutuhkan **GEMINI_API_KEY** yang valid di file `.env.local`

---

## Mode Offline & Fallback

KasirPintar AI dirancang untuk tetap berfungsi meskipun **tanpa koneksi internet** atau jika Supabase tidak tersedia:

| Situasi | Perilaku Aplikasi |
|---|---|
| Supabase tidak terjangkau | Data disimpan ke **localStorage** browser |
| Tidak ada internet | Semua operasi CRUD bekerja secara lokal |
| Kembali online | Data lokal tetap tersedia; sync manual diperlukan |

> ⚠️ **Penting:** Data yang disimpan secara offline hanya tersedia di browser/perangkat tersebut. Pastikan koneksi ke Supabase aktif untuk sinkronisasi antar perangkat.

---

## Kategori Produk

KasirPintar mendukung **4 kategori produk** bawaan:

| Kode | Nama Tampilan |
|---|---|
| `FOOD` | Makanan |
| `DRINK` | Minuman |
| `SNACK` | Cemilan |
| `DESSERT` | Penutup |

---

## Script yang Tersedia

```bash
# Menjalankan server pengembangan (development)
npm run dev

# Membangun aplikasi untuk production
npm run build

# Melihat hasil build production secara lokal
npm run preview
```

---

## Troubleshooting

### ❌ Aplikasi tidak bisa dibuka
- Pastikan Node.js sudah terinstal: `node --version`
- Jalankan `npm install` terlebih dahulu sebelum `npm run dev`
- Pastikan port `3000` tidak sedang digunakan oleh aplikasi lain

### ❌ Data tidak tersimpan / Perbarui Data tidak berfungsi
- Periksa apakah URL Supabase di `.env.local` sudah benar
- Periksa koneksi internet Anda
- Aplikasi akan otomatis beralih ke **mode offline** jika Supabase tidak terjangkau (data tersimpan lokal)

### ❌ Asisten AI tidak merespons
- Pastikan `GEMINI_API_KEY` di `.env.local` sudah diisi dengan benar
- Dapatkan API key gratis di [Google AI Studio](https://aistudio.google.com)
- Periksa apakah API key masih aktif dan belum melampaui kuota

### ❌ Error "Missing Supabase environment variables"
- File `.env.local` belum dikonfigurasi
- Pastikan nama variabel tepat: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
- Restart server dev setelah mengubah `.env.local`: tekan `Ctrl+C` lalu `npm run dev`

### ❌ Error "relation does not exist" di Supabase
- Schema database belum dijalankan
- Ikuti panduan [Konfigurasi Database (Supabase)](#konfigurasi-database-supabase)
- Jalankan file `supabase-schema.sql` di SQL Editor Supabase

---

## Lisensi

Proyek ini dikembangkan untuk keperluan internal. Seluruh hak cipta dilindungi.

---

<div align="center">
  <p>Dibuat dengan ❤️ menggunakan React + TypeScript + Vite</p>
  <p><strong>KasirPintar AI</strong> — Smart POS Ecosystem</p>
</div>
