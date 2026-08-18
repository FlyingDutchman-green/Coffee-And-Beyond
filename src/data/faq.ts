export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Space & Work" | "Ordering & Payments" | "Coffee & Menu" | "Visits & Policies";
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-wifi",
    category: "Space & Work",
    question: "How fast and stable is the Wi-Fi connection for remote work?",
    answer:
      "We provide enterprise-grade synchronous 300+ Mbps fiber-optic internet distributed via a seamless mesh network across our indoor quiet zone and outdoor patio. It is specifically calibrated for low-latency video conferences, large file transfers, and uninterrupted cloud workflows.",
  },
  {
    id: "faq-power",
    category: "Space & Work",
    question: "Are power outlets available at every seat?",
    answer:
      "Yes. Every single seat—including private focus booths, ergonomic counter seats, and communal solid-oak worktables—features dedicated universal AC power outlets alongside dual USB-C Power Delivery (PD) fast-charging ports discreetly built into the furniture.",
  },
  {
    id: "faq-payment",
    category: "Ordering & Payments",
    question: "How does the table-side ordering and payment system work?",
    answer:
      "Every table has a unique QR code. Simply scan it with your smartphone camera to browse our real-time menu, customize your order, and settle your bill instantly using QRIS, credit/debit cards, or e-wallets. If you prefer traditional service, our baristas at the front counter are always delighted to assist you with card or cash payments.",
  },
  {
    id: "faq-origin",
    category: "Coffee & Menu",
    question: "Di mana biji kopi disangrai dan apa filosofi seduhan Coffee And Beyond?",
    answer:
      "Seluruh biji kopi kami disangrai langsung di rumah sangrai Samasta Coffee Roastery menggunakan mesin Giesen 6 berstandar dunia. Kami mengkurasi micro-lot Nusantara terbaik serta menghadirkan seduhan manual V60, espresso La Marzocco, hingga racikan kopi rempah Siphon Kopi Tahlil khas Pekalongan.",
  },
  {
    id: "faq-reservations",
    category: "Visits & Policies",
    question: "Do I need a reservation, or can I walk in?",
    answer:
      "We operate primarily on a walk-in basis with plenty of individual and communal seating configured for continuous flow. For group gatherings of 6 or more, workshop bookings, or private meeting room reservations, please contact us at least 24 hours in advance via WhatsApp (+62 811-2748-585) or email.",
  },
  {
    id: "faq-pets",
    category: "Visits & Policies",
    question: "Is Coffee And Beyond pet-friendly?",
    answer:
      "Yes! Well-behaved dogs and cats on leashes or in carriers are warmly welcomed in our outdoor garden and covered terrace area. We offer shaded seating, clean water bowls, and organic pet treats upon request.",
  },
  {
    id: "faq-dietary",
    category: "Coffee & Menu",
    question: "Do you offer plant-based milk alternatives and dietary-friendly food?",
    answer:
      "Absolutely. We offer premium Oatly Barista oat milk, house-pressed almond milk, and organic soy milk substitutions. Our kitchen menu also features clearly marked gluten-free, dairy-free, vegetarian, and vegan options.",
  },
  {
    id: "faq-parking",
    category: "Visits & Policies",
    question: "Bagaimana akses parkir dan transportasi di Coffee And Beyond Pekalongan?",
    answer:
      "Kami menyediakan area parkir mobil dan sepeda motor yang luas tepat di halaman depan kafe di Jl. Diponegoro No. 15, Pekalongan Utara. Kafe juga mudah diakses dari pusat Kota Pekalongan, stasiun kereta api, dan jalur utama pantura.",
  },
];
