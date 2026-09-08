import { createContext } from "react";
import type { Order } from "../../types/order";

export interface OrdersContextValue {
  orders: Order[];

  addOrder: (order: Order) => void;
}

export const OrdersContext = createContext<OrdersContextValue | null>(null);
