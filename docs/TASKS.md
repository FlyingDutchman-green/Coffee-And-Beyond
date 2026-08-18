# Project Roadmap & Implementation Tasks
## Coffee And Beyond

---

### Milestone Overview

| Phase | Nama Fase | Fokus Utama | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Inisialisasi & Dokumentasi Proyek | Single Source of Truth & Spesifikasi Sistem | 🟢 **COMPLETED** |
| **Phase 2** | Design System & UI Foundation | Token Warna, Tipografi Manrope, Base Components | 🟢 **COMPLETED** |
| **Phase 3** | Database & Backend Architecture | Storage Layer, Reactive State & Seed Data | 🟢 **COMPLETED** |
| **Phase 4** | Public Marketing Website | Landing Page, Brand Story, Menu Showcase, Lokasi | 🟢 **COMPLETED** |
| **Phase 5** | QR Table Ordering System | Dynamic Routing Meja, Guest Cart & Live Tracking | 🟢 **COMPLETED** |
| **Phase 6** | Admin & Kitchen Dashboard | Realtime Order Feed, Status Controls, History | 🟢 **COMPLETED** |
| **Phase 7** | Admin Menu & Table Management | Live Stock Toggle, Price Edit, QR Standee Generator | 🟢 **COMPLETED** |
| **Phase 8** | MVP QA, Hardening & Production Ready | Accessibility, Error Boundaries, Edge Cases, Runbook | 🟢 **COMPLETED** |

---

### Detailed Task Breakdown

#### Phase 1: Inisialisasi & Dokumentasi Proyek
- [x] Buat direktori `docs/` sebagai pusat dokumentasi.
- [x] Tulis `docs/PRD.md` (Visi produk, persona target, tujuan, dan metrik sukses).
- [x] Tulis `docs/FEATURES.md` (Spesifikasi fitur MVP & Post-MVP).
- [x] Tulis `docs/BUSINESS-RULES.md` (Aturan alur pesanan, validasi meja, status lifecycle).
- [x] Tulis `docs/ARCHITECTURE.md` (Tech stack, skema database, routing Next.js, realtime).
- [x] Tulis `docs/AI-RULES.md` (Anti-AI-slop design guardrails, token warna, tipografi Manrope).
- [x] Tulis `docs/TASKS.md` (Milestone roadmap komprehensif Phase 1 hingga Phase 8).

---

#### Phase 2: Design System & UI Foundation
- [x] Inisialisasi Next.js (App Router) + TypeScript + Tailwind CSS.
- [x] Konfigurasi font **Manrope** via `next/font/google`.
- [x] Konfigurasi token warna kustom (`--bg-primary`, `--bg-secondary`, `--border-subtle`, `--text-muted`, `--text-primary`, `--accent-warm`) di `tailwind.config.ts` dan `globals.css`.
- [x] Setup komponen dasar (Button, Card, Badge, Dialog/Modal, Drawer/Sheet, Input, Tabs).
- [x] Bangun komponen UI reusable:
  - [x] Header & Navigation Bar (Desktop & Mobile Drawer).
  - [x] Footer dengan informasi jam operasional dan kontak.
  - [x] Price Tag Formatter (IDR formatting utility).
  - [x] Order Status Badge Component.

---

#### Phase 3: Database & Backend Architecture
- [x] Inisialisasi state & data layer terisolasi untuk pesanan, produk menu, dan armada meja.
- [x] Buat skema entitas TypeScript:
  - [x] Interface `Category` & `Product`
  - [x] Interface `TableInfo`
  - [x] Enum `OrderStatus` & Interface `Order`
  - [x] Interface `OrderItem`
- [x] Tulis seed data menu awal (Signature coffee, manual brew, botanical tea, pastry bakery, dan comfort kitchen mains).
- [x] Tulis seed data armada meja café fisik (A01–A06, B01–B04, T01–T02, VIP01, OUT-01, OUT-02, BAR-01).

---

#### Phase 4: Public Marketing Website
- [x] Implementasikan Layout Publik `src/app/layout.tsx`.
- [x] Bangun Section Halaman Utama (`src/app/page.tsx`):
  - [x] **Hero Section**: Tagline *"Coffee and everything beyond it"*, visual editorial, CTA Button.
  - [x] **Brand Intro / Philosophy Section**: Narasi ruang ketiga & dedikasi sajian artisanal.
  - [x] **Curated Offerings Grid**: Sorotan menu signature dengan foto, deskripsi, dan harga.
  - [x] **Space Experience Section**: Fitur ruang kerja, Wi-Fi, kenyamanan meja & pencahayaan.
  - [x] **Location & Hours Section**: Alamat, jam buka harian, embed/link maps interaktif.
- [x] Bangun Halaman Katalog Menu Publik (`src/app/menu/page.tsx`):
  - [x] Filter kategori dinamis (All, Coffee, Botanicals, Pastry, Kitchen).
  - [x] Search bar interaktif pencarian menu.
  - [x] Badge ketersediaan (In-Stock / Sold Out) tersinkronisasi realtime.

---

#### Phase 5: QR Table Ordering System (`/order/[tableId]`)
- [x] Bangun Dynamic Route Handler & Layout `src/app/order/[tableId]/page.tsx`:
  - [x] Validasi keberadaan nomor meja.
  - [x] Tampilkan banner nomor meja aktif yang jelas.
- [x] Implementasikan State Management Keranjang Tamu (*Guest Cart*):
  - [x] State lokal (Local Storage / React Context) per session meja.
  - [x] Menambah/mengurangi kuantitas item.
  - [x] Menambahkan catatan kustom per item (e.g. *"Oat milk, less ice"*).
- [x] Bangun Floating Cart Sheet / Drawer:
  - [x] Ringkasan item pesanan & kalkulasi total harga.
  - [x] Kolom catatan umum pesanan.
  - [x] Tombol submit pesanan dengan konfirmasi alur *"Bayar di Kasir"*.
- [x] Implementasikan penyimpanan pesanan ke centralized store (`orders` & `order_items`).
- [x] Bangun Halaman Pelacakan Live Status Pesanan (`src/app/order/[tableId]/status/[orderId]/page.tsx`):
  - [x] Step indicator visual alur status (`NEW` -> `CONFIRMED` -> `PREPARING` -> `READY` -> `COMPLETED`).
  - [x] Realtime listener untuk perubahan status pesanan tanpa refresh.
  - [x] Ringkasan rincian pesanan yang telah dikirim.

---

#### Phase 6: Admin & Kitchen Realtime Dashboard
- [x] Bangun Layout Dashboard Admin `src/app/admin/layout.tsx` dengan sidebar 240px dan header realtime clock.
- [x] Bangun Live Kitchen Order Feed (`src/app/admin/live-orders/page.tsx`):
  - [x] Grid kartu pesanan masuk secara realtime diurutkan berdasarkan waktu tunggu (*urgency queue*).
  - [x] Filter tab status (All Active, New, Confirmed, In Prep, Ready).
  - [x] Tombol aksi transisi status *single-click*:
    - [x] *"Confirm Payment"* (`NEW` -> `CONFIRMED`)
    - [x] *"Start Preparing"* (`CONFIRMED` -> `PREPARING`)
    - [x] *"Mark Ready"* (`PREPARING` -> `READY`)
    - [x] *"Serve & Complete"* (`READY` -> `COMPLETED`)
    - [x] *"Cancel Order"* (`CANCELLED` dengan dialog konfirmasi)
  - [x] Timer durasi pesanan sejak submit (*elapsed time ticker*).
  - [x] Audio Alert chime via Web Audio API saat pesanan baru masuk.
- [x] Bangun Halaman Riwayat Transaksi (`src/app/admin/history/page.tsx`):
  - [x] Tabel arsip status `COMPLETED` & `CANCELLED`.
  - [x] Ringkasan metrik (Total Selesai, Total Dibatalkan, Akumulasi Omzet).
  - [x] Modal struk digital (*View Receipt*).

---

#### Phase 7: Admin Menu & Table Management
- [x] Bangun Modul Manajemen Menu (`src/app/admin/menu/page.tsx`):
  - [x] Switch toggle 1-klik ketersediaan stok (*In-Stock* / *Sold Out*).
  - [x] Form modal edit cepat harga dan detail produk.
  - [x] Form modal penambahan produk baru ke katalog.
- [x] Bangun Modul Manajemen Meja & QR Standee (`src/app/admin/tables/page.tsx`):
  - [x] Daftar nomor meja café dengan status aktif/nonaktif dan kapasitas.
  - [x] Generator kode QR vektor SVG resolusi tinggi (`QRCodeGenerator`).
  - [x] Modal preview & template cetak standee akrilik meja A6 dengan CSS `@media print`.

---

#### Phase 8: MVP QA, Hardening & Operational Readiness
- [x] Audit responsivitas pada viewport 320px–1440px tanpa horizontal scroll overflow.
- [x] Setup Error Boundaries:
  - [x] `src/app/error.tsx` (Route-level boundary dengan opsi Try Again & Return Home).
  - [x] `src/app/not-found.tsx` (Halaman 404 editorial minimalist).
  - [x] `src/app/global-error.tsx` (Root level fallback).
- [x] Hardening aksesibilitas (WCAG AA):
  - [x] `aria-label` eksplisit pada seluruh tombol berbasis ikon.
  - [x] Keyboard focus management dan Escape key handling pada seluruh modal.
  - [x] `id` dan `htmlFor` semantik pada seluruh form input.
- [x] Proteksi alur transaksi:
  - [x] Pencegahan double submission pesanan via `isSubmitting` state.
  - [x] Pembatasan karakter catatan (maks 200 karakter).
  - [x] Penanganan graceful untuk rute meja non-aktif atau URL tidak valid.
- [x] Tulis `docs/PRODUCTION-RUNBOOK.md` (Panduan operasional kasir, barista, dan manajer café).
- [x] Validasi akhir TypeScript (`npx tsc --noEmit`) dan Build (`npm run build`) dengan exit code 0.
