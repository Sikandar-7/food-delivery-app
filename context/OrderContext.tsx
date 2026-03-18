"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "./CartContext";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  restaurant: string;
  status: OrderStatus;
  placedAt: Date;
  estimatedDelivery: string;
  address: string;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (items: CartItem[], total: number, address: string, restaurant?: string) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STATUS_SEQUENCE: OrderStatus[] = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const placeOrder = (items: CartItem[], total: number, address: string, restaurant = "McDonald's East London"): Order => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      restaurant,
      status: "pending",
      placedAt: new Date(),
      estimatedDelivery: "25-35 minutes",
      address,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);

    // Simulate real status progression
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= STATUS_SEQUENCE.length) {
        clearInterval(interval);
        return;
      }
      const nextStatus = STATUS_SEQUENCE[step];
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrder.id ? { ...o, status: nextStatus } : o))
      );
      setCurrentOrder((prev) => (prev?.id === newOrder.id ? { ...prev, status: nextStatus } : prev));
    }, 8000); // advance every 8 seconds for demo

    return newOrder;
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, currentOrder, placeOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be within OrderProvider");
  return ctx;
}
