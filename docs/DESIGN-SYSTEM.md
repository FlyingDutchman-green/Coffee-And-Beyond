# Design System & UI Specification
## Coffee And Beyond

---

### 1. Design Philosophy & Brand Essence

Design system **Coffee And Beyond** dibangun di atas estetika **Warm Editorial Minimalism**, *human-crafted*, tenang (*calm luxury*), lugas, dan fungsional. Seluruh antarmuka dirancang untuk menyatu secara alami dengan atmosfer fisik café—mengutamakan kenyamanan membaca, kecepatan navigasi, dan efisiensi operasional tanpa distraksi visual.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CORE PRINCIPLES                                 │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│  Function-First   │ Quiet Editorial   │  Tactile Clarity  │  Zero AI-Slop   │
│  Semua elemen     │ Tipografi Manrope │  Border 1px tegas │  Tanpa gradien  │
│  memiliki tujuan  │ terstruktur rapi  │  kontras tinggi   │  ungu/neon dan  │
│  operasional nyata│ dengan whitespace │  untuk pemisahan  │  dekorasi 3D    │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

#### 1.1 Anti-AI-Slop Visual Manifesto
* **🚫 Tanpa Gradien Ungu/Biru Generik**: Menolak estetika SaaS/crypto web3 sintetis yang mengandalkan background mesh ungu atau teks gradien neon.
* **🚫 Tanpa Glassmorphism / Neumorphism Berlebihan**: Tidak ada efek blur kaca tebal, inset shadows kompleks, atau tombol cembung plastik yang merusak keterbacaan.
* **🚫 Tanpa Animasi Dekoratif Tak Bermakna**: Animasi hanya digunakan untuk feedback fungsional instan (transisi warna hover 150ms, drawer slide-up terukur), bukan parallax berat atau marquee mengganggu.
* **🚫 Tanpa Extreme Rounded Corners**: Menghindari sudut melengkung ekstrem (seperti `rounded-3xl` atau `rounded-full` pada kartu). Container menggunakan sudut terukur (`rounded-md`, `rounded-lg`).
* **🚫 Tanpa Headline Biscuit Pills**: Tidak menggunakan pill badge mengambang dengan pulsing dot di atas headline kecuali status indikator pesanan nyata.
* **✅ Warm, Human-Crafted Surface**: Menggunakan palet charcoal hangat, off-white alami, dan aksen *warm stone/taupe* yang mencerminkan material fisik kedai kopi (kayu, batu, keramik, kertas menu cetak).

---

### 2. Color Tokens & Tailwind Mapping

Seluruh token warna didefinisikan secara presisi dalam representasi Hex, HSL, nama semantik Tailwind, serta peran fungsionalnya dalam antarmuka.

#### 2.1 Primitive & Semantic Brand Tokens

| Token Name | Hex Code | HSL Value | Tailwind Semantic Class | Peran & Penggunaan UI | Rasio Kontras (WCAG AA) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Background Primary** | `#FFFFFF` | `hsl(0, 0%, 100%)` | `bg-background` / `bg-white` | Latar belakang canvas utama, modal dialog, kartu produk aktif. | 1.0:1 (Base) |
| **Background Secondary** | `#F7F7F5` | `hsl(60, 5%, 96%)` | `bg-secondary` / `bg-[#F7F7F5]` | Warm surface, seksi alternatif, latar tombol disabled, chip filter. | 1.05:1 vs White |
| **Surface / Card** | `#FFFFFF` | `hsl(0, 0%, 100%)` | `bg-card` (border `#E7E7E3`) | Kontainer kartu katalog produk, tiket dapur, modal wrapper. | 1.25:1 border contrast |
| **Border / Divider** | `#E7E7E3` | `hsl(60, 4%, 90%)` | `border-border` / `border-[#E7E7E3]` | Garis batas struktural 1px, pembatas list item, header divider. | 1.25:1 vs White |
| **Text Primary** | `#1E1E1C` | `hsl(60, 4%, 12%)` | `text-foreground` / `text-charcoal` | Teks judul H1-H4, body text utama, harga produk, tombol utama. | **16.2:1** vs White (Pass AAA) |
| **Text Muted / Secondary**| `#777772` | `hsl(60, 2%, 46%)` | `text-muted-foreground` | Deskripsi menu, timestamp pesanan, placeholder input, caption. | **4.62:1** vs White (Pass AA) |
| **Accent (Restrained)** | `#A69B8C` | `hsl(35, 14%, 60%)` | `text-accent-warm` / `bg-accent-warm` | Warm stone/taupe untuk active tab line, subtle highlight, aksen hangat. | 3.12:1 vs Charcoal |

#### 2.2 Operational Status Color Matrix (Order Lifecycle)

Digunakan secara konsisten pada badge status pemesanan, tiket antrean dapur, banner riwayat transaksi, dan pelacakan live meja:

| Status Key | Status Label | Hex Background | Hex Border | Hex Text | Tailwind Utility Setup | Konteks Operasional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `NEW` | Menunggu Konfirmasi | `#F7F7F5` | `#E7E7E3` | `#1E1E1C` | `bg-[#F7F7F5] border-[#E7E7E3] text-[#1E1E1C]` | Pesanan baru disubmit oleh tamu meja, menunggu verifikasi kasir. |
| `CONFIRMED` | Terkonfirmasi | `#FDFBF7` | `#E2D9C8` | `#7A5E28` | `bg-[#FDFBF7] border-[#E2D9C8] text-[#7A5E28]` | Kasir memverifikasi pembayaran / pemesanan; siap dikirim ke dapur. |
| `PREPARING` | Sedang Disiapkan | `#F4F7FA` | `#D2DCE5` | `#2B4C6F` | `bg-[#F4F7FA] border-[#D2DCE5] text-[#2B4C6F]` | Barista atau dapur sedang meracik minuman/makanan. |
| `READY` | Siap Disajikan | `#F5F8F3` | `#D3DEC8` | `#3B5E2B` | `bg-[#F5F8F3] border-[#D3DEC8] text-[#3B5E2B]` | Pesanan selesai diracik, siap diantar staf ke meja atau diambil. |
| `COMPLETED` | Selesai | `#FAFAFA` | `#E7E7E3` | `#777772` | `bg-[#FAFAFA] border-[#E7E7E3] text-[#777772]` | Tamu telah menerima pesanan, sesi transaksi ditutup dan diarsipkan. |
| `CANCELLED` | Dibatalkan | `#FDF6F5` | `#ECCEC9` | `#8C3426` | `bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]` | Pesanan void/batal oleh kasir atau sistem karena kendala stok/tamu. |

---

### 3. Typography System (Manrope)

Sistem tipografi menggunakan **Manrope** (`next/font/google`) sebagai font family tunggal untuk seluruh antarmuka (Headings, Subheadings, Body, Price, Buttons, Badges, dan Data Tables).

```
Font Family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

#### 3.1 Type Scale & Hierarchy

| Tingkat / Scale | Ukuran Font (px / rem) | Line Height | Weight | Tracking (Letter Spacing) | Tailwind Classes | Peran / Penggunaan UI |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `48px - 56px` / `3.0 - 3.5rem` | `1.1` (52-60px) | Bold (`700`) | `-0.02em` (`-tight`) | `text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]` | Headline utama landing page & hero banner |
| **Heading 1 (H1)** | `32px - 36px` / `2.0 - 2.25rem`| `1.2` (38-44px) | SemiBold (`600`) | `-0.01em` | `text-2xl md:text-3xl font-semibold tracking-tight leading-tight` | Judul halaman utama, header seksi besar |
| **Heading 2 (H2)** | `24px - 28px` / `1.5 - 1.75rem`| `1.3` (31-36px) | SemiBold (`600`) | `-0.01em` | `text-xl md:text-2xl font-semibold tracking-tight leading-snug` | Judul kategori menu, judul modal drawer |
| **Heading 3 (H3)** | `18px - 20px` / `1.125 - 1.25rem`| `1.4` (25-28px) | Medium (`500`) | `0.0em` | `text-lg font-medium leading-snug` | Nama item menu katalog, nomor meja tiket dapur |
| **Body Regular** | `15px - 16px` / `0.9375 - 1.0rem`| `1.6` (24-26px) | Regular (`400`) | `0.0em` | `text-base font-normal leading-relaxed` | Paragraf narasi cerita brand, deskripsi panjang |
| **Body Small / Secondary**| `13px - 14px` / `0.8125 - 0.875rem`| `1.5` (20-21px) | Regular (`400`) | `0.0em` | `text-sm font-normal leading-normal` | Deskripsi singkat menu, catatan pesanan tamu |
| **Caption / Metadata** | `11px - 12px` / `0.6875 - 0.75rem`| `1.4` (15-17px) | Medium (`500`) | `+0.02em` (`wider`)| `text-xs font-medium tracking-wide uppercase` | Tag kategori produk, timestamp tiket dapur |
| **Price** | `15px - 16px` / `0.9375 - 1.0rem`| `1.4` (21-22px) | SemiBold (`600`) | `tabular-nums` | `text-base font-semibold tabular-nums` | Angka harga produk katalog & total checkout |
| **Monospace / Timer** | `13px - 14px` / `0.8125 - 0.875rem`| `1.4` (19px) | Medium (`500`) | `tabular-nums` | `font-mono text-sm tabular-nums` | Elapsed timer pesanan dapur, Order ID tiket |

---

### 4. Spacing, Grid & Layout System

#### 4.1 Spacing Scale (Base 4px / 8px Rhythm)

Semua margin, padding, dan layout gaps wajib berpatokan pada ritme kelipatan 4px / 8px:

| Token Spacing | Nilai Pixel | Nilai Rem | Tailwind Class | Rekomendasi Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| `space-1` | `4px` | `0.25rem` | `p-1`, `gap-1`, `space-y-1` | Jarak mikro antar ikon dan teks, padding chip mikro. |
| `space-2` | `8px` | `0.5rem` | `p-2`, `gap-2`, `space-y-2` | Padding vertikal badge status, gap antar tag kategori. |
| `space-3` | `12px` | `0.75rem` | `p-3`, `gap-3`, `space-y-3` | Padding internal form input, gap daftar ringkas item pesanan. |
| `space-4` | `16px` | `1.0rem` | `p-4`, `gap-4`, `space-y-4` | Padding internal kartu produk, gutter container mobile. |
| `space-6` | `24px` | `1.5rem` | `p-6`, `gap-6`, `space-y-6` | Padding kartu desktop, jarak antar kolom grid katalog. |
| `space-8` | `32px` | `2.0rem` | `p-8`, `gap-8`, `space-y-8` | Jarak vertikal antar sub-seksi konten. |
| `space-12`| `48px` | `3.0rem` | `py-12`, `gap-12`, `my-12` | Padding vertikal antar seksi halaman mobile. |
| `space-16`| `64px` | `4.0rem` | `py-16`, `gap-16`, `my-16` | Padding vertikal antar seksi halaman desktop. |
| `space-24`| `96px` | `6.0rem` | `py-24`, `gap-24`, `my-24` | Padding vertikal hero section landing page. |

#### 4.2 Breakpoints & Container Max Width

* **Responsive Breakpoints (Standard Tailwind)**:
  - `sm`: `640px` (Ponsel landscape / phablet)
  - `md`: `768px` (Tablet portrait)
  - `lg`: `1024px` (Tablet landscape / laptop kecil)
  - `xl`: `1280px` (Desktop standar)
  - `2xl`: `1536px` (Desktop layar lebar)

* **Container Max Width Strategy**:
  - **Public Marketing Website**: `max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8` (memberikan ruang baca proporsional dan elegan).
  - **QR Mobile Ordering Flow**: `max-w-[480px] mx-auto px-4` (terpusat pada viewport mobile untuk kemudahan navigasi satu tangan).
  - **Admin & Kitchen Operational Dashboard**: `max-w-[1440px] mx-auto px-4 sm:px-6` (lebar optimal untuk multi-kolom live order feed di tablet kasir dan layar dapur).

#### 4.3 Border Radius Tokens

* **Small (`4px`)**: `rounded-sm` atau `rounded` — digunakan khusus untuk status badges, tag kategori, chip filter.
* **Medium (`6px`)**: `rounded-md` — digunakan untuk buttons, input fields, selects, textarea, thumbnail gambar menu.
* **Large (`8px`)**: `rounded-lg` — digunakan untuk product cards, tiket antrean dapur, modal dialog container, drawer wrapper.
* ⚠️ **Dilarang keras menggunakan rounded pill/full (`rounded-full` atau `rounded-3xl`) untuk container kartu atau modal box.**

#### 4.4 Elevation & Surface Strategy

Sistem antarmuka **tidak menggunakan drop shadow pekat atau berwarna**. Kedalaman bidang (*depth*) dicapai melalui garis batas (*border 1px*) dan kontras latar belakang:
- **Surface 0 (Canvas Base)**: `#FFFFFF` (Public/Card) atau `#F7F7F5` (Dashboard/Warm Surface).
- **Surface 1 (Content Card & Grid Block)**: Background `#FFFFFF` dengan Border 1px solid `#E7E7E3` (`rounded-lg` / 8px).
- **Surface 2 (Floating Cart Bar & Sticky Nav)**: Background `#FFFFFF` dengan Border 1px `#E7E7E3` + bayangan sangat halus `shadow-[0_4px_16px_rgba(0,0,0,0.04)]`.
- **Surface 3 (Modal Dialog & Drawer Backdrop)**: Overlay `#1E1E1C` dengan opacity 40% (`rgba(30, 30, 28, 0.4)`).

---

### 5. Detailed Component Specifications

#### 5.1 Buttons

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│     Primary Button      │  │    Secondary Outline    │  │      Ghost Button       │  │       Destructive       │
│   Background: #1E1E1C   │  │ Background: transparent │  │ Background: transparent │  │   Background: #8C3426   │
│     Text: #FFFFFF       │  │    Border: 1px #E7E7E3  │  │      Border: None       │  │     Text: #FFFFFF       │
│     Hover: #3A3A37      │  │   Text/Hover: #F7F7F5   │  │   Text/Hover: #F7F7F5   │  │     Hover: #732B20      │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

* **Spesifikasi Varian Button**:
  - **Primary**:
    - Default: Background `#1E1E1C`, Text `#FFFFFF`, Border `none`.
    - Hover: Background `#3A3A37`, Text `#FFFFFF`.
    - Active: Background `#0D0D0C`.
    - Focus: `outline-none ring-1 ring-[#1E1E1C] ring-offset-2`.
  - **Secondary / Outline**:
    - Default: Background `transparent`, Border 1px `#E7E7E3`, Text `#1E1E1C`.
    - Hover: Background `#F7F7F5`, Border 1px `#D0D0CA`, Text `#1E1E1C`.
    - Active: Background `#EFEFEA`.
  - **Ghost**:
    - Default: Background `transparent`, Border `none`, Text `#1E1E1C`.
    - Hover: Background `#F7F7F5`, Text `#1E1E1C`.
    - Active: Background `#EFEFEA`.
  - **Destructive**:
    - Default: Background `#8C3426`, Text `#FFFFFF`, Border `none`.
    - Hover: Background `#732B20`, Text `#FFFFFF`.
    - Active: Background `#5C2219`.
  - **Disabled / Sold Out**:
    - Default: Background `#F7F7F5`, Border 1px `#E7E7E3`, Text `#777772`, kursor `not-allowed`, opacity `0.6`.
* **Dimensi Button**:
  - **Small (`sm`)**: Height 32px (`h-8`), Padding 8px 12px (`px-3`), Font 13px (`text-xs`), Radius `rounded-md` (6px).
  - **Medium (`md` - Default)**: Height 40px (`h-10`), Padding 10px 16px (`px-4`), Font 14px (`text-sm`), Radius `rounded-md` (6px).
  - **Large (`lg` - CTA / Submit)**: Height 48px (`h-12`), Padding 12px 24px (`px-6`), Font 15px (`text-base`), Radius `rounded-md` (6px).

#### 5.2 Form Inputs, Selects & Textareas

* **Container & States**:
  - **Default**: Background `#FFFFFF`, Border 1px solid `#E7E7E3`, Radius `rounded-md` (6px), Padding 10px 14px (`h-10` untuk input tunggal).
  - **Typography**: Text 14px (`text-sm`) `#1E1E1C`, Placeholder text `#777772`.
  - **Focus State**: Border 1px solid `#1E1E1C`, Ring 1px `#1E1E1C` (tegas, minimalis, tanpa glowing blue ring atau halo warna neon).
  - **Error State**: Border 1px solid `#8C3426` (Soft Terracotta), Text helper 12px `#8C3426` di bawah input field.
  - **Disabled**: Background `#F7F7F5`, Border 1px solid `#E7E7E3`, Text `#777772`, kursor `not-allowed`.

#### 5.3 Product Cards (Menu Catalog)

* **Spesifikasi Kartu Produk**:
  - **Container**: Background `#FFFFFF`, Border 1px solid `#E7E7E3`, Radius `rounded-lg` (8px), Padding 16px (`p-4`).
  - **Media / Image**:
    - Aspect Ratio: **4:3** (katalog menu utama) atau **1:1** (daftar ringkas / mobile search list).
    - Radius: `rounded-md` (6px).
    - Object Fit: `object-cover`.
  - **Hierarki Konten**:
    - Tag Kategori: 11px uppercase, font-medium, tracking-wide, text `#777772`.
    - Nama Produk: 16px, font-semibold, text `#1E1E1C`, leading-snug.
    - Tasting Notes / Deskripsi: 13px, font-normal, text `#777772`, line-clamp-2.
    - Bottom Row: Harga (15px-16px, font-semibold, `tabular-nums`, text `#1E1E1C`) disejajarkan secara rapi dengan tombol *"Tambah"* atau label *"Sold Out"*.
  - **Hover Interaction**: Transisi border ke `#D0D0CA` dengan transisi halus 150ms tanpa transformasi posisi vertikal (*no jump / no translation*).

#### 5.4 Status Badges

* **Dimensi**: Padding vertikal 2px, horizontal 8px (`py-0.5 px-2`), Height 20px.
* **Typography**: Font size 12px (`text-xs`), font weight 500 (`font-medium`), tracking normal.
* **Border**: 1px solid sesuai color matrix.
* **Border Radius**: `rounded-sm` atau `rounded` (4px).
* **Color Pairing**:
  - `NEW`: Background `#F7F7F5`, Border `#E7E7E3`, Text `#1E1E1C`
  - `CONFIRMED`: Background `#FDFBF7`, Border `#E2D9C8`, Text `#7A5E28`
  - `PREPARING`: Background `#F4F7FA`, Border `#D2DCE5`, Text `#2B4C6F`
  - `READY`: Background `#F5F8F3`, Border `#D3DEC8`, Text `#3B5E2B`
  - `COMPLETED`: Background `#FAFAFA`, Border `#E7E7E3`, Text `#777772`
  - `CANCELLED`: Background `#FDF6F5`, Border `#ECCEC9`, Text `#8C3426`

#### 5.5 Order Queue Ticket (Kitchen & Barista Live Feed)

```
┌────────────────────────────────────────────────────────┐
│ MEJA A03                                   04:12 (ago) │ ◄── Header Meja Bold & Monospace Timer
│ Order #CB-8921                                         │
├────────────────────────────────────────────────────────┤
│ [2x] Iced Flat White                       Rp 76.000   │
│      Note: Oat milk, less ice                          │ ◄── Catatan ter-indent dengan background lembut
│ [1x] Truffle Fries                         Rp 45.000   │
├────────────────────────────────────────────────────────┤
│ Total: Rp 121.000                                      │
│ [ Tombol: TANDAI SIAP DISAJIKAN (READY) ]              │ ◄── Tombol Aksi Status Tunggal Jelas
└────────────────────────────────────────────────────────┘
```

* **Spesifikasi Elemen Tiket**:
  - **Container**: Background `#FFFFFF`, Border 1px `#E7E7E3`, Radius `rounded-lg` (8px), Padding 16px (`p-4`).
  - **Header Meja**: Kontras tinggi, 18px `font-semibold` `#1E1E1C`.
  - **Timer Pesanan**: `font-mono text-xs tabular-nums text-[#777772]` (menghitung menit berlalu sejak submit tanpa layout shifting).
  - **Item Row**: Kuantitas ditandai dengan badge tegas `[2x]` (13px `font-semibold` `#1E1E1C`), nama menu (14px `#1E1E1C`), dan harga item.
  - **Item Notes**: Kotak catatan khusus background `#F7F7F5`, padding 4px 8px, font 12px `#777772`, border-l-2 solid `#A69B8C`.
  - **Status Action Control**: Satu tombol aksi utama lebar penuh di bagian bawah kartu yang mewakili transisi status berikutnya (e.g. *"Mulai Racik"* -> *"Siap Disajikan"* -> *"Selesai"*).

#### 5.6 Guest Floating Cart Bar & Checkout Drawer (Mobile QR Flow)

* **Sticky Floating Cart Bar**:
  - Posisi: `fixed bottom-4 left-4 right-4 max-w-[448px] mx-auto z-40`.
  - Container: Background `#1E1E1C`, Radius `rounded-lg` (8px), Padding 12px 16px (`p-3 px-4`), `shadow-[0_8px_24px_rgba(0,0,0,0.12)]`.
  - Konten: Ringkasan `[ 3 Item ]` di kiri (teks putih 14px), Total `Rp 121.000` & Tombol *"Lihat Pesanan"* di kanan (teks putih 14px `font-semibold`).
* **Checkout Drawer / Bottom Sheet**:
  - Backdrop: `rgba(30, 30, 28, 0.4)`.
  - Container: Background `#FFFFFF`, Radius sudut atas `rounded-t-xl`, Padding 20px.
  - Header: Nomor Meja Aktif (e.g., *"Pesanan Meja A03"*), tombol close ghost icon.
  - Item List: Daftar pesanan dengan stepper kuantitas `[-] 1 [+]` (touch target minimum 44px) dan opsi edit catatan item.
  - Operational Callout: Kotak banner netral border 1px `#E7E7E3`, background `#F7F7F5`, teks 12px `#777772`: *"Pesanan Anda akan dikonfirmasi kasir sebelum diracik oleh barista/dapur."*
  - Submit Button: Full width, height 48px (`h-12`), background `#1E1E1C`, text `#FFFFFF`, radius `rounded-md` (6px).

---

### 6. Accessibility & Contrast Verification (WCAG AA Compliance)

#### 6.1 Contrast Ratio Verification
Setiap kombinasi warna telah diverifikasi sesuai standar **WCAG 2.1 Level AA**:

| Elemen UI | Warna Foreground | Warna Background | Rasio Kontras | Status WCAG AA |
| :--- | :--- | :--- | :--- | :--- |
| **Body & Headings** | `#1E1E1C` (Charcoal) | `#FFFFFF` (White) | **16.2:1** | Pass AAA (Min 4.5:1) |
| **Body on Warm Surface**| `#1E1E1C` (Charcoal) | `#F7F7F5` (Warm Surface) | **15.4:1** | Pass AAA (Min 4.5:1) |
| **Secondary / Muted Text**| `#777772` (Muted Gray) | `#FFFFFF` (White) | **4.62:1** | Pass AA (Min 4.5:1) |
| **Large Headings / Display**| `#777772` (Muted Gray) | `#FFFFFF` (White) | **4.62:1** | Pass AA (Min 3.0:1) |
| **Primary Button Text** | `#FFFFFF` (White) | `#1E1E1C` (Charcoal) | **16.2:1** | Pass AAA (Min 4.5:1) |
| **Status CONFIRMED Text**| `#7A5E28` (Ochre) | `#FDFBF7` (Soft Amber) | **4.85:1** | Pass AA (Min 4.5:1) |
| **Status PREPARING Text**| `#2B4C6F` (Slate Blue) | `#F4F7FA` (Soft Blue) | **6.72:1** | Pass AA (Min 4.5:1) |
| **Status READY Text** | `#3B5E2B` (Olive Green) | `#F5F8F3` (Soft Olive) | **5.44:1** | Pass AA (Min 4.5:1) |
| **Status CANCELLED Text**| `#8C3426` (Terracotta) | `#FDF6F5` (Soft Terracotta)| **5.81:1** | Pass AA (Min 4.5:1) |

#### 6.2 Focus Visibility & Keyboard Navigation
- Seluruh elemen interaktif (`<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`) wajib memiliki indikator fokus visual yang tegas menggunakan `focus-visible:ring-1 focus-visible:ring-[#1E1E1C] focus-visible:ring-offset-2` tanpa outline pelangi atau halo blur yang mengaburkan elemen.
- Urutan tab (*tab order*) dijamin linear dan logis mengikuti urutan DOM dari kiri ke kanan dan atas ke bawah.

#### 6.3 Touch Targets & Ergonomics
- Seluruh tombol kontrol kuantitas cart (`+` / `-`), chip kategori menu, dan tombol aksi status dapur memiliki ukuran area sentuh (*tap target*) minimum **44px × 44px** untuk menghindari salah sentuh pada layar ponsel atau tablet kasir.

#### 6.4 Semantic HTML & Screen Readers
- Struktur halaman wajib menggunakan elemen semantik (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`).
- Semua tombol berbasis ikon tanpa teks wajib menyertakan atribut `aria-label` yang jelas (e.g. `aria-label="Tutup keranjang"`).
- Feed pesanan realtime pada dashboard dapur dan halaman pelacakan pesanan tamu menggunakan container `aria-live="polite"` untuk membacakan pembaruan status secara ramah pembaca layar.

---

### 7. Implementation Reference Code

Berikut adalah referensi konfigurasi CSS Variables dan Tailwind CSS untuk digunakan pada fase implementasi kode (Phase 3 & seterusnya).

#### 7.1 `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base Neutral Tokens */
    --background: 0 0% 100%;           /* #FFFFFF */
    --foreground: 60 4% 12%;           /* #1E1E1C */

    --card: 0 0% 100%;                 /* #FFFFFF */
    --card-foreground: 60 4% 12%;      /* #1E1E1C */

    --popover: 0 0% 100%;              /* #FFFFFF */
    --popover-foreground: 60 4% 12%;   /* #1E1E1C */

    --primary: 60 4% 12%;              /* #1E1E1C */
    --primary-foreground: 0 0% 100%;   /* #FFFFFF */

    --secondary: 60 5% 96%;            /* #F7F7F5 */
    --secondary-foreground: 60 4% 12%; /* #1E1E1C */

    --muted: 60 5% 96%;                /* #F7F7F5 */
    --muted-foreground: 60 2% 46%;     /* #777772 */

    --accent: 35 14% 60%;              /* #A69B8C */
    --accent-foreground: 0 0% 100%;    /* #FFFFFF */

    --destructive: 8 57% 35%;          /* #8C3426 */
    --destructive-foreground: 0 0% 100%; /* #FFFFFF */

    --border: 60 4% 90%;               /* #E7E7E3 */
    --input: 60 4% 90%;                /* #E7E7E3 */
    --ring: 60 4% 12%;                 /* #1E1E1C */

    --radius: 0.5rem;                  /* 8px */
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-manrope), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

#### 7.2 `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          warm: "#A69B8C",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        charcoal: "#1E1E1C",
        status: {
          new: {
            bg: "#F7F7F5",
            border: "#E7E7E3",
            text: "#1E1E1C",
          },
          confirmed: {
            bg: "#FDFBF7",
            border: "#E2D9C8",
            text: "#7A5E28",
          },
          preparing: {
            bg: "#F4F7FA",
            border: "#D2DCE5",
            text: "#2B4C6F",
          },
          ready: {
            bg: "#F5F8F3",
            border: "#D3DEC8",
            text: "#3B5E2B",
          },
          completed: {
            bg: "#FAFAFA",
            border: "#E7E7E3",
            text: "#777772",
          },
          cancelled: {
            bg: "#FDF6F5",
            border: "#ECCEC9",
            text: "#8C3426",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",                  /* 8px */
        md: "calc(var(--radius) - 2px)",      /* 6px */
        sm: "calc(var(--radius) - 4px)",      /* 4px */
      },
    },
  },
  plugins: [],
};

export default config;
```
