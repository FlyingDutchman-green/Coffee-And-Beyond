import { Category } from "@/types/menu";

export const CATEGORIES: Category[] = [
  {
    id: "cat-all",
    name: "All Offerings",
    slug: "all",
    description:
      "Jelajahi seluruh pilihan menu specialty coffee, roastery slow bar, pasta, steak, sajian Nusantara, dan hidangan penutup autentik Coffee And Beyond Pekalongan.",
    sortOrder: 0,
  },
  {
    id: "cat-sig",
    name: "Signature & Bottled Coffee",
    slug: "signature-bottled",
    description:
      "Signature bottled lattes & cold concoctions crafted for daily rhythm.",
    sortOrder: 1,
  },
  {
    id: "cat-brew",
    name: "Espresso & Manual Brew",
    slug: "coffee-manual-brew",
    description:
      "Precision espresso extractions & slow bar Siphon Kopi Tahlil using Samasta beans.",
    sortOrder: 2,
  },
  {
    id: "cat-tea",
    name: "Tea, Botanicals & Smoothies",
    slug: "tea-beverages",
    description:
      "Ceremonial matcha, refreshing mojitos, artisan chocolates, and blended smoothies.",
    sortOrder: 3,
  },
  {
    id: "cat-pasta",
    name: "Pasta & Western Kitchen",
    slug: "pasta-western",
    description:
      "Handcrafted pasta fusion from Betutu to creamy truffle lasagna.",
    sortOrder: 4,
  },
  {
    id: "cat-nusantara",
    name: "Nusantara Heritage Plates",
    slug: "nusantara-series",
    description:
      "Indonesian comfort plates: Sundanese Liwet Empal Gepuk, Grilled Dori Colo-Colo, and Ayam Betutu.",
    sortOrder: 5,
  },
  {
    id: "cat-steaks",
    name: "Steaks, Poultry & Fish",
    slug: "steaks-mains",
    description:
      "Premium Wagyu Ribeye 200g, Tenderloin, Beef Stroganoff, and Norwegian Salmon.",
    sortOrder: 6,
  },
  {
    id: "cat-bites",
    name: "All-Day Bites & Bowls",
    slug: "bites-breakfast",
    description:
      "Artisanal breakfast platters, sourdough toasts, hearty grain bowls, and crispy finger food.",
    sortOrder: 7,
  },
  {
    id: "cat-sweets",
    name: "Sweets, Waffles & Pancakes",
    slug: "sweets-desserts",
    description:
      "Freshly made Nutella banana waffles, maple pancakes, and molten lava cakes.",
    sortOrder: 8,
  },
];

export default CATEGORIES;
