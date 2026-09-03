import type { Product } from "../../types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Alte Porzellanfigur",
    category: "Porzellan",
    condition: "good",
    listingType: "fixed-price",
    price: 29,
    imageUrl:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=80",
    sellerName: "VintageShop",
    createdAt: "2026-08-20T10:30:00",
  },
  {
    id: "2",
    title: "Schallplatte – Klassische Musik",
    category: "Schallplatten",
    condition: "very-good",
    listingType: "auction",
    startingPrice: 10,
    currentBid: 15,
    bidCount: 4,
    auctionEndsAt: "2026-08-29T20:00:00",
    imageUrl:
      "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=800&q=80",
    sellerName: "RetroSound",
    createdAt: "2026-08-28T14:15:00",
  },
  {
    id: "3",
    title: "CD Sammlung – 90er Jahre",
    category: "CDs",
    condition: "good",
    listingType: "fixed-price",
    price: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=800&q=80",
    sellerName: "SecondLife",
    createdAt: "2026-08-30T09:45:00",
  },
  {
    id: "4",
    title: "Vintage Dekoration",
    category: "Dekoration",
    condition: "used",
    listingType: "auction",
    startingPrice: 20,
    currentBid: 35,
    bidCount: 7,
    auctionEndsAt: "2026-08-31T18:30:00",
    imageUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    sellerName: "AntikCorner",
    createdAt: "2026-08-31T16:20:00",
  },
];
