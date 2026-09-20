import { createContext } from "react";
import type { CreateProductInput } from "../../api/productsApi";
import type { Product } from "../../types/product";
export interface ProductsContextValue {
  products: Product[];
  addProduct: (product: CreateProductInput) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  removeProduct: (productId: string) => Promise<void>;
}
export const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
);
