import { Category, Product } from "@/types/menu";
import { CATEGORIES } from "./categories";

export { CATEGORIES };

export const PRODUCTS: Product[] = [
  // ==========================================
  // 1. Signature & Bottled Coffee
  // ==========================================
  {
    id: "sig-01",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Golden Hour Latte",
    slug: "golden-hour-latte",
    description:
      "Signature cold bottled coffee latte dengan tendangan kafein lebih intens dan tekstur creamy lembut.",
    price: 36000,
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    isBestseller: true,
    origin: "Samasta Coffee House Blend",
    roastLevel: "Medium Dark Roast",
    servingTemperature: "Iced",
  },
  {
    id: "sig-02",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Humble Bee",
    slug: "humble-bee",
    description:
      "Signature cold bottled coffee latte dengan sentuhan madu alami yang halus dan manis pas.",
    price: 29000,
    imageUrl:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    origin: "Samasta Coffee Wild Honey Blend",
    roastLevel: "Medium Roast",
    servingTemperature: "Iced",
  },
  {
    id: "sig-03",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Ice Pandan Latte",
    slug: "ice-pandan-latte",
    description:
      "Espresso, homemade pandan syrup, ekstrak pandan wangi, fresh milk, dan espresso jelly kenyal.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    isBestseller: true,
    origin: "Samasta Espresso & Pandan Wangi",
    roastLevel: "Medium Roast",
    servingTemperature: "Iced",
  },
  {
    id: "sig-04",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Kermit The Frog",
    slug: "kermit-the-frog",
    description:
      "Perpaduan ceremonial matcha latte dingin dengan double shot espresso pekat di atasnya.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    origin: "Uji Kyoto Matcha & House Espresso",
    roastLevel: "Medium Light Roast",
    servingTemperature: "Iced",
  },
  {
    id: "sig-05",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Mochado",
    slug: "mochado",
    description:
      "Espresso, buah alpukat segar, frappuccino mocha, fresh milk, vanilla ice cream, dan coffee jelly.",
    price: 50000,
    imageUrl:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isSignature: true,
    origin: "Fresh Avocado & House Dark Mocha",
    roastLevel: "Medium Roast",
    servingTemperature: "Iced",
  },
  {
    id: "sig-06",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Nutella Coffee",
    slug: "nutella-coffee",
    description:
      "Espresso bold berpadu dengan lelehan selai cokelat hazelnut Nutella premium dan susu segar.",
    price: 42000,
    imageUrl:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "House Blend Espresso & Nutella Spread",
    roastLevel: "Medium Dark Roast",
    servingTemperature: "Iced",
  },
  {
    id: "sig-07",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Mocha Caramel Latte",
    slug: "mocha-caramel-latte",
    description:
      "Kombinasi espresso, cokelat pekat, dan saus karamel gurih dengan steamed milk.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Artisan Chocolate & Caramel Drizzle",
    roastLevel: "Medium Roast",
    servingTemperature: "Hot / Iced",
  },
  {
    id: "sig-08",
    categoryId: "cat-sig",
    categorySlug: "signature-bottled",
    categoryName: "Signature & Bottled Coffee",
    name: "Hazelnut Latte",
    slug: "hazelnut-latte",
    description:
      "Espresso susu dengan aroma kacang hazelnut panggang aromatik.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Roasted Hazelnut & Fresh Milk",
    roastLevel: "Medium Roast",
    servingTemperature: "Hot / Iced",
  },

  // ==========================================
  // 2. Espresso & Manual Brew
  // ==========================================
  {
    id: "brew-01",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Kopi Tahlil Siphon Brew",
    slug: "kopi-tahlil-siphon-brew",
    description:
      "Kopi rempah legendaris khas Pekalongan (cengkeh, kapulaga, jahe) yang diekstraksi modern menggunakan Siphon Brewer.",
    price: 34000,
    imageUrl:
      "https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    isBestseller: true,
    origin: "Pekalongan Heritage Spices & Robusta Blend",
    roastLevel: "Medium Roast",
    servingTemperature: "Hot",
  },
  {
    id: "brew-02",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Hot Cappuccino",
    slug: "hot-cappuccino",
    description:
      "Double shot espresso Samasta Roastery dengan silky microfoam susu bertekstur tebal.",
    price: 32000,
    imageUrl:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Samasta Espresso House Blend",
    roastLevel: "Medium Dark Roast",
    servingTemperature: "Hot",
  },
  {
    id: "brew-03",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Ice Latte",
    slug: "ice-latte",
    description:
      "Espresso blend segar dituangkan di atas susu murni dingin dan es batu.",
    price: 36000,
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Samasta Espresso House Blend",
    roastLevel: "Medium Roast",
    servingTemperature: "Iced",
  },
  {
    id: "brew-04",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Ice Americano",
    slug: "ice-americano",
    description:
      "Double shot espresso murni dengan air dingin terfiltrasi, bersih dan menyegarkan.",
    price: 36000,
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Single Origin Java Estate",
    roastLevel: "Medium Light Roast",
    servingTemperature: "Iced",
  },
  {
    id: "brew-05",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Lemon Piccollo Latte",
    slug: "lemon-piccollo-latte",
    description:
      "Single ristretto dengan sedikit steamed milk dan hint lemon zest yang menyegarkan.",
    price: 32000,
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Ristretto Blend & Fresh Lemon Zest",
    roastLevel: "Medium Roast",
    servingTemperature: "Hot",
  },
  {
    id: "brew-06",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Ice Vietnam Drip",
    slug: "ice-vietnam-drip",
    description:
      "Ekstraksi tetes lambat traditional drip filter dengan krimer kental manis legit.",
    price: 34000,
    imageUrl:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Robusta Dampit & Sweet Condensed Milk",
    roastLevel: "Dark Roast",
    servingTemperature: "Iced",
  },
  {
    id: "brew-07",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "V60 Single Origin Nusantara",
    slug: "v60-single-origin-nusantara",
    description:
      "Seduhan manual pour-over menggunakan biji kopi pilihan dari Samasta Coffee Roastery.",
    price: 32000,
    imageUrl:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    origin: "Samasta Micro-Lot Series (Gayo / Flores / Temanggung)",
    roastLevel: "Light Medium Roast",
    servingTemperature: "Hot / Iced",
  },
  {
    id: "brew-08",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Affogato",
    slug: "affogato",
    description:
      "Dua scoop es krim vanila lembut disiram double espresso panas yang intens.",
    price: 30000,
    imageUrl:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "Double Espresso & Madagascar Vanilla",
    roastLevel: "Medium Dark Roast",
    servingTemperature: "Hot / Iced",
  },
  {
    id: "brew-09",
    categoryId: "cat-brew",
    categorySlug: "coffee-manual-brew",
    categoryName: "Espresso & Manual Brew",
    name: "Frappuccino Mocha",
    slug: "frappuccino-mocha",
    description:
      "Blended coffee frappe dengan cokelat pekat, susu segar, dan whipped cream.",
    price: 42000,
    imageUrl:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    origin: "House Mocha Blend & Whipped Cream",
    roastLevel: "Medium Roast",
    servingTemperature: "Iced",
  },

  // ==========================================
  // 3. Tea, Botanicals & Smoothies
  // ==========================================
  {
    id: "tea-01",
    categoryId: "cat-tea",
    categorySlug: "tea-beverages",
    categoryName: "Tea, Botanicals & Smoothies",
    name: "Ice Matcha Latte",
    slug: "ice-matcha-latte",
    description:
      "Bubuk matcha Jepang ceremonial grade dikocok bersama susu segar dingin.",
    price: 35000,
    imageUrl:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    origin: "Uji, Kyoto, Japan",
    dietary: ["Vegetarian"],
    servingTemperature: "Iced",
  },
  {
    id: "tea-02",
    categoryId: "cat-tea",
    categorySlug: "tea-beverages",
    categoryName: "Tea, Botanicals & Smoothies",
    name: "Ice Chocolate",
    slug: "ice-chocolate",
    description:
      "Cokelat artisan pekat dengan susu segar dingin dan rasa manis yang seimbang.",
    price: 38000,
    imageUrl:
      "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    dietary: ["Vegetarian"],
    servingTemperature: "Iced",
  },
  {
    id: "tea-03",
    categoryId: "cat-tea",
    categorySlug: "tea-beverages",
    categoryName: "Tea, Botanicals & Smoothies",
    name: "Biscoff-Phoria",
    slug: "biscoff-phoria",
    description:
      "Blended milkshake dengan selai Lotus Biscoff karamel dan taburan remah biskuit renyah.",
    price: 44000,
    imageUrl:
      "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    dietary: ["Vegetarian"],
    servingTemperature: "Iced",
  },
  {
    id: "tea-04",
    categoryId: "cat-tea",
    categorySlug: "tea-beverages",
    categoryName: "Tea, Botanicals & Smoothies",
    name: "Strawberry Mojito",
    slug: "strawberry-mojito",
    description:
      "Mocktail soda menyegarkan dengan buah stroberi segar, perasan jeruk nipis, dan daun mint.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    dietary: ["Vegan"],
    servingTemperature: "Iced",
  },
  {
    id: "tea-05",
    categoryId: "cat-tea",
    categorySlug: "tea-beverages",
    categoryName: "Tea, Botanicals & Smoothies",
    name: "Lychee Mojito",
    slug: "lychee-mojito",
    description:
      "Soda dingin dengan buah leci utuh, mint, dan sentuhan sirup leci aromatik.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    dietary: ["Vegan"],
    servingTemperature: "Iced",
  },

  // ==========================================
  // 4. Pasta & Western Kitchen
  // ==========================================
  {
    id: "pas-01",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Pasta Bebek Betutu",
    slug: "pasta-bebek-betutu",
    description:
      "Spaghetti al dente dengan suwiran daging bebek empuk bumbu betutu rempah Bali aromatik.",
    price: 43000,
    imageUrl:
      "https://images.unsplash.com/photo-1621996346565-e3d5d628120c?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    isBestseller: true,
    ingredients: [
      "Spaghetti Al Dente",
      "Suwiran Bebek Betutu",
      "Rempah Bali Autentik",
      "Cabai Rawit",
    ],
  },
  {
    id: "pas-02",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Prawn Sambal Matah Pasta",
    slug: "prawn-sambal-matah-pasta",
    description:
      "Spaghetti tumis udang laut segar dengan sambal matah serai kecombrang Bali.",
    price: 43000,
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    ingredients: [
      "Spaghetti",
      "Udang Laut Segar",
      "Sambal Matah Bali",
      "Minyak Kelapa Murni",
    ],
  },
  {
    id: "pas-03",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Pasta Pesto",
    slug: "pasta-pesto",
    description:
      "Pasta dengan saus basil pesto segar, minyak zaitun extra virgin, dan taburan keju parmesan.",
    price: 43000,
    imageUrl:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Spaghetti / Penne",
      "Fresh Basil Pesto",
      "Extra Virgin Olive Oil",
      "Parmesan Cheese",
    ],
    dietary: ["Vegetarian"],
  },
  {
    id: "pas-04",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Aglio Olio Tuna",
    slug: "aglio-olio-tuna",
    description:
      "Spaghetti tumis bawang putih, cabai kering, potongan tuna gurih, dan parsley.",
    price: 43000,
    imageUrl:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Spaghetti",
      "Tuna Flakes",
      "Garlic & Olive Oil",
      "Dried Chili",
    ],
  },
  {
    id: "pas-05",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Aglio Olio Chicken",
    slug: "aglio-olio-chicken",
    description:
      "Spaghetti klasik bawang putih cabai dengan potongan dada ayam panggang juicy.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Spaghetti",
      "Grilled Chicken Breast",
      "Garlic & Olive Oil",
      "Chili Flakes",
    ],
  },
  {
    id: "pas-06",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Carbonara",
    slug: "carbonara",
    description:
      "Spaghetti saus krim telur kaya rasa dengan potongan beef bacon renyah dan parmesan.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Spaghetti",
      "Cream & Egg Yolk Sauce",
      "Crispy Beef Bacon",
      "Parmesan",
    ],
  },
  {
    id: "pas-07",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Bolognese",
    slug: "bolognese",
    description:
      "Spaghetti dengan saus daging sapi cincang tomat kental resep slow-cooked klasik.",
    price: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Spaghetti",
      "Minced Beef Bolognese",
      "San Marzano Tomatoes",
      "Parmesan",
    ],
  },
  {
    id: "pas-08",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Beef Lasagna",
    slug: "beef-lasagna",
    description:
      "Lapisan pasta panggang dengan saus daging sapi bolognese, bechamel gurih, dan keju leleh.",
    price: 53000,
    imageUrl:
      "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Layered Pasta Sheets",
      "Slow Cooked Beef Bolognese",
      "Silky Bechamel",
      "Melted Mozzarella",
    ],
  },
  {
    id: "pas-09",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Mac & Triple Cheese",
    slug: "mac-and-triple-cheese",
    description:
      "Makaroni panggang dengan perpaduan keju cheddar, mozzarella, dan parmesan yang melimpah.",
    price: 62000,
    imageUrl:
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Elbow Macaroni",
      "Cheddar Cheese",
      "Mozzarella",
      "Parmesan Crust",
    ],
    dietary: ["Vegetarian"],
  },
  {
    id: "pas-10",
    categoryId: "cat-pasta",
    categorySlug: "pasta-western",
    categoryName: "Pasta & Western Kitchen",
    name: "Creamy Red Macaroni",
    slug: "creamy-red-macaroni",
    description:
      "Makaroni panggang saus tomat krim spesial dengan potongan sosis dan keju.",
    price: 62000,
    imageUrl:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Macaroni",
      "Creamy Tomato Sauce",
      "Smoked Beef Sausage",
      "Melted Cheese",
    ],
  },

  // ==========================================
  // 5. Nusantara Heritage Plates
  // ==========================================
  {
    id: "nus-01",
    categoryId: "cat-nusantara",
    categorySlug: "nusantara-series",
    categoryName: "Nusantara Heritage Plates",
    name: "Sundanese Liwet Empal Gepuk",
    slug: "sundanese-liwet-empal-gepuk",
    description:
      "Nasi liwet wangi rempah dengan empal sapi gepuk manis empuk, tahu tempe goreng, dan sambal terasi.",
    price: 55000,
    imageUrl:
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    isBestseller: true,
    ingredients: [
      "Nasi Liwet Wangi Rempah",
      "Empal Sapi Gepuk Empuk",
      "Tahu & Tempe Goreng",
      "Sambal Terasi",
    ],
  },
  {
    id: "nus-02",
    categoryId: "cat-nusantara",
    categorySlug: "nusantara-series",
    categoryName: "Nusantara Heritage Plates",
    name: "Balinese Chicken Betutu",
    slug: "balinese-chicken-betutu",
    description:
      "Ayam ungkep bumbu betutu khas Bali lengkap dengan nasi putih hangat, plecing kangkung, dan sambal.",
    price: 50000,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    ingredients: [
      "Ayam Betutu Rempah",
      "Nasi Putih Hangat",
      "Plecing Kangkung",
      "Sambal Matah & Terasi",
    ],
  },
  {
    id: "nus-03",
    categoryId: "cat-nusantara",
    categorySlug: "nusantara-series",
    categoryName: "Nusantara Heritage Plates",
    name: "Colo-Colo Grilled Dori",
    slug: "colo-colo-grilled-dori",
    description:
      "Fillet dori panggang lembut disiram sambal colo-colo tomat hijau segar khas Maluku.",
    price: 50000,
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Fillet Ikan Dori Panggang",
      "Sambal Colo-Colo Tomat Hijau",
      "Nasi Putih Hangat",
      "Lalapan Segar",
    ],
  },
  {
    id: "nus-04",
    categoryId: "cat-nusantara",
    categorySlug: "nusantara-series",
    categoryName: "Nusantara Heritage Plates",
    name: "Maranggi Grilled Chicken",
    slug: "maranggi-grilled-chicken",
    description:
      "Ayam bakar bumbu maranggi manis gurih berempah dengan sambal tomat pedas.",
    price: 50000,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Ayam Bakar Maranggi",
      "Sambal Tomat Segar",
      "Nasi Putih",
      "Lalapan",
    ],
  },
  {
    id: "nus-05",
    categoryId: "cat-nusantara",
    categorySlug: "nusantara-series",
    categoryName: "Nusantara Heritage Plates",
    name: "Dori Sambal Matah",
    slug: "dori-sambal-matah",
    description:
      "Fillet dori krispi keemasan dengan siraman sambal matah segar dan nasi hangat.",
    price: 53000,
    imageUrl:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Crispy Fried Dori Fillet",
      "Sambal Matah Bali",
      "Nasi Putih Hangat",
      "Lalapan",
    ],
  },
  {
    id: "nus-06",
    categoryId: "cat-nusantara",
    categorySlug: "nusantara-series",
    categoryName: "Nusantara Heritage Plates",
    name: "Geprek Sambal Bawang",
    slug: "geprek-sambal-bawang",
    description:
      "Ayam krispi digeprek dengan sambal bawang pedas nampol dan lalapan segar.",
    price: 53000,
    imageUrl:
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Crispy Fried Chicken",
      "Sambal Bawang Pedas",
      "Nasi Putih",
      "Timun & Kemangi",
    ],
  },

  // ==========================================
  // 6. Steaks, Poultry & Fish
  // ==========================================
  {
    id: "stk-01",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Wagyu Rib Eye 200g",
    slug: "wagyu-rib-eye-200g",
    description:
      "Daging sapi Wagyu Rib Eye 200g panggang juicy dengan pilihan saus mushroom/blackpepper dan french fries.",
    price: 145000,
    imageUrl:
      "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    ingredients: [
      "200g Australian Wagyu Rib Eye",
      "House Mushroom Gravy",
      "Crispy French Fries",
      "Roasted Baby Corn & Veggies",
    ],
  },
  {
    id: "stk-02",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Wagyu Tenderloin 200g",
    slug: "wagyu-tenderloin-200g",
    description:
      "Daging sapi Wagyu Tenderloin 200g super empuk dipanggang presisi dengan roasted vegetables.",
    price: 143000,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "200g Wagyu Tenderloin",
      "Blackpepper Demi-Glace",
      "French Fries",
      "Grilled Seasonal Veggies",
    ],
  },
  {
    id: "stk-03",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Beef Stroganoff",
    slug: "beef-stroganoff",
    description:
      "Irisan daging sapi empuk ditumis dengan jamur kancing dalam saus sour cream kental gurih.",
    price: 56000,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Tender Beef Strips",
      "Button Mushrooms",
      "Sour Cream Sauce",
      "Steamed Butter Rice",
    ],
  },
  {
    id: "stk-04",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Salmon Lemon Butter",
    slug: "salmon-lemon-butter",
    description:
      "Fillet salmon Norwegia pan-seared dengan saus creamy lemon butter dan mashed potato.",
    price: 138000,
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isSignature: true,
    ingredients: [
      "Norwegian Salmon Fillet",
      "Creamy Lemon Butter Sauce",
      "Silky Mashed Potato",
      "Sauteed Green Beans",
    ],
  },
  {
    id: "stk-05",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Garang Asem Salmon",
    slug: "garang-asem-salmon",
    description:
      "Fillet salmon kuah garang asem belimbing wuluh segar perpaduan asam pedas gurih.",
    price: 83000,
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Norwegian Salmon",
      "Belimbing Wuluh & Tomat Hijau",
      "Kuah Garang Asem Rempah",
      "Nasi Putih",
    ],
  },
  {
    id: "stk-06",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Dory Salsa",
    slug: "dory-salsa",
    description:
      "Fillet ikan dori pan-seared dengan topping salsa mangga dan tomat segar.",
    price: 56000,
    imageUrl:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Pan-seared Dori Fillet",
      "Fresh Mango & Tomato Salsa",
      "Potato Wedges",
      "Lemon Wedge",
    ],
  },
  {
    id: "stk-07",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Fish & Chips",
    slug: "fish-and-chips",
    description:
      "Fillet dori berbalut tepung krispi keemasan disajikan dengan kentang goreng dan saus tartar.",
    price: 56000,
    imageUrl:
      "https://images.unsplash.com/photo-1526318897995-17583a351be7?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Golden Crispy Dori Fillet",
      "French Fries",
      "House Tartar Sauce",
      "Fresh Lemon",
    ],
  },
  {
    id: "stk-08",
    categoryId: "cat-steaks",
    categorySlug: "steaks-mains",
    categoryName: "Steaks, Poultry & Fish",
    name: "Butter Crumble Dori",
    slug: "butter-crumble-dori",
    description:
      "Dori panggang dengan remah mentega gurih renyah dan tumis sayuran.",
    price: 56000,
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Dori Fillet",
      "Toasted Butter Crumbs",
      "Sauteed Vegetables",
      "Mashed Potato",
    ],
  },

  // ==========================================
  // 7. All-Day Bites & Bowls
  // ==========================================
  {
    id: "bit-01",
    categoryId: "cat-bites",
    categorySlug: "bites-breakfast",
    categoryName: "All-Day Bites & Bowls",
    name: "Beyond Big Breakfast",
    slug: "beyond-big-breakfast",
    description:
      "Sajian sarapan lengkap dengan telur mata sapi/scrambled, sosis sapi, beef bacon, sourdough toast, dan salad segar.",
    price: 52000,
    imageUrl:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Eggs (Any Style)",
      "Beef Sausage & Bacon",
      "Artisan Sourdough",
      "Grilled Tomato & Salad",
    ],
  },
  {
    id: "bit-02",
    categoryId: "cat-bites",
    categorySlug: "bites-breakfast",
    categoryName: "All-Day Bites & Bowls",
    name: "Truffle Fries with Parmesan",
    slug: "truffle-fries-with-parmesan",
    description:
      "Kentang goreng renyah dengan aroma minyak truffle putih mewah dan taburan keju parmesan.",
    price: 38000,
    imageUrl:
      "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    dietary: ["Vegetarian"],
    ingredients: [
      "Straight Cut Potato Fries",
      "White Truffle Oil",
      "Grated Parmesan",
      "Parsley",
    ],
  },
  {
    id: "bit-03",
    categoryId: "cat-bites",
    categorySlug: "bites-breakfast",
    categoryName: "All-Day Bites & Bowls",
    name: "Chicken Quesadilla",
    slug: "chicken-quesadilla",
    description:
      "Tortilla panggang isi suwiran ayam gurih, paprika, dan keju mozzarella leleh disajikan dengan saus salsa.",
    price: 42000,
    imageUrl:
      "https://images.unsplash.com/photo-1618040996337-56904b7850b9?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Flour Tortilla",
      "Seasoned Chicken Breast",
      "Mozzarella & Cheddar",
      "Tomato Salsa",
    ],
  },
  {
    id: "bit-04",
    categoryId: "cat-bites",
    categorySlug: "bites-breakfast",
    categoryName: "All-Day Bites & Bowls",
    name: "Crispy Calamari Rings",
    slug: "crispy-calamari-rings",
    description:
      "Cumi cincin goreng tepung renyah keemasan dengan cocolan saus tartar lemon segar.",
    price: 44000,
    imageUrl:
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Squid Rings",
      "Crispy Seasoned Batter",
      "Tartar Sauce",
      "Lemon",
    ],
  },

  // ==========================================
  // 8. Sweets, Waffles & Pancakes
  // ==========================================
  {
    id: "swt-01",
    categoryId: "cat-sweets",
    categorySlug: "sweets-desserts",
    categoryName: "Sweets, Waffles & Pancakes",
    name: "Nougat Banana Nutella Waffle",
    slug: "nougat-banana-nutella-waffle",
    description:
      "Waffle Belgia renyah dengan irisan pisang, olesan Nutella tebal, dan taburan kacang karamel nougat.",
    price: 48000,
    imageUrl:
      "https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isSignature: true,
    isBestseller: true,
    ingredients: [
      "Belgian Waffle",
      "Nutella Spread",
      "Caramelized Banana",
      "Crunchy Nougat",
    ],
    dietary: ["Vegetarian"],
  },
  {
    id: "swt-02",
    categoryId: "cat-sweets",
    categorySlug: "sweets-desserts",
    categoryName: "Sweets, Waffles & Pancakes",
    name: "Classic Maple Waffle",
    slug: "classic-maple-waffle",
    description:
      "Waffle hangat dengan lelehan butter murni, sirup maple impor, dan satu scoop es krim vanila.",
    price: 42000,
    imageUrl:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Warm Waffle",
      "Pure Butter",
      "Imported Maple Syrup",
      "Vanilla Ice Cream",
    ],
    dietary: ["Vegetarian"],
  },
  {
    id: "swt-03",
    categoryId: "cat-sweets",
    categorySlug: "sweets-desserts",
    categoryName: "Sweets, Waffles & Pancakes",
    name: "Strawberry Pancake",
    slug: "strawberry-pancake",
    description:
      "Tumpukan pancake lembut dengan selai stroberi segar, buah potong, dan whipped cream.",
    price: 38000,
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Fluffy Pancakes",
      "Strawberry Compote",
      "Fresh Strawberry Slices",
      "Whipped Cream",
    ],
    dietary: ["Vegetarian"],
  },
  {
    id: "swt-04",
    categoryId: "cat-sweets",
    categorySlug: "sweets-desserts",
    categoryName: "Sweets, Waffles & Pancakes",
    name: "Blueberry Pancake",
    slug: "blueberry-pancake",
    description:
      "Pancake empuk dengan siraman saus blueberry manis asam dan taburan gula halus.",
    price: 38000,
    imageUrl:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    ingredients: [
      "Fluffy Pancakes",
      "Wild Blueberry Sauce",
      "Powdered Sugar",
      "Butter",
    ],
    dietary: ["Vegetarian"],
  },
  {
    id: "swt-05",
    categoryId: "cat-sweets",
    categorySlug: "sweets-desserts",
    categoryName: "Sweets, Waffles & Pancakes",
    name: "Choco Lava Cake",
    slug: "choco-lava-cake",
    description:
      "Kue cokelat panggang dengan lelehan cokelat hangat di bagian tengah dan es krim vanila dingin.",
    price: 30000,
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    ingredients: [
      "Dark Belgian Chocolate",
      "Molten Lava Center",
      "Vanilla Ice Cream",
    ],
    dietary: ["Vegetarian"],
  },
];

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("Rp", "Rp ");
}
