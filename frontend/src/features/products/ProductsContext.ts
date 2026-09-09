import { createContext } from "react";
import type { Product } from "../../types/product";
export interface ProductsContextValue {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
}
export const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
);
