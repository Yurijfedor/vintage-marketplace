import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { OrdersContext, type OrdersContextValue } from "./OrdersContext";
import type { Order } from "../../types/order";

const ORDERS_STORAGE_KEY = "orders";

interface OrdersProviderProps {
  children: ReactNode;
}

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!storedOrders) {
      return [];
    }

    return JSON.parse(storedOrders) as Order[];
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  function addOrder(order: Order) {
    setOrders((currentOrders) => [order, ...currentOrders]);
  }

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      addOrder,
    }),
    [orders],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}
