import { useEffect, useState, type ReactNode } from "react";
import type { Product } from "../../types/product";
import { mockProducts } from "./mockProducts";
import { ProductsContext } from "./ProductsContext";
const PRODUCTS_STORAGE_KEY = "products";
interface ProductsProviderProps {
  children: ReactNode;
}
export function ProductsProvider({ children }: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!storedProducts) {
      return mockProducts;
    }
    try {
      return JSON.parse(storedProducts) as Product[];
    } catch {
      return mockProducts;
    }
  });
  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);
  const addProduct = (product: Product) => {
    setProducts((currentProducts) => [...currentProducts, product]);
  };
  const updateProduct = (product: Product) => {
    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === product.id ? product : currentProduct,
      ),
    );
  };
  const removeProduct = (productId: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  };
  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, removeProduct }}
    >
      {" "}
      {children}{" "}
    </ProductsContext.Provider>
  );
}
