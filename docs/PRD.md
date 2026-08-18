# Product Requirements Document (PRD)
## Coffee And Beyond

---

### 1. Document Overview
* **Project Name**: Coffee And Beyond
* **Concept**: *"Coffee and everything beyond it"* — Ruang ketiga (the third place) yang memadukan sajian kopi artisanal, ruang produktif untuk bekerja, dan tempat santai untuk berinteraksi.
* **Document Version**: 1.0.0
* **Status**: Approved / In-Progress (Phase 1)
* **Author**: System Architecture Team

---

### 2. Executive Summary
**Coffee And Beyond** adalah platform digital komprehensif yang dirancang untuk menjembatani pengalaman fisik pelanggan di café dengan efisiensi operasional modern. Platform ini menggabungkan landing page publik berestetika editorial minimalis, sistem pemesanan mandiri berbasis QR meja tanpa unduh aplikasi (*frictionless QR table ordering*), serta dashboard operasional dapur/barista berbasis realtime untuk pemrosesan pesanan yang cepat dan akurat.

---

### 3. Product Vision & Value Proposition

#### 3.1 Visi Produk
Menjadi standar baru pengalaman menikmati café modern di mana teknologi tidak menghilangkan sentuhan keramahan barista, melainkan mempercepat proses transaksi dan memastikan setiap cangkir kopi serta makanan tersaji tanpa hambatan antrean.

#### 3.2 Value Proposition
1. **Untuk Pelanggan (Public & Dine-in)**:
   - Akses informasi brand, suasana tempat, dan katalog menu yang terkurasi secara online.
   - Pemesanan langsung dari meja hanya dengan memindai kode QR tanpa perlu registrasi akun atau download aplikasi.
   - Transparansi status pesanan secara *live* langsung di layar ponsel.
2. **Untuk Manajemen & Barista (Kitchen/Operational Staff)**:
   - Eliminasi kesalahan pencatatan pesanan manual dan salah antar nomor meja.
   - Papan antrean pesanan dapur realtime dengan pergantian status yang responsif dan intuitif.
   - Kemudahan kontrol ketersediaan menu (*stock toggle*) dan penyesuaian harga secara langsung.

---

### 4. Target User Personas

| Persona | Profil & Kebutuhan | Pain Point Utama | Nilai yang Ditawarkan |
| :--- | :--- | :--- | :--- |
| **Remote Professional** | Bekerja paruh waktu/penuh di café, membutuhkan tempat tenang dengan Wi-Fi stabil dan pemesanan cepat tanpa meninggalkan laptop. | Terganggu jika harus bolak-balik antre ke kasir saat sedang fokus bekerja. | Pemesanan mandiri via QR meja dan notifikasi status pesanan di ponsel. |
| **Casual Visitor / Socializer** | Datang bersama teman/keluarga untuk santai, mencari suasana estetis dan menu lezat. | Antrean kasir panjang di jam sibuk (*peak hours*), ketidakpastian pesanan sudah dibuat atau belum. | Menu digital interaktif dengan foto & deskripsi lengkap serta status live order. |
| **Coffee Enthusiast** | Sangat memperhatikan profil rasa, beans origin, dan metode seduh kopi. | Menu cetak statis sering tidak mencerminkan ketersediaan biji kopi harian (*out of stock*). | Informasi katalog menu yang selalu ter-update secara *realtime* (In-Stock / Sold Out). |
| **Barista / Kitchen Staff** | Menangani operasional pembuatan minuman & makanan dengan ritme kerja cepat. | Tulisan tiket pesanan manual sulit dibaca, tiket kertas hilang/berantakan, salah nomor meja. | Order queue digital realtime dengan nomor meja jelas dan transisi status satu klik. |
| **Store Manager / Cashier** | Bertanggung jawab atas konfirmasi pembayaran dan kelancaran operasional harian. | Rekap transaksi lambat, sulit memperbarui status ketersediaan item saat jam sibuk. | Dashboard kasir untuk konfirmasi pesanan masuk dan kontrol menu instan. |

---

### 5. Core Objectives & Success Metrics

#### 5.1 Business Objectives
- **Meningkatkan Kecepatan Layanan (*Table Turn Time*)**: Memangkas waktu tunggu dari kedatangan tamu hingga pesanan mulai diracik hingga 40%.
- **Zero Order Discrepancy**: Mengeliminasi 100% kesalahan pencatatan nomor meja dan item pesanan.
- **Meningkatkan Konversi Pengunjung Web**: Memperkenalkan ruang dan menu secara visual sebelum pelanggan datang secara fisik.

#### 5.2 Key Performance Indicators (KPIs)
- **Time to Order (TTO)**: < 90 detik sejak scan QR hingga pesanan terkirim ke sistem dapur.
- **Order Processing Latency**: < 1 detik untuk transmisi pesanan dari meja ke kitchen dashboard (realtime).
- **Guest Adoption Rate**: > 80% pelanggan dine-in menggunakan QR ordering dibandingkan pemesanan manual di kasir.

---

### 6. Scope Overview

#### 6.1 In-Scope (MVP)
* **Public Marketing Website**: Hero, Brand Intro, Curated Offerings, Ambience/Space Experience, Location & Operating Hours, Footer.
* **Live Menu Catalog**: Tampilan kategori, detail produk, harga, dan label stok (In-Stock / Sold Out).
* **QR Table Ordering System**: Routing dinamis per meja (`/order/[tableId]`), keranjang pesanan tamu (*guest cart*), submit order, dan pelacakan status pesanan live.
* **Kitchen & Cashier Realtime Dashboard**: Antrean pesanan masuk (*live feed*), pembaruan status pesanan (*New -> Confirmed -> Preparing -> Ready -> Completed*), kontrol ketersediaan menu, dan manajemen cetak QR meja.

#### 6.2 Out of Scope (Post-MVP / Roadmap Masa Depan)
* Integrasi payment gateway otomatis (QRIS dinamis / VA / E-wallet). *Untuk MVP menggunakan model Order First -> Kasir Konfirmasi.*
* Akun registrasi pelanggan, program loyalty point, diskon voucher.
* Fitur split bill dan reservasi meja online.
* Manajemen multi-outlet dan modul akuntansi laba-rugi mendalam.

---

### 7. High-Level Assumptions & Technical Prerequisites
1. **Konektivitas**: Café menyediakan jaringan Wi-Fi stabil bagi tamu dan perangkat tablet dapur/kasir terhubung ke internet secara konsisten.
2. **Perangkat Tamu**: Pelanggan memiliki smartphone dengan browser modern (Chrome/Safari) dan kamera berkemampuan scan QR tanpa aplikasi pihak ketiga.
3. **Arsitektur Tanpa Login untuk Pelanggan**: Tamu tidak diwajibkan registrasi (mengurangi friksi konversi pemesanan). Identitas pesanan terikat pada ID Meja dan sesi lokal browser.
