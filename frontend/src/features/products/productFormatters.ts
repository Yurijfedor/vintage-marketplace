import type {
  ListingType,
  Product,
  ProductCondition,
} from "../../types/product";

export function formatPrice(price: number): string {
  return `${price.toFixed(2).replace(".", ",")} ₴`;
}

export function getProductPrice(product: Product): number {
  if (product.listingType === "fixed-price") {
    return product.price;
  }

  return product.currentBid ?? product.startingPrice;
}

export function formatCondition(condition: ProductCondition): string {
  const labels: Record<ProductCondition, string> = {
    new: "Новий",
    "very-good": "Дуже добрий",
    good: "Добрий",
    used: "Вживаний",
    damaged: "Пошкоджений",
  };

  return labels[condition];
}

export function formatListingType(listingType: ListingType): string {
  return listingType === "auction" ? "Аукціон" : "Купити зараз";
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
