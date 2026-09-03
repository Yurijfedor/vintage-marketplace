import type { Product } from "../../types/product";
import { getProductPrice } from "./productFormatters";

export type ProductSortOption = "newest" | "price-asc" | "price-desc";

export function sortProducts(
  products: Product[],
  sortOption: ProductSortOption,
): Product[] {
  return [...products].sort((firstProduct, secondProduct) => {
    if (sortOption === "newest") {
      return (
        new Date(secondProduct.createdAt).getTime() -
        new Date(firstProduct.createdAt).getTime()
      );
    }

    const firstPrice = getProductPrice(firstProduct);
    const secondPrice = getProductPrice(secondProduct);

    if (sortOption === "price-asc") {
      return firstPrice - secondPrice;
    }

    return secondPrice - firstPrice;
  });
}
