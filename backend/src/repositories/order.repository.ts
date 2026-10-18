import prisma from "../lib/prisma.js";

export interface CreateOrderInput {
  userId: string;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  paymentMethod: "invoice" | "paypal" | "card";
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export async function createOrder(input: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
    const productIds = [...new Set(input.items.map((item) => item.productId))];

    const products = await tx.product.findMany({
      where: {
        id: { in: productIds },
        listingType: "fixed_price",
      },
      include: {
        seller: {
          select: { name: true },
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products are unavailable");
    }

    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    const orderItems = input.items.map((item) => {
      const product = productById.get(item.productId);

      if (!product || !product.price) {
        throw new Error("One or more products are unavailable");
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        throw new Error("Invalid item quantity");
      }

      return {
        productId: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        sellerName: product.seller.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price.toNumber() * item.quantity,
      0,
    );

    return tx.order.create({
      data: {
        userId: input.userId,
        firstName: input.firstName,
        lastName: input.lastName,
        street: input.street,
        postalCode: input.postalCode,
        city: input.city,
        paymentMethod: input.paymentMethod,
        totalItems,
        totalPrice,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });
  });
}
