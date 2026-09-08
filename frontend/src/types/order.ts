export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  imageUrl: string;
  sellerName: string;
  quantity: number;
  price: number;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
}

export type PaymentMethod = "invoice" | "paypal" | "card";

export interface Order {
  id: string;
  createdAt: string;

  status: OrderStatus;

  address: OrderAddress;

  paymentMethod: PaymentMethod;

  items: OrderItem[];

  totalItems: number;
  totalPrice: number;
}
