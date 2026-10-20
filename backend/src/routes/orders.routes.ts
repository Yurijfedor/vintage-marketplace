import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { createOrder, getAllOrders } from "../repositories/order.repository.js";
import { sendOrderNotification } from "../services/telegram.service.js";

const ordersRouter = Router();

ordersRouter.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  async (_req, res) => {
    try {
      const orders = await getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
      res.status(500).json({
        error: "Failed to fetch orders",
      });
    }
  },
);

const PAYMENT_METHODS = ["invoice", "paypal", "card"] as const;

ordersRouter.post("/", authMiddleware, async (req, res) => {
  const {
    firstName,
    lastName,
    street,
    postalCode,
    city,
    paymentMethod,
    items,
  } = req.body ?? {};

  const addressFields = [firstName, lastName, street, postalCode, city];

  if (
    !addressFields.every(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) ||
    addressFields.some((value) => value.trim().length > 200) ||
    !PAYMENT_METHODS.includes(paymentMethod) ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 100 ||
    !items.every(
      (item: unknown) =>
        typeof item === "object" &&
        item !== null &&
        "productId" in item &&
        typeof item.productId === "string" &&
        item.productId.trim().length > 0 &&
        "quantity" in item &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 99,
    )
  ) {
    res.status(400).json({ error: "Invalid order data" });
    return;
  }

  try {
    const order = await createOrder({
      userId: req.user!.userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      street: street.trim(),
      postalCode: postalCode.trim(),
      city: city.trim(),
      paymentMethod,
      items: items.map((item: { productId: string; quantity: number }) => ({
        productId: item.productId.trim(),
        quantity: item.quantity,
      })),
    });

    // Telegram failure must not undo a successfully saved order.
    await sendOrderNotification(order);

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "One or more products are unavailable") {
        res.status(400).json({ error: error.message });
        return;
      }

      if (error.message === "Invalid item quantity") {
        res.status(400).json({ error: error.message });
        return;
      }
    }

    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default ordersRouter;
