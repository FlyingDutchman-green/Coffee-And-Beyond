export interface PromotionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "all" | "morning" | "workday" | "weekend" | "flights";
  badge: string;
  discountLabel?: string;
  price: number;
  originalPrice?: number;
  timeSlot: string;
  validUntil: string;
  description: string;
  includedItems: string[];
  terms: string[];
  isPopular?: boolean;
}

export const PROMOTIONS_DATA: PromotionItem[] = [
  {
    id: "promo-morning-ritual",
    slug: "morning-ritual-set",
    title: "Morning Ritual Set",
    subtitle: "Golden Hour Latte & Fresh Waffle",
    category: "morning",
    badge: "Daily Opening Exclusive",
    discountLabel: "Save 20%",
    price: 65000,
    originalPrice: 84000,
    timeSlot: "Daily 10:00 – 12:00 WIB",
    validUntil: "Valid until 31 Dec 2026",
    description:
      "Awali hari Anda di Pekalongan dengan sajian istimewa. Nikmati signature cold bottled Golden Hour Latte dipadukan dengan Nougat Banana Nutella Waffle renyah hangat.",
    includedItems: [
      "1x Golden Hour Latte atau Humble Bee (Cold Bottled)",
      "1x Nougat Banana Nutella Waffle Hangat",
      "Koneksi WiFi kecepatan tinggi & stopkontak meja",
    ],
    terms: [
      "Tersedia untuk dine-in dan takeaway antara pukul 10:00 hingga 12:00 WIB.",
      "Dapat ditukar dengan seduhan manual V60 Single Origin Nusantara.",
      "Tidak dapat digabungkan dengan promo voucher lainnya.",
    ],
    isPopular: true,
  },
  {
    id: "promo-workday-pass",
    slug: "workday-focus-pass",
    title: "Workday Focus Pass",
    subtitle: "Pasta Bebek Betutu + Free Refill Kopi Filter",
    category: "workday",
    badge: "Mon–Fri Workday Special",
    discountLabel: "Best Value",
    price: 65000,
    originalPrice: 75000,
    timeSlot: "Monday – Friday, 10:00 – 17:00 WIB",
    validUntil: "Ongoing 2026 Seasonal Pass",
    description:
      "Dirancang untuk para profesional dan remote worker di Pekalongan. Nikmati sajian Pasta Bebek Betutu atau Prawn Sambal Matah Pasta bersama seduhan kopi filter segar.",
    includedItems: [
      "1x Pasta Bebek Betutu atau Prawn Sambal Matah Pasta",
      "1x V60 Single Origin Nusantara Samasta Roastery",
      "Meja kerja nyaman dengan dedicated power outlet & AC",
    ],
    terms: [
      "Berlaku khusus untuk dine-in pada hari kerja (Senin–Jumat).",
      "Maksimal penggunaan meja 4 jam per sesi.",
    ],
    isPopular: true,
  },
  {
    id: "promo-weekend-brunch",
    slug: "weekend-slow-brunch",
    title: "Weekend Slow Brunch Bundle",
    subtitle: "2 Comfort Mains + 2 Signature Beverages",
    category: "weekend",
    badge: "Saturday & Sunday",
    discountLabel: "Save Rp 30k",
    price: 155000,
    originalPrice: 185000,
    timeSlot: "Saturday – Sunday, All Day",
    validUntil: "Valid every weekend throughout 2026",
    description:
      "Momen berkumpul santai akhir pekan bersama teman dan keluarga di Pekalongan. Pilih dua hidangan casual dining favorit dan dua minuman signature.",
    includedItems: [
      "2x Kitchen Mains (Pasta Bebek Betutu, Sundanese Liwet Empal, atau Colo-Colo Dori)",
      "2x Signature Beverages (Golden Hour Latte, Ice Pandan Latte, atau Mochado)",
      "Complimentary snack piring pembuka",
    ],
    terms: [
      "Tersedia sepanjang hari Sabtu dan Minggu (10.00 – 23.00 WIB).",
      "Berlaku untuk pemesanan dine-in di meja.",
    ],
  },
  {
    id: "promo-afternoon-fika",
    slug: "afternoon-fika-pastry",
    title: "Afternoon Fika & Pastry",
    subtitle: "Any Botanical Tea or Latte + Artisanal Viennoiserie",
    category: "morning",
    badge: "Daily 14:00 – 17:00",
    discountLabel: "20% Off Pastry",
    price: 62000,
    originalPrice: 78000,
    timeSlot: "Daily 14:00 – 17:00",
    validUntil: "Valid until 31 Dec 2026",
    description:
      "Embrace the Nordic ritual of pausing midday. Pair any of our ceremonial teas, cascara infusions, or flat whites with our freshly baked Pistachio Pain au Chocolat.",
    includedItems: [
      "1x Tea / Botanical Drink or Espresso Beverage",
      "1x Artisanal Pastry (Pistachio Pain au Chocolat or Cardamom Babka)",
    ],
    terms: [
      "Applicable daily between 14:00 and 17:00.",
      "Subject to fresh pastry inventory for the afternoon bake.",
    ],
  },
  {
    id: "promo-origin-flight",
    slug: "single-origin-tasting-flight",
    title: "Single Origin Tasting Flight",
    subtitle: "3 Micro-Lot Pour Overs Comparative Tasting",
    category: "flights",
    badge: "Reserve Coffee Bar",
    discountLabel: "Curated Set",
    price: 75000,
    originalPrice: 95000,
    timeSlot: "Daily 10:00 – 21:00",
    validUntil: "Seasonal Micro-Lot Series 2026",
    description:
      "A guided sensory journey through three distinct terroirs and fermentation methods: Panama Geisha, Ethiopia Guji Natural, and Gayo Anaerobic Ferment.",
    includedItems: [
      "3x 100ml sensory tasting carafes of micro-lot single origins",
      "Sensory flavor note card & cupping evaluation sheet",
      "Palate cleansing sparkling mineral water",
    ],
    terms: [
      "Prepared exclusively at the Slow Bar counter by our senior baristas.",
      "Limited to 15 tasting flights per day to ensure bean freshness.",
    ],
  },
  {
    id: "promo-table-welcome",
    slug: "first-time-table-qr",
    title: "Table-Side Welcome Privilege",
    subtitle: "15% Off Your Table Order via Contactless QR",
    category: "workday",
    badge: "First-Time QR Guests",
    discountLabel: "15% Off",
    price: 0, // Special discount code percentage
    timeSlot: "Valid on all operating hours",
    validUntil: "Ongoing for table-side diners",
    description:
      "Experience our seamless ordering flow. Scan the QR code on your table, add your favorite drinks and dishes, and enter the promo code during checkout.",
    includedItems: [
      "15% instant reduction on entire food & beverage cart",
      "Instant kitchen dispatch without waiting in queue",
      "Full digital receipt sent via email or WhatsApp",
    ],
    terms: [
      "Use promo code BEYOND15 in the table checkout screen.",
      "Valid for dine-in orders placed through the in-table QR web app.",
      "One redemption per table session.",
    ],
  },
];
