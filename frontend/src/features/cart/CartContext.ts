import { createContext } from "react";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartContextValue {
  cartItems: CartItem[];

  addToCart: (productId: string) => void;

  removeFromCart: (productId: string) => void;

  increaseQuantity: (productId: string) => void;

  decreaseQuantity: (productId: string) => void;

  getQuantity: (productId: string) => number;
}

export const CartContext = createContext<CartContextValue | null>(null);
