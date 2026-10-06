import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { OrdersContext, type OrdersContextValue } from "./OrdersContext";
import type { Order } from "../../types/order";
import { useAuth } from "../auth/useAuth";

interface OrdersProviderProps {
  children: ReactNode;
}

function getOrdersStorageKey(userId: string) {
  return `orders:${userId}`;
}

interface OrdersForUserProps {
  userId: string;
  children: ReactNode;
}

function OrdersForUser({ userId, children }: OrdersForUserProps) {
  const storageKey = getOrdersStorageKey(userId);

  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem(storageKey);

    if (!storedOrders) {
      return [];
    }

    try {
      return JSON.parse(storedOrders) as Order[];
    } catch {
      localStorage.removeItem(storageKey);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(orders));
  }, [storageKey, orders]);

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

export function OrdersProvider({ children }: OrdersProviderProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <OrdersForUser key={user.id} userId={user.id}>
      {children}
    </OrdersForUser>
  );
}
