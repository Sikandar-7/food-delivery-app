"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
}

interface CartState {
  items: CartItem[];
  subTotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_DISCOUNT"; payload: number }
  | { type: "SET_DELIVERY_FEE"; payload: number }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  subTotal: 0,
  discount: 3.0, // Example hardcoded discount from design
  deliveryFee: 2.5, // Example hardcoded delivery fee
  total: 0,
};

const calculateTotals = (items: CartItem[], discount: number, deliveryFee: number) => {
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subTotal > 0 ? subTotal - discount + deliveryFee : 0;
  return { subTotal, MathMaxTotal: Math.max(0, total) }; // Ensure total is never negative
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.customization === action.payload.customization
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        newItems = [...state.items, action.payload];
      }
      
      const { subTotal, MathMaxTotal } = calculateTotals(newItems, state.discount, state.deliveryFee);
      return { ...state, items: newItems, subTotal, total: MathMaxTotal };
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const { subTotal, MathMaxTotal } = calculateTotals(newItems, state.discount, state.deliveryFee);
      return { ...state, items: newItems, subTotal, total: MathMaxTotal };
    }
    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      const { subTotal, MathMaxTotal } = calculateTotals(newItems, state.discount, state.deliveryFee);
      return { ...state, items: newItems, subTotal, total: MathMaxTotal };
    }
    case "SET_DISCOUNT": {
      const { subTotal, MathMaxTotal } = calculateTotals(state.items, action.payload, state.deliveryFee);
      return { ...state, discount: action.payload, subTotal, total: MathMaxTotal };
    }
    case "SET_DELIVERY_FEE": {
      const { subTotal, MathMaxTotal } = calculateTotals(state.items, state.discount, action.payload);
      return { ...state, deliveryFee: action.payload, subTotal, total: MathMaxTotal };
    }
    case "CLEAR_CART":
      return { ...initialState };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
