import prisma from "../lib/prisma.js";

export interface CreateBidInput {
  productId: string;
  bidderId: string;
  amount: number;
}

export interface CreatedBid {
  id: string;
  amount: number;
  createdAt: string;
  bidderId: string;
  productId: string;
}

export async function createBid(input: CreateBidInput): Promise<CreatedBid> {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.listingType !== "auction") {
      throw new Error("Product is not an auction");
    }

    if (!product.auctionEndsAt) {
      throw new Error("Auction end date is not configured");
    }

    if (product.auctionEndsAt <= new Date()) {
      throw new Error("Auction has ended");
    }

    const currentBid = product.currentBid
      ? product.currentBid.toNumber()
      : product.startingPrice!.toNumber();

    const minimumBid = currentBid + 1;

    if (input.amount < minimumBid) {
      throw new Error(`Bid must be at least ${minimumBid.toFixed(2)}`);
    }

    const bid = await tx.bid.create({
      data: {
        amount: input.amount,
        bidderId: input.bidderId,
        productId: input.productId,
      },
    });

    await tx.product.update({
      where: {
        id: input.productId,
      },
      data: {
        currentBid: input.amount,
        bidCount: {
          increment: 1,
        },
      },
    });

    return {
      id: bid.id,
      amount: bid.amount.toNumber(),
      createdAt: bid.createdAt.toISOString(),
      bidderId: bid.bidderId,
      productId: bid.productId,
    };
  });
}
