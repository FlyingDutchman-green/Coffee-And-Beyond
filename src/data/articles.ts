export type ArticleCategory =
  | "Coffee Craft"
  | "Space & Lifestyle"
  | "Brewing Guide"
  | "Culinary Story";

export interface ArticleAuthor {
  name: string;
  role: string;
  avatarInitials: string;
}

export interface ArticleSection {
  heading: string;
  body: string[];
  pullQuote?: string;
}

export interface ArticleContent {
  intro: string;
  sections: ArticleSection[];
  conclusion: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  readTime: string;
  author: ArticleAuthor;
  tags: string[];
  featured?: boolean;
  keyTakeaway: string;
  content: ArticleContent;
}

export const ARTICLES_DATA: Article[] = [
  {
    id: "art-siphon-kopi-tahlil",
    slug: "siphon-kopi-tahlil-pekalongan",
    title: "Mengenal Siphon Kopi Tahlil: Menghidupkan Tradisi Rempah Pekalongan Lewat Seduhan Modern",
    subtitle: "Harmoni Cengkeh, Kapulaga, dan Jahe Nusantara dalam Ekstraksi Presisi Tabung Vakum",
    excerpt:
      "Bagaimana racikan kopi rempah legendaris khas Pekalongan (cengkeh, kapulaga, dan jahe) diekstraksi secara presisi menggunakan metode Siphon vakum untuk cita rasa yang bersih dan aromatik.",
    category: "Coffee Craft",
    publishedAt: "15 Agustus 2026",
    readTime: "5 min read",
    author: {
      name: "Barista Team CnB",
      role: "Head of Coffee & Craft",
      avatarInitials: "BT",
    },
    tags: ["Kopi Tahlil", "Siphon Brew", "Rempah Pekalongan", "Manual Brew", "Tradisi Lokal"],
    featured: true,
    keyTakeaway: "Ekstraksi Siphon menjaga kehangatan rempah alami tanpa meninggalkan ampas berlebih di cangkir.",
    content: {
      intro:
        "Di setiap sudut kota Pekalongan, aroma rempah cengkeh dan kapulaga selalu hadir menyertai malam-malam penuh kehangatan dalam tradisi Kopi Tahlil. Di Coffee And Beyond, kami terinspirasi membawa racikan pusaka ini ke panggung seduhan modern menggunakan alat seduh tabung vakum (Siphon) yang higienis dan presisi.",
      sections: [
        {
          heading: "Warisan Rasa dari Tradisi Malam Pekalongan",
          body: [
            "Kopi Tahlil telah lama menjadi bagian tak terpisahkan dari denyut sosial masyarakat Pekalongan. Diracik dengan memadukan biji kopi robusta atau arabika lokal bersama jahe merah, kapulaga Jawa, cengkeh, kayu manis, dan serai, minuman ini secara turun-temurun disajikan untuk mengusir dinginnya angin pesisir dan merekatkan tali silaturahmi.",
            "Namun, pada metode seduh tubruk tradisional, partikel rempah dan ampas kopi kerap tertinggal di dasar cangkir, menghasilkan sensasi rasa yang terkadang terlalu pekat atau menggigit di tenggorokan bagi penikmat kopi modern.",
          ],
          pullQuote:
            "Kopi Tahlil bukan sekadar minuman penghangat; ia adalah denyut kebersamaan, keramahan, dan identitas budaya luhur pesisir Pekalongan.",
        },
        {
          heading: "Mengapa Metode Siphon Adalah Solusi Ekstraksi Ideal?",
          body: [
            "Alat seduh Siphon (vacuum brewer) memanfaatkan ekspansi uap panas dan daya vakum untuk menyeduh pada temperatur stabil 91°C–93°C. Suhu terkontrol ini sangat ideal untuk melarutkan minyak esensial rempah tanpa membakar senyawa aromatiknya.",
            "Melalui saringan kain khusus (cloth filter), seluruh partikel kasar rempah dan ampas kopi tertahan sempurna di tabung atas. Hasil seduhan yang turun ke tabung bawah menyajikan cangkir yang luar biasa jernih (clean cup), dengan lapisan aroma hangat jahe yang lembut, semerbak manis cengkeh, dan body kopi yang seimbang tanpa rasa pahit menyengat.",
          ],
        },
      ],
      conclusion:
        "Melalui Siphon Kopi Tahlil, kami membuktikan bahwa tradisi lokal Pekalongan dapat bersanding harmonis dengan presisi sains specialty coffee. Sebuah cangkir yang menghormati masa lalu sekaligus merayakan masa depan.",
    },
  },
  {
    id: "art-dapur-sangrai-samasta",
    slug: "dapur-sangrai-samasta-coffee",
    title: "Di Balik Dapur Sangrai Samasta: Dari Biji Petani Nusantara Hingga Secangkir Espresso",
    subtitle: "Eksplorasi Profil Sangrai Mesin Giesen 6 untuk Mengunci Karakter Manis Alami Kopi Lokal",
    excerpt:
      "Melihat langsung proses sangrai menggunakan mesin Giesen 6 di Coffee And Beyond untuk mengeluarkan aroma manis alami dari biji kopi micro-lot Indonesia.",
    category: "Coffee Craft",
    publishedAt: "10 Agustus 2026",
    readTime: "4 min read",
    author: {
      name: "Samasta Roastery",
      role: "Master Roaster & Green Buyer",
      avatarInitials: "SR",
    },
    tags: ["Samasta Roastery", "Giesen W6A", "Roasting Profile", "Micro-Lot", "Espresso Craft"],
    featured: false,
    keyTakeaway: "Proses sangrai yang tepat menonjolkan karakter asli terroir tanah tempat kopi bertumbuh.",
    content: {
      intro:
        "Setiap karung biji kopi mentah (green beans) yang tiba di roastery Samasta membawa jejak tanah, ketinggian gunung, dan keringat petani dari berbagai pelosok Nusantara. Peran roaster kami adalah menjadi jembatan rasa—mengeluarkan potensi terbaik yang tersembunyi di dalam tiap butir biji kopi.",
      sections: [
        {
          heading: "Presisi Termal dengan Mesin Giesen 6",
          body: [
            "Di dapur sangrai Samasta yang berlokasi di Coffee And Beyond Pekalongan, kami mempercayakan proses pengolahan pada mesin Giesen W6A. Mesin buatan Belanda dengan drum besi cor ganda ini memungkinkan kendali mikro atas aliran udara (airflow) dan kecepatan putaran drum.",
            "Melalui pemantauan kurva Rate of Rise (RoR) secara digital, kami mengunci fase Maillard dan karamelisasi gula alami pada detik yang tepat sebelum first crack berakhir, mencegah timbulnya rasa pahit gosong (baked/scorched).",
          ],
          pullQuote:
            "Menyangrai kopi adalah perkawinan antara sains termodinamika dan kepekaan indra mencium perubahan senyawa aroma di setiap detik krusial.",
        },
        {
          heading: "Kemitraan Langsung dengan Petani Micro-Lot",
          body: [
            "Kami bermitra langsung dengan kelompok tani di Gayo, Temanggung, Puntang, dan Bajawa yang mempraktikkan pemetikan buah merah 100%. Metode pasca-panen terukur seperti honey dan anaerobic natural memberikan profil rasa buah matang yang kompleks.",
            "Hasil sangrai Samasta menghasilkan espresso blend dengan crema tebal keemasan, rasa manis gula aren alami, dan keasaman sitrus lembut yang menyegarkan.",
          ],
        },
      ],
      conclusion:
        "Dari tangan petani Nusantara hingga mesin sangrai Samasta, secangkir kopi di meja Anda adalah hasil rantai dedikasi dan kejujuran rasa.",
    },
  },
  {
    id: "art-panduan-seduh-v60-pemula",
    slug: "panduan-praktis-seduh-v60-pemula",
    title: "Panduan Praktis Seduh V60 di Rumah untuk Pemula",
    subtitle: "Langkah Sederhana Mengatur Rasio, Suhu Air, dan Teknik Tuang untuk Seduhan Manis Berimbang",
    excerpt:
      "Tips sederhana mengatur rasio air, suhu, dan ukuran gilingan agar seduhan pour-over buatanmu di rumah terasa manis, seimbang, dan tidak terlalu pahit.",
    category: "Brewing Guide",
    publishedAt: "05 Agustus 2026",
    readTime: "6 min read",
    author: {
      name: "Head Barista CnB",
      role: "Brewing Trainer & Bar Lead",
      avatarInitials: "HB",
    },
    tags: ["V60 Guide", "Pour Over", "Home Brewing", "Rasio Seduh", "Barista Tips"],
    featured: false,
    keyTakeaway: "Kunci V60 yang nikmat ada pada kestabilan tuangan air dan kesegaran biji kopi sangrai.",
    content: {
      intro:
        "Menyeduh kopi manual dengan dripper V60 di pagi hari bukan sekadar aktivitas membuat minuman, melainkan sebuah ritual hening yang menenangkan pikiran. Dengan alat sederhana dan pemahaman parameter kunci, Anda dapat menikmati cangkir kopi berkualitas kedai langsung di rumah.",
      sections: [
        {
          heading: "Tiga Fondasi Utama: Rasio, Gilingan, dan Suhu Air",
          body: [
            "Rasio Ideal: Untuk pemula, gunakan rasio 1:15 (15 gram kopi giling untuk 225 gram air panas). Rasio ini memberikan keseimbangan optimal antara kekentalan body dan kejelasan aroma rasa.",
            "Ukuran Gilingan (Grind Size): Gunakan tingkat gilingan medium-fine dengan tekstur menyerupai garam meja. Bila aliran air terlalu cepat (di bawah 2 menit), haluskan sedikit gilingan; jika tersumbat (di atas 3 menit 30 detik), buat gilingan lebih kasar.",
            "Suhu Air: Gunakan air bersuhu 90°C–93°C (sekitar 1 menit setelah mendidih). Hindari air yang baru saja mendidih 100°C karena dapat mengekstraksi rasa pahit getir berlebih.",
          ],
          pullQuote:
            "Kestabilan tangan saat menuang dan kelembutan aliran air menentukan seberapa jernih dan manis seduhan V60 Anda.",
        },
        {
          heading: "Langkah Seduh Tiga Tahap",
          body: [
            "1. Blooming (0:00 - 0:45): Tuang 45 gram air melingkar perlahan untuk membasahi seluruh bubuk kopi. Biarkan gas karbon dioksida keluar agar ekstraksi selanjutnya lebih merata.",
            "2. Tuangan Utama (0:45 - 1:30): Lanjutkan tuangan melingkar stabil hingga timbangan menunjukkan 150 gram. Tahap ini mengekstraksi komponen rasa manis dan keasaman buah yang menyenangkan.",
            "3. Tuangan Akhir (1:30 - 2:30): Tuang air di titik tengah secara perlahan hingga genap 225 gram. Biarkan seluruh air menetes habis hingga dasar ampas kopi tampak rata.",
          ],
        },
      ],
      conclusion:
        "Tuangkan hasil seduhan ke cangkir favorit Anda, hirup aromanya saat hangat, dan nikmati perubahan spektrum rasa yang semakin manis seiring kopi mendingin.",
    },
  },
  {
    id: "art-ritme-kerja-santai-ruang-temu",
    slug: "ritme-kerja-santai-ruang-temu",
    title: "Menikmati Ritme Kerja Tanpa Terburu-Buru di Ruang Temu Senopati & Pekalongan",
    subtitle: "Bagaimana Desain Spasial, Pencahayaan Alami, dan Akustik Menghadirkan Fokus Produktif",
    excerpt:
      "Mengapa pencahayaan alami, bangku kayu ergonomis, dan alunan musik lo-fi lembut mampu meningkatkan fokus dan ketenangan saat bekerja dari kafe (WFC).",
    category: "Space & Lifestyle",
    publishedAt: "28 Juli 2026",
    readTime: "4 min read",
    author: {
      name: "Editorial CnB",
      role: "Community & Experience Lead",
      avatarInitials: "EC",
    },
    tags: ["Work From Cafe", "Ruang Temu", "Fokus Kerja", "Interior Kafe", "Pekalongan Lifestyle"],
    featured: false,
    keyTakeaway: "Suasana yang tenang membantu pikiran mengalir lebih jernih dan produktif.",
    content: {
      intro:
        "Di tengah derasnya arus notifikasi dan rutinitas serba cepat, kita membutuhkan ruang ketiga (third space) yang mampu mengembalikan kejernihan berpikir. Coffee And Beyond hadir sebagai ruang temu yang dirancang khusus untuk mereka yang menghargai ketenangan dalam berkarya.",
      sections: [
        {
          heading: "Arsitektur yang Menghargai Rentang Perhatian",
          body: [
            "Tata ruang di Coffee And Beyond memaksimalkan pencahayaan alami melalui bukaan jendela besar yang menghadap pepohonan hijau, memberikan cahaya lembut tanpa silau yang melelahkan mata.",
            "Setiap meja kayu jati solid dipadukan dengan kursi bersandaran ergonomis serta akses stopkontak yang tertata rapi, memungkinkan sesi kerja laptop berjalan nyaman tanpa rasa pegal.",
          ],
          pullQuote:
            "Ruang kerja yang baik bukanlah yang paling ramai, melainkan yang memberi Anda ketenangan untuk masuk ke dalam flow state tanpa distraksi.",
        },
        {
          heading: "Kenyamanan Akustik dan Kemudahan Pemesanan Mandiri",
          body: [
            "Kami menjaga tingkat kebisingan ruangan di bawah 55 desibel dengan kurasi musik latar berupa alunan lo-fi instrumental dan jazz akustik yang menenangkan.",
            "Sistem pemesanan QR di setiap meja memungkinkan pengunjung memesan kopi dan makanan favorit tanpa perlu mengantre atau memutus alur konsentrasi kerja.",
          ],
        },
      ],
      conclusion:
        "Temukan sudut meja ternyaman Anda, nikmati seduhan hangat Samasta, dan biarkan ide-ide terbaik mengalir dengan ritme yang tenang.",
    },
  },
  {
    id: "art-eksplorasi-pasta-bebek-betutu",
    slug: "eksplorasi-pasta-bebek-betutu",
    title: "Eksplorasi Rasa Pasta Bebek Betutu: Perpaduan Unik Kuliner Barat dan Rempah Nusantara",
    subtitle: "Harmoni Daging Bebek Ungkep Rempah Bali dengan Tekstur Spaghetti Al Dente",
    excerpt:
      "Kisah di balik kreasi pasta favorit pengunjung yang memadukan spaghetti al dente dengan suwiran daging bebek gurih berempah aromatik khas Bali.",
    category: "Culinary Story",
    publishedAt: "20 Juli 2026",
    readTime: "3 min read",
    author: {
      name: "Kitchen Team CnB",
      role: "Culinary Lead & Chef",
      avatarInitials: "KC",
    },
    tags: ["Bebek Betutu", "Fusion Pasta", "Kuliner Nusantara", "Chef Story", "Comfort Food"],
    featured: false,
    keyTakeaway: "Sentuhan rempah tradisional memberikan dimensi rasa yang kaya pada hidangan pasta modern.",
    content: {
      intro:
        "Bagaimana jika kekayaan rempah base genep khas Bali berpadu dengan kelembutan pasta klasik Italia? Di dapur Coffee And Beyond, eksplorasi kuliner lintas budaya ini melahirkan salah satu sajian paling digemari: Pasta Bebek Betutu.",
      sections: [
        {
          heading: "Proses Ungkep Perlahan dengan 15 Rempah Segar",
          body: [
            "Rahasia kelezatan hidangan ini terletak pada racikan bumbu base genep yang terdiri atas kunyit bakar, kencur, lengkuas, serai, daun jeruk, bawang merah, dan kemiri sangrai.",
            "Daging bebek diungkep secara perlahan (slow-cooked) selama lebih dari 4 jam hingga serat daging menjadi sangat empuk, bebas aroma amis, dan bumbu rempah meresap sempurna ke setiap lapisannya.",
          ],
          pullQuote:
            "Kami ingin membuktikan bahwa rempah autentik Nusantara mampu bersanding anggun dengan teknik kuliner dunia tanpa kehilangan jati dirinya.",
        },
        {
          heading: "Sentuhan Akhir Tumisan Minyak Kelapa dan Kemangi Segar",
          body: [
            "Suwiran daging bebek gurih ditumis bersama pasta spaghetti dengan kematangan al dente menggunakan sedikit minyak kelapa murni untuk mengunci keharuman aromatiknya.",
            "Sentuhan akhir berupa taburan daun kemangi segar, bawang goreng renyah, dan perasan jeruk limau memberikan aksen segar yang menyeimbangkan rasa gurih rempah di setiap suapan.",
          ],
        },
      ],
      conclusion:
        "Pasta Bebek Betutu adalah wujud penghormatan kami terhadap kekayaan kuliner Indonesia—teman bersantap yang sempurna untuk menemani perbincangan hangat Anda di Coffee And Beyond.",
    },
  },
];
