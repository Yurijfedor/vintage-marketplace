import API_BASE_URL from "./apiConfig";
import { getAuthToken } from "../features/auth/authTokenStorage";
import type { Order, OrderStatus, PaymentMethod } from "../types/order";

export interface CreateOrderRequest {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  paymentMethod: PaymentMethod;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

interface ServerOrderItem {
  productId: string;
  title: string;
  imageUrl: string;
  sellerName: string;
  quantity: number;
  price: string | number;
}

interface ServerOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  paymentMethod: PaymentMethod;
  totalItems: number;
  totalPrice: string | number;
  items: ServerOrderItem[];
}

function mapServerOrder(order: ServerOrder): Order {
  return {
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    address: {
      firstName: order.firstName,
      lastName: order.lastName,
      street: order.street,
      postalCode: order.postalCode,
      city: order.city,
    },
    paymentMethod: order.paymentMethod,
    items: order.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      imageUrl: item.imageUrl,
      sellerName: item.sellerName,
      quantity: item.quantity,
      price: Number(item.price),
    })),
    totalItems: order.totalItems,
    totalPrice: Number(order.totalPrice),
  };
}

export async function createOrder(order: CreateOrderRequest): Promise<Order> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Будь ласка, увійдіть в акаунт, щоб оформити замовлення.");
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    if (response.status === 401) {
      throw new Error("Сесія завершилася. Увійдіть в акаунт повторно.");
    }

    throw new Error(data?.error ?? "Не вдалося оформити замовлення.");
  }

  const data = (await response.json()) as ServerOrder;
  return mapServerOrder(data);
}
