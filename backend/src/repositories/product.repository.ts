import type { Product } from "../types/product.js";
import prisma from "../lib/prisma.js";

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

function mapProduct(product: {
  id: string;
  title: string;
  category: string;
  condition:
    | "new"
    | "very_good"
    | "good"
    | "used"
    | "damaged";
  listingType: "fixed_price" | "auction";
  imageUrl: string;
  price: { toNumber(): number } | null;
  startingPrice: { toNumber(): number } | null;
  currentBid: { toNumber(): number } | null;
  bidCount: number;
  auctionEndsAt: Date | null;
  sellerId: string;
  createdAt: Date;
  seller: {
    name: string;
  };
}): Product {
  const conditionMap = {
    new: "new",
    very_good: "very-good",
    good: "good",
    used: "used",
    damaged: "damaged",
  } as const;

  if (product.listingType === "fixed_price") {
    return {
      id: product.id,
      title: product.title,
      category: product.category,
      condition: conditionMap[product.condition],
      listingType: "fixed-price",
      price: product.price!.toNumber(),
      imageUrl: product.imageUrl,
      sellerId: product.sellerId,
      sellerName: product.seller.name,
      createdAt: product.createdAt.toISOString(),
    };
  }

  return {
    id: product.id,
    title: product.title,
    category: product.category,
    condition: conditionMap[product.condition],
    listingType: "auction",
    startingPrice: product.startingPrice!.toNumber(),
    currentBid: product.currentBid?.toNumber() ?? null,
    bidCount: product.bidCount,
    auctionEndsAt: product.auctionEndsAt!.toISOString(),
    imageUrl: product.imageUrl,
    sellerId: product.sellerId,
    sellerName: product.seller.name,
    createdAt: product.createdAt.toISOString(),
  };
}

const productInclude = {
  seller: {
    select: {
      name: true,
    },
  },
} as const;

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(mapProduct);
}

export async function getProductById(
  productId: string,
): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: productInclude,
  });

  return product ? mapProduct(product) : undefined;
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
): Promise<Product | undefined> {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    return undefined;
  }

  const product =
    input.listingType === "fixed-price"
      ? await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            title: input.title,
            category: input.category,
            condition: input.condition.replace(
              "-",
              "_",
            ) as "new" | "very_good" | "good" | "used" | "damaged",
            listingType: "fixed_price",
            price: input.price,
            startingPrice: null,
            currentBid: null,
            bidCount: 0,
            auctionEndsAt: null,
            imageUrl: input.imageUrl,
          },
          include: productInclude,
        })
      : await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            title: input.title,
            category: input.category,
            condition: input.condition.replace(
              "-",
              "_",
            ) as "new" | "very_good" | "good" | "used" | "damaged",
            listingType: "auction",
            price: null,
            startingPrice: input.startingPrice,
            currentBid: input.currentBid ?? null,
            bidCount: input.bidCount ?? 0,
            auctionEndsAt: new Date(input.auctionEndsAt),
            imageUrl: input.imageUrl,
          },
          include: productInclude,
        });

  return mapProduct(product);
}

export async function deleteProduct(
  productId: string,
): Promise<boolean> {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
    },
  });

  if (!existingProduct) {
    return false;
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  return true;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const product =
    input.listingType === "fixed-price"
      ? await prisma.product.create({
          data: {
            title: input.title,
            category: input.category,
            condition: input.condition.replace(
              "-",
              "_",
            ) as "new" | "very_good" | "good" | "used" | "damaged",
            listingType: "fixed_price",
            price: input.price,
            startingPrice: null,
            currentBid: null,
            bidCount: 0,
            auctionEndsAt: null,
            imageUrl: input.imageUrl,
            sellerId: input.sellerId,
          },
          include: productInclude,
        })
      : await prisma.product.create({
          data: {
            title: input.title,
            category: input.category,
            condition: input.condition.replace(
              "-",
              "_",
            ) as "new" | "very_good" | "good" | "used" | "damaged",
            listingType: "auction",
            price: null,
            startingPrice: input.startingPrice,
            currentBid: input.currentBid ?? null,
            bidCount: input.bidCount ?? 0,
            auctionEndsAt: new Date(input.auctionEndsAt),
            imageUrl: input.imageUrl,
            sellerId: input.sellerId,
          },
          include: productInclude,
        });

  return mapProduct(product);
}