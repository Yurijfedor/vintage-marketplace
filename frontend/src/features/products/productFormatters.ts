import type { ListingType, ProductCondition } from "../../types/product";

export function formatPrice(price: number): string {
  return `${price.toFixed(2).replace(".", ",")} €`;
}

export function formatCondition(condition: ProductCondition): string {
  const labels: Record<ProductCondition, string> = {
    new: "Neu",
    "very-good": "Sehr gut",
    good: "Gut",
    used: "Gebraucht",
    damaged: "Beschädigt",
  };

  return labels[condition];
}

export function formatListingType(listingType: ListingType): string {
  return listingType === "auction" ? "Auktion" : "Sofort kaufen";
}
