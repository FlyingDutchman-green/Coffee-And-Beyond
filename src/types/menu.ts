export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  categorySlug?: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isSignature?: boolean;
  isBestseller?: boolean;
  origin?: string;
  roastLevel?: string;
  ingredients?: string[];
  dietary?: string[];
  servingTemperature?: "Hot" | "Iced" | "Hot / Iced";
}
