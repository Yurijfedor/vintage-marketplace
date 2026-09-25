import type {
  AuctionProduct,
  FixedPriceProduct,
  Product,
} from "../types/product";

import { getAuthToken } from "../features/auth/authTokenStorage";

const API_BASE_URL = "http://localhost:3000/api";

export type CreateProductInput =
  | Omit<FixedPriceProduct, "id" | "createdAt" | "sellerId" | "sellerName">
  | Omit<AuctionProduct, "id" | "createdAt" | "sellerId" | "sellerName">;

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json() as Promise<Product[]>;
}

export async function getProduct(productId: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json() as Promise<Product>;
}

export async function createProduct(
  product: CreateProductInput,
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json() as Promise<Product>;
}

export async function updateProduct(product: Product): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json() as Promise<Product>;
}

export async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
}
