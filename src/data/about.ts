export interface TimelineEvent {
  year: string;
  tagline: string;
  title: string;
  description: string;
  milestones: string[];
}

export interface SourcingPillar {
  title: string;
  description: string;
  iconName: string;
}

export const ABOUT_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "2015",
    tagline: "The Inception & First Pour",
    title: "Pendirian Coffee And Beyond pada 1 Juli 2015 di Jl. Diponegoro No. 15, Pekalongan",
    description:
      "Coffee And Beyond pertama kali membuka pintunya di jantung Pekalongan Utara sebagai ruang seduh specialty coffee mandiri. Berkomitmen menghadirkan apresiasi cita rasa kopi murni dan ruang berkumpul yang bersahabat bagi penikmat kopi lokal.",
    milestones: [
      "Peresmian gerai perdana di Jl. Diponegoro No. 15, Pekalongan pada 1 Juli 2015.",
      "Instalasi mesin espresso komersial presisi dan bar seduh manual pertama di Pekalongan.",
      "Eksplorasi biji kopi arabika pilihan dari berbagai penjuru Nusantara.",
    ],
  },
  {
    year: "2018",
    tagline: "In-House Roastery Integration",
    title: "Integrasi Rumah Sangrai Samasta Coffee & Pemasangan Mesin Sangrai Giesen 6",
    description:
      "Menjawab kebutuhan kualitas dan profil sangrai konsisten, kami mengintegrasikan unit roastery Samasta Coffee dan memasang mesin sangrai legendaris Giesen 6 buatan Belanda untuk mengolah micro-lot Nusantara secara mandiri.",
    milestones: [
      "Pemasangan mesin sangrai Giesen 6 kg dengan kontrol kurva termodinamika presisi.",
      "Kemitraan langsung dengan kelompok tani kopi di Jawa Tengah, Flores, dan Sumatra.",
      "Peluncuran racikan kopi khas Pekalongan kontemporer: Siphon Kopi Tahlil.",
    ],
  },
  {
    year: "2021",
    tagline: "Culinary & Community Expansion",
    title: "Ekspansi Menu Casual Dining (Nusantara & Western) dan Ruang Pertemuan Komunitas",
    description:
      "Transformasi ruang menjadi destinasi lengkap bagi keluarga, pekerja kreatif, dan komunitas. Kami memperluas dapur dengan sajian Pasta Bebek Betutu, Wagyu Ribeye panggang, dan masakan khas Nusantara hangat.",
    milestones: [
      "Peluncuran lini dapur casual dining Nusantara & Western bercita rasa autentik.",
      "Penambahan area meeting ber-AC dan fasilitas pendukung kerja produktif.",
      "Pengembangan menu bottled signature: Golden Hour Latte, Humble Bee, dan Kermit The Frog.",
    ],
  },
  {
    year: "2024–2026",
    tagline: "A Decade of Dedication",
    title: "Pembaruan Digital Hub, Table Ordering System, dan Peringatan Satu Dekade Dedikasi Kopi",
    description:
      "Menyambut satu dekade perjalanan dedikasi kopi di Pekalongan. Kami menghadirkan integrasi Table-Side QR Ordering tanpa antre, kecepatan koneksi ultra-kencang, serta kurasi kopi langka hasil sangrai Samasta Coffee.",
    milestones: [
      "Peluncuran sistem pemesanan mandiri Table QR terintegrasi langsung ke barista & dapur.",
      "Pembaruan interior ergonomis dengan stopkontak AC & fast-charging di setiap meja.",
      "Perayaan perjalanan 10+ tahun menemani ribuan momen hangat masyarakat Pekalongan.",
    ],
  },
];

export const ABOUT_SOURCING_PILLARS = [
  {
    iconName: "Compass",
    title: "Samasta Coffee In-House Roastery",
    description:
      "Setiap biji kopi disangrai presisi di rumah sangrai Samasta Coffee menggunakan mesin Giesen 6, menjaga karakter aroma floral, rasa manis alami, dan kesegaran maksimal.",
  },
  {
    iconName: "Sparkles",
    title: "Mesin Espresso La Marzocco & Mahlkönig",
    description:
      "Ekstraksi espresso berstandar internasional dieksekusi dengan mesin La Marzocco dan grinder Mahlkönig untuk konsistensi ekstraksi pada setiap cangkir.",
  },
  {
    iconName: "Layers",
    title: "Siphon Bar & Racikan Kopi Tahlil",
    description:
      "Menghormati tradisi kopi rempah Pekalongan melalui racikan Kopi Tahlil modern yang diekstraksi menggunakan tabung kaca vakum Siphon beraroma rempah harum.",
  },
  {
    iconName: "HeartHandshake",
    title: "Casual Dining Nusantara & Western",
    description:
      "Dapur kami menyajikan hidangan berkualitas seperti Pasta Bebek Betutu Bali, Wagyu Ribeye 200g, hingga Nasi Liwet Empal Gepuk dengan bahan-bahan segar pilihan.",
  },
];
