# Business Rules & Operational Policies
## Coffee And Beyond

---

### 1. Table Identification & Session Scope

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Customer Scans Table QR Code -> Resolves to /order/[tableId] (e.g. /order/A03)
│ ├─ Table validation: Table exists & is_active = true
│ ├─ Table identifier is permanently recorded on the order entity
│ └─ Guest can track active orders for that specific table session
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Format Identifikasi Meja**:
   - URL pemesanan menggunakan dynamic parameter `/order/[tableId]` (contoh: `/order/A01`, `/order/A03`, `/order/OUT-02`).
   - Setiap kode QR yang dicetak pada meja fisik mereferensikan slug/kode unik meja tersebut.
2. **Validasi Meja**:
   - Jika pengunjung mengakses URL meja yang tidak terdaftar atau non-aktif (`is_active = false`), sistem menampilkan pesan peringatan dan mencegah proses pemesanan.
3. **Perekaman Meja pada Pesanan**:
   - Setiap pesanan wajib memiliki relasi valid `table_id` di database. Pesanan tanpa identitas meja dianggap tidak sah (*invalid order*).

---

### 2. MVP Workflow & Payment Model

Untuk rilis MVP, Coffee And Beyond menerapkan alur operasional:
**Order First -> Counter Payment Confirmation -> Kitchen Processes**

```
┌─────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────┐      ┌───────────┐
│   NEW   │ ──>  │  CONFIRMED  │ ──>  │  PREPARING  │ ──>  │  READY  │ ──>  │ COMPLETED │
└─────────┘      └─────────────┘      └─────────────┘      └─────────┘      └───────────┘
 (Customer        (Kasir Cek &          (Barista Mulai       (Pesanan Siap     (Disajikan &
  Submit)          Terima Bayar)         Meracik Menu)        Diantar/Ambil)     Selesai)
```

#### Detail Lifecycle Status Pesanan:

| Status Code | Label Tampilan | Pelaku / Pemicu | Deskripsi & Aturan Bisnis |
| :--- | :--- | :--- | :--- |
| `NEW` | Menunggu Konfirmasi | Customer Submit | Pesanan berhasil dibuat oleh pelanggan. Tiket muncul di antrean kasir. Belum mulai diracik oleh dapur/barista untuk mencegah pembuatan pesanan fiktif sebelum ada konfirmasi fisik/pembayaran. |
| `CONFIRMED` | Terkonfirmasi | Kasir / Admin | Kasir memverifikasi pelanggan di meja atau menerima pembayaran di kasir. Menandakan pesanan valid dan masuk ke antrean kerja dapur. |
| `PREPARING` | Sedang Disiapkan | Barista / Kitchen | Barista atau chef dapur mengklik tombol mulai membuat pesanan. Pelanggan melihat indikasi visual bahwa racikan sedang berjalan. |
| `READY` | Siap Disajikan | Barista / Kitchen | Semua item dalam pesanan telah selesai dibuat dan siap diantarkan oleh staf ke meja pelanggan (atau diambil pelanggan). |
| `COMPLETED` | Selesai | Staff / Server | Pesanan telah berada di meja pelanggan secara lengkap. Tiket diarsipkan dari antrean aktif dashboard operasional. |
| `CANCELLED` | Dibatalkan | Staf Kasir / Admin | Pesanan dibatalkan karena alasan tertentu (bahan habis tak terduga, pelanggan membatalkan sebelum konfirmasi, dll). |

---

### 3. Order Cancellation Policy

1. **Batasan Pembatalan oleh Pelanggan**:
   - Pelanggan **TIDAK DAPAT** membatalkan pesanan secara mandiri dari aplikasi setelah status pesanan berubah menjadi `CONFIRMED` atau `PREPARING`.
   - Jika pesanan masih berstatus `NEW`, pelanggan dapat meminta kasir untuk membatalkan pesanan langsung di kasir.
2. **Kewenangan Pembatalan oleh Staf**:
   - Hanya staf kasir, barista, atau admin (via Kitchen/Admin Dashboard) yang memiliki otorisasi untuk mengubah status pesanan menjadi `CANCELLED`.
   - Ketika status diubah menjadi `CANCELLED`, sistem akan mencatat timestamp dan menampilkan status pembatalan di layar pelacakan pelanggan.

---

### 4. Stock & Menu Availability Rules

1. **Indikator Ketersediaan**:
   - Setiap produk memiliki atribut `is_available` (Boolean).
   - `is_available = true` -> Produk berstatus **In-Stock** dan tombol *"Add to Cart"* aktif.
   - `is_available = false` -> Produk berstatus **Sold Out**, tombol pemesanan dinonaktifkan dengan badge visual jelas.
2. **Perubahan Status Stok Instan**:
   - Staf kasir/barista dapat mengubah nilai `is_available` kapan saja dari Admin Dashboard.
   - Perubahan ketersediaan langsung terpropagasi ke katalog publik tanpa membutuhkan *deployment ulang*.
3. **Penanganan Keranjang saat Stok Habis**:
   - Jika suatu item dimasukkan ke keranjang pelanggan saat stok aktif, namun sebelum submit item tersebut diubah menjadi *Sold Out* oleh kasir, sistem akan melakukan validasi ulang saat *checkout submission* dan menampilkan notifikasi kesalahan yang meminta pengguna menghapus item tersebut.

---

### 5. Pricing & Transaction Integrity

1. **Harga Statis per Transaksi (*Snapshot Pricing*)**:
   - Nilai harga satuan (`unit_price`) disalin secara permanen ke entitas `order_items` saat pesanan dibuat.
   - Jika admin mengubah harga produk di master katalog kemudian hari, data riwayat pesanan masa lalu tidak akan terpengaruh.
2. **Kalkulasi Total**:
   - `total_amount` pesanan adalah hasil penjumlahan `(quantity * unit_price)` seluruh item pada pesanan tersebut.
   - Mata uang resmi adalah Rupiah Indonesia (IDR) tanpa desimal.

---

### 6. Edge Cases & Resilience Rules

1. **Koneksi Terputus pada Dashboard Dapur**:
   - Jika koneksi WebSocket Supabase terputus, UI dashboard dapur wajib menampilkan indikator status koneksi (Offline / Reconnecting) dan melakukan *polling fallback* otomatis untuk mencegah tertinggalnya pesanan baru.
2. **Multi-Order dari Meja yang Sama**:
   - Pelanggan di meja yang sama dapat membuat lebih dari satu pesanan (misalnya memesan kopi pertama, kemudian 30 menit kemudian memesan pastry tambahan).
   - Setiap batch pemesanan tercatat sebagai entitas `order` tersendiri dengan status lifecycle independen, namun terikat pada `table_id` yang sama.
