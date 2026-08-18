# Feature Specifications & Requirements
## Coffee And Beyond

---

### 1. Feature Breakdown Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COFFEE AND BEYOND                                │
├───────────────────────────────┬─────────────────────────────────────────────┤
│      MVP (Must Have)          │        Post-MVP (Future Roadmap)            │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 1. Public Marketing Website   │ 1. Payment Gateway (QRIS/E-Wallet otomatis) │
│ 2. Digital Menu Catalog       │ 2. Customer Auth & Loyalty Points           │
│ 3. QR Table Ordering Flow     │ 3. Table Reservation & Split Bill           │
│ 4. Kitchen & Cashier Dashboard│ 4. Multi-Outlet & Deep Financial Analytics  │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

---

### 2. MVP Features (Must-Have)

#### 2.1 Public Website (Marketing & Brand Showcase)
* **Tujuan**: Menghadirkan representasi digital berkelas yang merefleksikan suasana fisik café dan kurasi menu artisanal.
* **Komponen & Bagian**:
  1. **Hero Section**: Tagline visual yang kuat (*"Coffee and everything beyond it"*), citra atmosfer premium, serta Call-to-Action (CTA) cepat untuk melihat menu dan info lokasi.
  2. **Brand Story / Intro**: Narasi filosofi kopi, kualitas bahan, dan komitmen sebagai *third place* bagi komunitas dan pekerja mandiri.
  3. **Featured Offerings**: Showcase item unggulan (Signature Coffee, Artisanal Pastries, Heavy Bites) dengan visual tajam dan tipografi rapi.
  4. **Space & Ambience Experience**: Sorotan fasilitas café (High-speed Wi-Fi, Ergonomic seating, Quiet corner, Natural lighting).
  5. **Location, Map & Operational Hours**: Alamat lengkap, integrasi peta visual/petunjuk arah, jam operasional harian, dan kontak café.
  6. **Footer**: Navigasi ringkas, tautan media sosial, hak cipta, dan jam buka.

#### 2.2 Digital Menu Catalog
* **Tujuan**: Memungkinkan pelanggan menjelajahi seluruh sajian dengan deskripsi transparan, harga jelas, dan informasi ketersediaan real-time.
* **Fitur Utama**:
  1. **Category Navigation**: Filter cepat berdasarkan kategori (e.g., *Espresso Based, Manual Brew, Non-Coffee, Artisanal Pastry, Mains & Bites*).
  2. **Product Cards & Detail View**:
     - Nama item, deskripsi rasa / bahan (*tasting notes*).
     - Harga terformat rapi (Rupiah).
     - Badge status ketersediaan: **In-Stock** (dapat dipesan) atau **Sold Out** (tombol dinonaktifkan).
  3. **Search & Filter**: Pencarian instan berdasarkan nama item.

#### 2.3 QR Table Ordering System (`/order/[tableId]`)
* **Tujuan**: Alur pemesanan langsung dari meja pengunjung tanpa login, tanpa instalasi aplikasi, dan minim langkah.
* **Alur Pengguna**:
  1. **Table Context Validation**: URL menangkap ID Meja dari route dinamis (e.g., `/order/A03`). Sistem memvalidasi apakah meja aktif.
  2. **Guest Order Cart**:
     - Menambah item ke keranjang dengan kuantitas tertentu.
     - Kolom catatan khusus untuk setiap item (e.g., *"Less sugar"*, *"Oat milk"*).
     - Catatan umum untuk keseluruhan pesanan (opsional).
  3. **Order Review & Checkout Summary**:
     - Ringkasan daftar pesanan, subtotal, dan nomor meja terpilih.
     - Penegasan instruksi pembayaran: *"Pesanan akan dikonfirmasi kasir sebelum diproses dapur"*.
  4. **Submit Order**:
     - Pesanan tersimpan ke database dan memicu push event realtime ke dashboard dapur.
  5. **Live Order Status Tracking**:
     - Pengunjung diarahkan ke halaman pelacakan status pesanan secara *live* tanpa perlu refresh halaman:
       - 🟡 `NEW` (Menunggu Konfirmasi)
       - 🔵 `CONFIRMED` (Terkonfirmasi Kasir)
       - 🟠 `PREPARING` (Sedang Dibuat Barista/Dapur)
       - 🟢 `READY` (Siap Disajikan ke Meja)
       - ⚪ `COMPLETED` (Selesai Disajikan)

#### 2.4 Kitchen & Cashier Realtime Operational Dashboard
* **Tujuan**: Pusat kendali staf kasir dan barista dapur untuk memproses pesanan secara terorganisir tanpa tiket kertas manual.
* **Fitur Utama**:
  1. **Realtime Order Live Queue**:
     - Kartu pesanan masuk muncul seketika menggunakan Supabase Realtime subscription.
     - Dilengkapi indikator waktu sejak pesanan dibuat (*elapsed time timer*).
     - Informasi jelas: Nomor Meja, Item Pesanan, Kuantitas, Catatan Modifikasi, dan Total Harga.
  2. **Order Lifecycle Status Controls**:
     - Tombol transisi status satu klik:
       * Kasir: Klik **"Confirm Order"** (`NEW` -> `CONFIRMED`) setelah pembayaran diterima.
       * Kitchen: Klik **"Start Prep"** (`CONFIRMED` -> `PREPARING`).
       * Kitchen: Klik **"Mark Ready"** (`PREPARING` -> `READY`).
       * Server/Staff: Klik **"Complete"** (`READY` -> `COMPLETED`).
     - Tombol **"Cancel Order"** khusus staf untuk membatalkan pesanan yang bermasalah.
  3. **Menu & Stock Management**:
     - Toggle cepat ketersediaan item (*In-Stock* <-> *Sold Out*) yang langsung berlaku seketika di menu customer.
     - Edit harga dasar item.
  4. **Table & QR Management**:
     - Daftar seluruh meja café beserta statusnya (Aktif/Non-aktif).
     - Tombol preview dan cetak kode QR meja berformat rapi untuk ditempel di meja fisik.

---

### 3. Post-MVP Features (Future Roadmap / Out of Scope)

| Fitur | Deskripsi | Target Fase |
| :--- | :--- | :--- |
| **Integrated Payment Gateway** | Pembayaran langsung di browser pelanggan via QRIS dinamis, GoPay, OVO, ShopeePay, atau Virtual Account tanpa intervensi manual kasir. | Phase 2.0 |
| **Customer Auth & Loyalty Program** | Login pelanggan via OTP WhatsApp/Google Auth, akumulasi poin loyalty per transaksi, reward kopi gratis. | Phase 2.0 |
| **Table Reservation & Split Bill** | Fitur pemesanan meja di awal untuk acara/meeting dan pembagian tagihan per pelanggan di meja yang sama. | Phase 2.5 |
| **Multi-Outlet Support** | Manajemen menu terpisah dan analitik terpusat untuk lebih dari satu cabang fisik café. | Phase 3.0 |
| **Advanced Kitchen Display Audio & Print** | Bunyi bel otomatis saat tiket pesanan masuk dan integrasi printer thermal Bluetooth/LAN ESC/POS otomatis. | Phase 2.0 |
| **Inventory & Recipe Management** | Pengurangan otomatis gramasi biji kopi dan bahan baku susu per porsi pesanan. | Phase 3.0 |

---

### 4. Non-Functional Requirements

1. **Responsiveness**:
   - Web Publik: Sempurna di resolusi Mobile (375px+), Tablet (768px+), dan Desktop (1280px+).
   - QR Order Page: Dioptimalkan terutama untuk *Mobile First* (layar ponsel tamu).
   - Kitchen Dashboard: Dioptimalkan untuk Tablet (iPad/Android Tablet horizontal) dan Monitor Kasir.
2. **Performance**:
   - Waktu muat awal halaman publik (*First Contentful Paint*) < 1.2 detik.
   - Perubahan data realtime diterima client dalam < 800ms.
3. **Reliability & Data Integrity**:
   - Sistem transaksi menggunakan PostgreSQL ACID transactions untuk mencegah duplikasi order.
   - Penanganan offline/reconnect otomatis pada koneksi WebSocket Realtime.
