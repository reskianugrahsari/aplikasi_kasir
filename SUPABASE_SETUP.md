# Setup Database Supabase - Panduan Manual

## Langkah 1: Buka SQL Editor Supabase

1. Buka browser Anda
2. Navigasi ke: https://supabase.com/dashboard/project/igcxjwkdynpiaziyynrd/sql/new
3. Login jika diminta

## Langkah 2: Jalankan SQL Schema

1. Di SQL Editor, copy seluruh isi file `supabase-schema.sql` yang ada di folder project Anda
2. Paste ke SQL Editor
3. Klik tombol **Run** atau tekan `Ctrl+Enter` untuk menjalankan query
4. Tunggu hingga muncul notifikasi "Success" atau "Query executed successfully"

## Langkah 3: Verifikasi Tabel Sudah Terbuat

1. Di sidebar kiri Supabase dashboard, klik **Table Editor**
2. Anda seharusnya melihat 3 tabel baru:
   - `products` - untuk menyimpan data produk
   - `transactions` - untuk menyimpan transaksi
   - `transaction_items` - untuk menyimpan detail item transaksi

## Langkah 4: Jalankan Aplikasi

Setelah database schema berhasil dibuat, jalankan aplikasi dengan perintah:

```bash
npm run dev
```

## Troubleshooting

### Jika ada error "relation already exists"
Ini berarti tabel sudah pernah dibuat sebelumnya. Anda bisa:
- Skip error ini dan lanjut ke langkah berikutnya
- Atau hapus tabel yang sudah ada terlebih dahulu dengan query:
  ```sql
  DROP TABLE IF EXISTS transaction_items CASCADE;
  DROP TABLE IF EXISTS transactions CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
  ```
  Lalu jalankan ulang schema dari `supabase-schema.sql`

### Jika ada error RLS policy
Jika ada error terkait Row Level Security policy yang sudah ada, Anda bisa hapus policy lama dengan:
```sql
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert access for all users" ON products;
-- dst untuk semua policy
```

## Fitur yang Sudah Terintegrasi

✅ **Auto Migration** - Data dari localStorage akan otomatis dimigrasikan ke Supabase saat pertama kali aplikasi dijalankan

✅ **Real-time Sync** - Perubahan data akan langsung tersinkronisasi antar tab browser

✅ **Error Handling** - Aplikasi akan fallback ke localStorage jika Supabase tidak tersedia

✅ **Loading States** - Tampilan loading saat mengambil/menyimpan data

## Apa Selanjutnya?

Setelah database setup selesai, Anda bisa:
1. Test menambah produk di halaman Inventory
2. Test membuat transaksi di POS
3. Lihat data tersimpan di Supabase dashboard
4. Buka aplikasi di tab berbeda untuk test real-time sync
