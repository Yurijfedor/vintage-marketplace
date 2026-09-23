import type { Product } from "../types/product.js";

type CreateProductInput =
  | {
      title: string;
      category: string;
      condition: Product["condition"];
      imageUrl: string;
      sellerId: string;
      sellerName: string;
      listingType: "fixed-price";
      price: number;
    }
  | {
      title: string;
      category: string;
      condition: Product["condition"];
      imageUrl: string;
      sellerId: string;
      sellerName: string;
      listingType: "auction";
      startingPrice: number;
      currentBid?: number | null;
      bidCount?: number;
      auctionEndsAt: string;
    };

type UpdateProductInput =
  | {
      title: string;
      category: string;
      condition: Product["condition"];
      imageUrl: string;
      sellerName: string;
      listingType: "fixed-price";
      price: number;
    }
  | {
      title: string;
      category: string;
      condition: Product["condition"];
      imageUrl: string;
      sellerName: string;
      listingType: "auction";
      startingPrice: number;
      currentBid?: number | null;
      bidCount?: number;
      auctionEndsAt: string;
    };

const products: Product[] = [
  {
    id: "1",
    title: "Alte Porzellanfigur",
    category: "Porzellan",
    condition: "good",
    listingType: "fixed-price",
    price: 29,
    imageUrl:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=80",
    sellerId: "seed-seller-vintageshop",
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
    sellerId: "seed-seller-retrosound",
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
    sellerId: "seed-seller-secondlife",
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
    sellerId: "seed-seller-antikcorner",
    sellerName: "AntikCorner",
    createdAt: "2026-08-31T16:20:00",
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}

export function updateProduct(
  productId: string,
  input: UpdateProductInput,
): Product | undefined {
  const productIndex = products.findIndex(
    (product) => product.id === productId,
  );

  if (productIndex === -1) {
    return undefined;
  }

  const updatedProduct =
    input.listingType === "fixed-price"
      ? {
          id: productId,
          title: input.title,
          category: input.category,
          condition: input.condition,
          listingType: "fixed-price" as const,
          price: input.price,
          imageUrl: input.imageUrl,
          sellerId: products[productIndex].sellerId,
          sellerName: input.sellerName,
          createdAt: products[productIndex].createdAt,
        }
      : {
          id: productId,
          title: input.title,
          category: input.category,
          condition: input.condition,
          listingType: "auction" as const,
          startingPrice: input.startingPrice,
          currentBid: input.currentBid ?? null,
          bidCount: input.bidCount ?? 0,
          auctionEndsAt: input.auctionEndsAt,
          imageUrl: input.imageUrl,
          sellerId: products[productIndex].sellerId,
          sellerName: input.sellerName,
          createdAt: products[productIndex].createdAt,
        };

  products[productIndex] = updatedProduct;

  return updatedProduct;
}

export function deleteProduct(productId: string): boolean {
  const productIndex = products.findIndex(
    (product) => product.id === productId,
  );

  if (productIndex === -1) {
    return false;
  }

  products.splice(productIndex, 1);

  return true;
}

export function createProduct(input: CreateProductInput): Product {
  const product =
    input.listingType === "fixed-price"
      ? {
          id: crypto.randomUUID(),
          title: input.title,
          category: input.category,
          condition: input.condition,
          listingType: "fixed-price" as const,
          price: input.price,
          imageUrl: input.imageUrl,
          sellerId: input.sellerId,
          sellerName: input.sellerName,
          createdAt: new Date().toISOString(),
        }
      : {
          id: crypto.randomUUID(),
          title: input.title,
          category: input.category,
          condition: input.condition,
          listingType: "auction" as const,
          startingPrice: input.startingPrice,
          currentBid: input.currentBid ?? null,
          bidCount: input.bidCount ?? 0,
          auctionEndsAt: input.auctionEndsAt,
          imageUrl: input.imageUrl,
          sellerId: input.sellerId,
          sellerName: input.sellerName,
          createdAt: new Date().toISOString(),
        };

  products.push(product);

  return product;
}
