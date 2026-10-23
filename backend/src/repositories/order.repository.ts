import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

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

    if (productIds.length !== input.items.length) {
      throw new Error("Duplicate products in order");
    }

    await tx.$queryRaw`
      SELECT id
      FROM "Product"
      WHERE id IN (${Prisma.join(productIds)})
      ORDER BY id
      FOR UPDATE
    `;

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

    const reservations = await tx.orderItem.groupBy({
      by: ["productId"],
      where: {
        productId: { in: productIds },
        order: {
          status: "processing",
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const reservedByProductId = new Map(
      reservations.map((reservation) => [
        reservation.productId,
        reservation._sum.quantity ?? 0,
      ]),
    );

    const orderItems = input.items.map((item) => {
      const product = productById.get(item.productId);

      if (!product || !product.price) {
        throw new Error("One or more products are unavailable");
      }

      const reservedQuantity = reservedByProductId.get(product.id) ?? 0;
      const availableQuantity = product.stockQuantity - reservedQuantity;

      if (item.quantity > availableQuantity) {
        throw new Error(
          `Not enough stock for "${product.title}". Available: ${availableQuantity}`,
        );
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
        status: "processing",
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

export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export const ORDER_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === status) {
      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    const allowedTransitions: Record<string, OrderStatus[]> = {
      processing: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[order.status]?.includes(status)) {
      throw new Error(
        `Invalid order status transition: ${order.status} -> ${status}`,
      );
    }

    if (order.status === "processing" && status === "confirmed") {
      for (const item of order.items) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        if (result.count !== 1) {
          throw new Error(
            `Insufficient stock to confirm order for "${item.title}"`,
          );
        }
      }
    }

    if (order.status === "confirmed" && status === "cancelled") {
      for (const item of order.items) {
        await tx.product.updateMany({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
          },
        });
      }
    }

    return tx.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });
}
