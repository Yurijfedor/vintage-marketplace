import type { Product, ProductCondition } from "../../types/product";

export function filterProducts(
  products: Product[],
  searchTerm: string,
  category: string | null,
  condition: ProductCondition | null,
): Product[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.title.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch);

    const matchesCategory = category === null || product.category === category;

    const matchesCondition =
      condition === null || product.condition === condition;

    return matchesSearch && matchesCategory && matchesCondition;
  });
}
