# System Architecture & Technical Specifications
## Coffee And Beyond

---

### 1. Technology Stack

| Layer | Teknologi | Rationale & Fungsi |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14+ (App Router)** | Full-stack React framework dengan Server Components untuk SEO publik dan Client Components untuk alur pemesanan interaktif. |
| **Language** | **TypeScript** | Type-safety end-to-end dari skema database hingga interaksi UI. |
| **Styling** | **Tailwind CSS** | Styling modular berbasis utility dengan token warna kustom dan nol runtime overhead. |
| **UI Components** | **shadcn/ui** (Radix UI primitives) | Komponen UI aksesibel, unstyled, tanpa bloatware, mudah dikustomisasi sesuai estetika editorial. |
| **Database & Auth** | **Supabase (PostgreSQL)** | Database relasional dengan integritas data ACID dan PostgreSQL Row-Level Security (RLS). |
| **Realtime Engine** | **Supabase Realtime** | WebSocket channel untuk mendistribusikan event pesanan baru dan pembaruan status ke kitchen dashboard secara sub-detik. |
| **Icons** | **Lucide React** | Ikon vektor clean dan konsisten dengan ketebalan garis minimal. |
| **Typography** | **Google Fonts (Manrope)** | Tipografi geometris modern yang dioptimalkan via `next/font`. |

---

### 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                     CLIENT LAYER                                        │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────┤
│   Public Marketing Site       │   Guest QR Ordering System    │  Kitchen/Admin Feed     │
│   (Desktop / Mobile Web)      │   (Mobile Browser / Table QR) │  (Tablet / Cashier Web) │
│   - SSR / ISR for Fast SEO    │   - Client-side Cart & Order  │  - Realtime Subscriptions│
└───────────────┬───────────────┴───────────────┬───────────────┴────────────┬────────────┘
                │                               │                            │
                ▼                               ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APPLICATION LAYER (APP ROUTER)                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ • Server Actions / Route Handlers (Order submission, status transition, menu mutation)  │
│ • Data Validation & Sanitization (Zod schemas)                                          │
│ • Optimistic UI updates for high responsiveness                                         │
└───────────────────────────────────────┬─────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                SUPABASE BACKEND LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ • PostgreSQL Database (Tables, Foreign Keys, Indexes, Constraints)                      │
│ • Realtime Change Data Capture (CDC via PostgreSQL publication)                         │
│ • Row Level Security (RLS) policies for data protection                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Core Database Entities (Schema Specification)

#### 3.1 Entity Relationship Diagram (ERD) Overview

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   categories    │       │     tables      │       │     orders      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ name            │       │ table_number    │◄──────│ table_id (FK)   │
│ slug            │       │ qr_code_url     │       │ status          │
│ sort_order      │       │ is_active       │       │ customer_notes  │
│ is_active       │       └─────────────────┘       │ total_amount    │
└────────┬────────┘                                 │ created_at      │
         │ 1                                        │ updated_at      │
         │                                          └────────┬────────┘
         │ N                                                 │ 1
┌────────┴────────┐                                          │
│    products     │                                          │ N
├─────────────────┤                                 ┌────────┴────────┐
│ id (PK)         │                                 │   order_items   │
│ category_id(FK) │                                 ├─────────────────┤
│ name            │                                 │ id (PK)         │
│ slug            │◄────────────────────────────────│ order_id (FK)   │
│ description     │ 1                              N│ product_id (FK) │
│ price           │                                 │ quantity        │
│ image_url       │                                 │ unit_price      │
│ is_available    │                                 │ notes           │
│ is_featured     │                                 └─────────────────┘
└─────────────────┘
```

#### 3.2 Detailed Field Specifications

```sql
-- 1. Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    price INT NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tables (Café Seating)
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number VARCHAR(20) NOT NULL UNIQUE,
    qr_code_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders
CREATE TYPE order_status AS ENUM ('NEW', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID NOT NULL REFERENCES tables(id) ON DELETE RESTRICT,
    status order_status NOT NULL DEFAULT 'NEW',
    customer_notes TEXT,
    total_amount INT NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price INT NOT NULL CHECK (unit_price >= 0),
    notes TEXT
);
```

---

### 4. Layout & Routing Strategy

Next.js App Router dibagi menjadi 3 zona layout utama:

```
src/app/
├── (public)/                 # Layout Publik: Editorial, Server-rendered, Navbar & Footer
│   ├── page.tsx              # Landing page utama (Hero, Story, Featured, Location)
│   └── menu/                 # Katalog menu publik lengkap
│       └── page.tsx
│
├── (ordering)/               # Layout Tamu Meja: Mobile-first, Floating cart bar, Live tracking
│   └── order/
│       └── [tableId]/        # Alur order dinamis per meja
│           ├── page.tsx      # Katalog pesan meja & cart modal
│           └── status/
│               └── [orderId]/# Live tracking status pesanan
│
└── (admin)/                  # Layout Staf Dapur/Kasir: Fullscreen realtime dashboard
    └── admin/
        ├── page.tsx          # Realtime Live Kitchen Queue
        ├── menu/             # Manajemen stok & harga menu
        └── tables/           # Manajemen meja & generator cetak QR
```

---

### 5. Realtime Architecture (Supabase Realtime)

1. **Kitchen Live Queue Subscription**:
   - Komponen Kitchen Dashboard membuka subscription pada tabel `orders` dan `order_items`:
     ```typescript
     supabase
       .channel('kitchen-orders')
       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, handleNewOrder)
       .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, handleOrderUpdate)
       .subscribe();
     ```
2. **Customer Order Tracking Subscription**:
   - Komponen pelacakan status pelanggan di `/order/[tableId]/status/[orderId]` mendengarkan perubahan status pada `orders` dengan filter `id=eq.[orderId]`.
   - Menghasilkan transisi status instan tanpa perlunya refresh halaman.

---

### 6. Security & Data Integrity (Row Level Security / RLS)

- **Public Read Access**:
  - `categories` & `products`: Boleh dibaca publik (`is_active = true`).
  - `tables`: Boleh dibaca publik untuk validasi nomor meja.
- **Order Insertion**:
  - `orders` & `order_items`: Siapapun (anonymous guest) dapat membuat record baru (`INSERT`).
- **Order Modification**:
  - Hanya staf / sistem yang dapat memperbarui (`UPDATE`) status order dan mengubah harga/stok produk.
