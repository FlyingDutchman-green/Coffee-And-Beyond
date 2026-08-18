# Production Operations Runbook
## Coffee And Beyond — Operational Guide for Staff & Management

---

### 1. Overview & Operational Architecture

Sistem operasional **Coffee And Beyond** menghubungkan pemesanan mandiri tamu berbasis kode QR meja (*Dine-In Self Ordering*) dengan dashboard dapur realtime (*Kitchen Live Queue*), kontrol katalog menu, dan generator QR standee meja fisik.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          OPERATIONAL WORKFLOW                               │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│ 1. Customer Scans │ 2. Cashier Checks │ 3. Barista/Kitchen│ 4. Order Served │
│ QR on Table A01   │ Payment at Desk   │ Brews & Prepares  │ & Auto-Archived │
│ (Status: NEW)     │ (Status:CONFIRMED)│ (PREPARING/READY) │ (COMPLETED)     │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

---

### 2. Panduan Operasional Kasir (Front of House)

#### 2.1 Menerima & Mengonfirmasi Pesanan Baru
1. Saat tamu mengirimkan pesanan dari meja, tiket baru muncul seketika di `/admin/live-orders` dengan status **`NEW`** dan nada dering chime berbunyi.
2. Tamu mendatangi kasir untuk konfirmasi dan pembayaran tunai/QRIS.
3. Kasir mencocokkan nomor meja dan nomor tiket (contoh: `Table A03 • #ORD-8921`).
4. Setelah pembayaran diterima, klik tombol hitam **"Confirm Payment"** pada kartu pesanan.
5. Status berubah menjadi **`CONFIRMED`** dan tiket diteruskan ke antrean kerja barista/dapur.

#### 2.2 Membatalkan Pesanan (*Order Cancellation / Void*)
1. Jika tamu membatalkan pesanan sebelum diproses atau terjadi kesalahan input, klik tautan sekunder **"Cancel Order"** pada kartu tiket.
2. Dialog konfirmasi akan muncul untuk mencegah salah klik (*accidental click protection*).
3. Klik **"Confirm Cancellation"**.
4. Tiket akan berubah status menjadi **`CANCELLED`**, otomatis keluar dari antrean aktif dapur, dan tercatat di riwayat transaksi.

#### 2.3 Melihat Riwayat Struk Transaksi
1. Buka menu **Order History** (`/admin/history`).
2. Gunakan kolom pencarian untuk mencari berdasarkan Nomor Meja, ID Order, atau Nama Menu.
3. Klik tombol **"View Receipt"** pada baris transaksi untuk melihat struk rincian item, harga per baris, dan catatan khusus.

---

### 3. Panduan Operasional Barista & Dapur (Kitchen & Bar)

#### 3.1 Manajemen Antrean Live (`/admin/live-orders`)
- **Urutan Antrean (*Urgency Queue*)**: Tiket diurutkan otomatis dari yang paling lama menunggu (paling kiri atas) agar pesanan tamu yang pertama masuk selalu diprioritaskan.
- **Daftar Kuantitas (*High Contrast*)**: Angka kuantitas berlatar hitam tebal `[2x]` mempermudah barista membaca jumlah racikan dalam sekali pandang.
- **Catatan Khusus (*Special Request*)**: Kotak bergaris aksen warm taupe menandakan permintaan khusus (contoh: *Less ice, oat milk, extra crispy*).

#### 3.2 Siklus Hidup Status Racikan (Single-Click Progression)
1. **Mulai Meracik**: Klik **"Start Preparing"** saat mulai menggiling kopi atau memasak -> Status menjadi **`PREPARING`** (Layar tamu otomatis menampilkan indikator racikan berjalan).
2. **Selesai Dirancik**: Klik **"Mark Ready"** saat pesanan telah diletakkan di nampan saji -> Status menjadi **`READY`**.
3. **Disajikan ke Meja**: Saat runner/server mengantarkan pesanan ke meja tamu, klik **"Serve & Complete"** -> Status menjadi **`COMPLETED`** dan tiket otomatis diarsipkan ke history.

#### 3.3 Audio Alert Controls
- Klik ikon speaker di kanan atas toolbar antrean untuk mengaktifkan / menonaktifkan nada dering saat order baru masuk (*Mute / Unmute*).
- Nada chime ganda (D5 & A5) otomatis berbunyi tiap ada pesanan meja berstatus `NEW`.

---

### 4. Panduan Manajer Café (Menu & Table Management)

#### 4.1 Mengubah Ketersediaan Stok (*In-Stock / Sold Out*)
1. Buka menu **Menu Management** (`/admin/menu`).
2. Cari item yang bahannya habis (misal: *Panama Geisha Natural V60*).
3. Klik saklar toggle stok pada kolom **Stock Toggle**.
4. Status item langsung berubah menjadi **Sold Out** tanpa reload halaman.
5. Katalog publik (`/menu`) dan menu pemesanan meja (`/order/[tableId]`) seketika menampilkan badge *Sold Out* dan mengunci tombol pemesanan.

#### 4.2 Mengubah Harga atau Detail Menu
1. Pada halaman `/admin/menu`, klik ikon pensil (*Edit*) pada item yang ingin diubah.
2. Modal edit akan terbuka: ubah harga IDR, nama, deskripsi, atau tasting notes.
3. Klik **"Save Changes"**. Perubahan langsung tersinkronisasi ke seluruh layar.

#### 4.3 Menambah Menu Baru ke Katalog
1. Klik tombol **"+ Add Offering"** di `/admin/menu`.
2. Isi Nama, Kategori, Harga (IDR), Deskripsi, Tasting Notes, dan Suhu Penyajian (*Hot / Iced*).
3. Klik **"Create Offering"**.

#### 4.4 Menambah Meja Baru & Mencetak Standee Akrilik A6
1. Buka menu **Tables & QR** (`/admin/tables`).
2. Untuk menambah meja: Klik **"+ Add Table"**, masukkan kode meja (contoh: `A07`), nama display, zona area, dan kapasitas tamu (*Pax*).
3. Untuk mencetak standee akrilik meja:
   - **Cetak Meja Tunggal**: Klik tombol **"Standee"** pada kartu meja -> Klik **"Print Now"**.
   - **Cetak Seluruh Meja Sekaligus**: Klik tombol **"Print All Standees"** di toolbar atas -> Klik **"Print Now"**.
4. Standee dirancang presisi dengan rasio potret standar akrilik meja A6 (105mm × 148mm) dan QR code tajam kontras tinggi.

---

### 5. Penanganan Masalah & Edge Cases (Troubleshooting)

| Gejala / Masalah | Penyebab Kemungkinan | Solusi Cepat |
| :--- | :--- | :--- |
| Audio chime tidak berbunyi saat order baru masuk | Kebijakan autoplay browser memblokir audio sebelum ada interaksi pertama | Klik satu kali di mana saja pada layar dashboard dapur atau klik tombol speaker toggle untuk mengaktifkan Web Audio API. |
| Tamu tidak dapat submit keranjang meja | Ada item yang habis (*Sold Out*) atau meja dinonaktifkan staf | Pastikan item yang sold out dihapus dari keranjang, atau pastikan status meja aktif di `/admin/tables`. |
| Kasir tidak sengaja membuka browser tanpa internet lokal | Koneksi lokal terputus | Sistem menggunakan *localStorage reactive layer* yang tetap bekerja secara lokal di browser selama tab aktif. |
| URL meja salah ketik oleh tamu (misal: `/order/XYZ`) | Meja tidak terdaftar di armada | Sistem otomatis menampilkan halaman pemilihan meja resmi café di `/order`. |

---

*Dokumen ini merupakan pedoman resmi operasional MVP Coffee And Beyond.*
