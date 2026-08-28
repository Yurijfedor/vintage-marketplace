export type ProductCondition =
  | "new"
  | "very-good"
  | "good"
  | "used"
  | "damaged";

export type ListingType = "fixed-price" | "auction";

export interface BaseProduct {
  id: string;
  title: string;
  category: string;
  condition: ProductCondition;
  imageUrl: string;
  sellerName: string;
}

export interface FixedPriceProduct extends BaseProduct {
  listingType: "fixed-price";
  price: number;
}

export interface AuctionProduct extends BaseProduct {
  listingType: "auction";
  startingPrice: number;
  currentBid: number | null;
  bidCount: number;
  auctionEndsAt: string;
}

export type Product = FixedPriceProduct | AuctionProduct;
