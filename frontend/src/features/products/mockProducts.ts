import type { Product } from "../../types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Alte Porzellanfigur",
    category: "Porzellan",
    price: 29,
    condition: "good",
    imageUrl:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=80",
    sellerName: "VintageShop",
  },
  {
    id: "2",
    title: "Schallplatte – Klassische Musik",
    category: "Schallplatten",
    price: 15,
    condition: "very-good",
    imageUrl:
      "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=800&q=80",
    sellerName: "RetroSound",
  },
  {
    id: "3",
    title: "CD Sammlung – 90er Jahre",
    category: "CDs",
    price: 8,
    condition: "good",
    imageUrl:
      "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=800&q=80",
    sellerName: "SecondLife",
  },
  {
    id: "4",
    title: "Vintage Dekoration",
    category: "Dekoration",
    price: 35,
    condition: "used",
    imageUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    sellerName: "AntikCorner",
  },
];
