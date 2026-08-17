export type ProductCondition =
  | "new"
  | "very-good"
  | "good"
  | "used"
  | "damaged";

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  condition: ProductCondition;
  imageUrl: string;
  sellerName: string;
}
