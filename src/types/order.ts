export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  categoryName?: string;
  categorySlug?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  customerNotes?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TableInfo {
  id: string;
  name: string;
  zone?: string;
  isActive: boolean;
  capacity?: number;
}
