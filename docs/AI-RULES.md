# AI Design System & Operational Guardrails
## Coffee And Beyond

---

### 1. Anti-AI-Slop Design Principles

Platform ini menerapkan standar desain editorial minimalis, tenang (*calm*), dan berorientasi pada fungsi nyata di lingkungan café fisik. AI dilarang menghasilkan desain dengan klise umum generator visual AI ("AI-Slop").

#### 🚫 STRICTLY FORBIDDEN (DILARANG KERAS):
* **No Generic Purple/Indigo SaaS Gradients**: Jangan gunakan gradien ungu-ke-biru, neon, atau estetika startup web3/crypto.
* **No Excessive Glassmorphism / Neumorphism**: Hindari efek blur kaca tebal, inset shadows kompleks, atau tombol cembung plastik.
* **No Floating Blobs & Mesh Grids**: Dilarang meletakkan background blur mesh warna-warni berputar atau grid kotak-kotak dekoratif tanpa fungsi.
* **No Meaningless 3D Icons**: Hindari aset ilustrasi 3D mengkilap yang tidak menambah konteks.
* **No Extreme Rounded Corners**: Hindari sudut melengkung ekstrem (e.g., `rounded-3xl`, `rounded-[32px]` pada container besar). Gunakan sudut terukur (`rounded-md`, `rounded-lg`).
* **No Over-Animated Elements**: Dilarang memasang animasi parallax berlebihan, scrolling marquee yang mengganggu, atau efek hover melompat yang lambat.
* **No Pulsing Biscuit Pills / Fluff Badges**: Hindari badge pill dengan pulsing dot di atas headline utama kecuali indikator status order nyata.

####  MANDATORY PATTERNS (DIWAJIBKAN):
* **Generous & Measured Whitespace**: Berikan ruang bernapas yang cukup antar seksi dan komponen.
* **Crisp 1px Subtle Borders**: Gunakan pemisah garis border 1px netral (`#E7E7E3`) yang presisi untuk struktur layout.
* **Refined Editorial Typography**: Hirarki teks jelas dengan letter-spacing seimbang dan perataan yang rapi.
* **Restrained & Minimal Shadows**: Gunakan bayangan halus (e.g., `shadow-sm` atau *border-based elevation*) alih-alih bayangan hitam pekat.
* **High Legibility & Contrast**: Seluruh teks harus memenuhi standar kontras WCAG AA untuk keterbacaan sempurna di bawah pencahayaan café maupun sinar matahari.

---

### 2. Design Tokens & Color Palette

Semua komponen UI wajib merujuk secara konsisten pada sistem token warna berikut:

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| `--bg-primary` | `#FFFFFF` | Latar belakang utama halaman, kartu produk, dan modal. |
| `--bg-secondary` | `#F7F7F5` | Latar belakang kontras lembut untuk seksi alternatif, kartu meja, & badge filter. |
| `--border-subtle` | `#E7E7E3` | Border pemisah 1px, garis pembatas tabel, dan divider. |
| `--text-muted` | `#777772` | Deskripsi produk sekunder, metadata waktu, label form, dan caption. |
| `--text-primary` | `#1E1E1C` | Teks judul utama, harga, navigasi, dan body text (Deep Charcoal). |
| `--accent-warm` | `#A69B8C` | Aksen warna kopi hangat yang terkendali (hover button, subtle highlight, active tabs). |

```css
/* CSS Custom Properties Root Mapping (globals.css) */
:root {
  --background: #FFFFFF;
  --foreground: #1E1E1C;
  --secondary: #F7F7F5;
  --border: #E7E7E3;
  --muted-foreground: #777772;
  --accent: #A69B8C;
}
```

#### Tailwind Configuration Snippet (`tailwind.config.ts`):
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
        background: "var(--background, #FFFFFF)",
        foreground: "var(--foreground, #1E1E1C)",
        secondary: {
          DEFAULT: "#F7F7F5",
          foreground: "#1E1E1C",
        },
        border: "#E7E7E3",
        muted: {
          DEFAULT: "#F7F7F5",
          foreground: "#777772",
        },
        accent: {
          DEFAULT: "#A69B8C",
          foreground: "#FFFFFF",
          warm: "#A69B8C",
        },
        charcoal: "#1E1E1C",
        status: {
          new: { bg: "#F7F7F5", border: "#E7E7E3", text: "#1E1E1C" },
          confirmed: { bg: "#FDFBF7", border: "#E2D9C8", text: "#7A5E28" },
          preparing: { bg: "#F4F7FA", border: "#D2DCE5", text: "#2B4C6F" },
          ready: { bg: "#F5F8F3", border: "#D3DEC8", text: "#3B5E2B" },
          completed: { bg: "#FAFAFA", border: "#E7E7E3", text: "#777772" },
          cancelled: { bg: "#FDF6F5", border: "#ECCEC9", text: "#8C3426" },
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### 3. Typography Rules

* **Single Font Family**: **Manrope** (Google Fonts) untuk seluruh elemen tanpa perkecualian (Headings, Subheadings, Body, Buttons, Badges, dan Data Tables).
* **Weight Hierarchy**:
  - `Light (300)` / `Regular (400)`: Body text panjang, deskripsi produk, paragraf narasi.
  - `Medium (500)`: Label input, navigasi, metadata, catatan pesanan.
  - `SemiBold (600)`: Subheading, nama item menu, badge status, tombol utama.
  - `Bold (700)`: Main headline H1, H2, dan angka harga penting.
* **Letter Spacing (Tracking)**:
  - Heading besar: `tracking-tight` (-0.02em s.d. -0.01em).
  - Uppercase labels / badges: `tracking-wider` (+0.05em).

---

### 4. Component Construction Rules

1. **Buttons**:
   - Primary: Background `#1E1E1C`, Text `#FFFFFF`, Hover `#3A3A37`.
   - Secondary / Outline: Background `transparent`, Border 1px `#E7E7E3`, Text `#1E1E1C`, Hover `#F7F7F5`.
   - Ghost: Background `transparent`, Border `none`, Text `#1E1E1C`, Hover `#F7F7F5`.
   - Destructive: Background `#8C3426`, Text `#FFFFFF`, Hover `#732B20`.
   - Disabled / Sold Out: Background `#F7F7F5`, Border 1px `#E7E7E3`, Text `#777772`, kursor `not-allowed`.
2. **Product Cards (Menu Catalog)**:
   - Background: `#FFFFFF`
   - Border: 1px `#E7E7E3`
   - Radius: `rounded-lg` (8px) — *Dilarang keras menggunakan pill/rounded-full*.
   - Padding: 16px
   - Image Aspect Ratio: 4:3 (katalog umum) atau 1:1 (grid ringkas)
   - Interaction: Transisi hover halus (*subtle hover transition*, e.g., border color `#D0D0CA` atau `shadow-sm`, tanpa loncatan posisi ekstrem).
3. **Status Badges**:
   - Padding: 2px 8px
   - Typography: Font size 12px (`text-xs`), Font weight 500 (`font-medium`), Border 1px
   - Border Radius: `rounded-md` (4px–6px)
   - Matrix Warna:
     * `NEW`: Neutral Subtle (`#F7F7F5`) background dengan border `#E7E7E3` dan text `#1E1E1C`.
     * `CONFIRMED`: Soft Amber/Ochre (`#FDFBF7`) background dengan border `#E2D9C8` dan text `#7A5E28`.
     * `PREPARING`: Soft Blue/Slate (`#F4F7FA`) background dengan border `#D2DCE5` dan text `#2B4C6F`.
     * `READY`: Soft Olive/Green (`#F5F8F3`) background dengan border `#D3DEC8` dan text `#3B5E2B`.
     * `COMPLETED`: Muted Gray (`#FAFAFA`) background dengan border `#E7E7E3` dan text `#777772`.
     * `CANCELLED`: Soft Terracotta (`#FDF6F5`) background dengan border `#ECCEC9` dan text `#8C3426`.
4. **Form Inputs, Selects & Textareas**:
   - Border: 1px `#E7E7E3`
   - Background: `#FFFFFF`
   - Focus State: Outline / Border 1px `#1E1E1C` (tegas, minimalis, tanpa glowing blue ring atau shadow berwarna)
   - Text & Placeholder: Body text `#1E1E1C`, placeholder text `#777772`
   - Radius: `rounded-md` (6px)
5. **Order Queue Ticket (Kitchen View)**:
   - Header Meja: Kontras tinggi dengan nomor meja yang langsung terbaca jelas (e.g. bold font size 18px-20px).
   - Timestamp: Monospace / tabular numbers (`font-mono` / `tabular-nums`) untuk elapsed time timer yang stabil tanpa jitter layout.
   - Item List: Daftar pesanan dengan quantity badge yang tegas dan catatan khusus (*notes*) yang ter-highlight jelas.
   - Action Controls: Tombol aksi transisi status tunggal yang jelas per fase (e.g. satu tombol utama dominan per status).

---

### 5. Operational AI & Development Guardrails

1. **Human-In-The-Loop Strictness**:
   - AI hanya boleh mengeksekusi tugas yang tertera pada cakupan fase/task yang sedang aktif.
   - Dilarang merombak (*refactor*) arsitektur global atau file di luar instruksi task pengguna tanpa izin eksplisit.
2. **Incremental Development**:
   - Kerjakan setiap fitur langkah-demi-langkah (Phase 1 -> Phase 2 -> dst).
   - Pastikan setiap langkah tervalidasi sebelum beralih ke langkah berikutnya.
3. **Clean Code & No Overengineering**:
   - Jangan menambahkan library tambahan jika kebutuhan dapat diselesaikan dengan modul standar React/Next.js/Tailwind yang sudah ada.
   - Hindari membuat layer abstraksi yang tidak diperlukan untuk fungsionalitas sederhana.

---

### 6. Accessibility & Contrast

1. **WCAG AA Compliance**:
   - Seluruh pasangan warna teks dan latar belakang wajib memenuhi rasio kontras minimum 4.5:1 untuk normal text dan 3:1 untuk large text serta komponen UI esensial.
2. **Accessible Focus Rings**:
   - Indikator fokus keyboard harus selalu terlihat (*visible focus state*) menggunakan border 1px `#1E1E1C` atau outline kontras tanpa menghilangkan aksesibilitas navigasi keyboard.
3. **Touch Targets**:
   - Seluruh elemen interaktif (tombol, link, toggle, input) memiliki target sentuh minimum 44px × 44px pada layar mobile dan tablet untuk kemudahan operasional fisik.
4. **Semantic HTML & Screen Reader Support**:
   - Gunakan elemen semantik HTML5 (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`, `<button>`).
   - Sertakan `aria-label` deskriptif untuk setiap tombol berbasis ikon.
   - Gunakan `aria-live="polite"` untuk notifikasi perubahan status pesanan secara realtime.

