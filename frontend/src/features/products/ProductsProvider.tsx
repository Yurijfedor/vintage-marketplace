import { useEffect, useState, type ReactNode } from "react";

import type { Product } from "../../types/product";

import {
  createProduct,
  deleteProduct as deleteProductApi,
  getProducts,
  updateProduct as updateProductApi,
  type CreateProductInput,
} from "../../api/productsApi";

import { ProductsContext } from "./ProductsContext";

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const loadedProducts = await getProducts();

        if (isMounted) {
          setProducts(loadedProducts);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const addProduct = async (product: CreateProductInput): Promise<Product> => {
    const createdProduct = await createProduct(product);

    setProducts((currentProducts) => [...currentProducts, createdProduct]);

    return createdProduct;
  };

  const updateProduct = async (product: Product): Promise<Product> => {
    const updatedProduct = await updateProductApi(product);

    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === updatedProduct.id
          ? updatedProduct
          : currentProduct,
      ),
    );

    return updatedProduct;
  };

  const removeProduct = async (productId: string): Promise<void> => {
    await deleteProductApi(productId);

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, removeProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
