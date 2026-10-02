import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../repositories/product.repository.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { sellerMiddleware } from "../middleware/seller.middleware.js";

import { getUserById } from "../repositories/user.repository.js";
import { createBid } from "../repositories/bid.repository.js";

import type { ProductCondition } from "../types/product.js";

const PRODUCT_CONDITIONS: ProductCondition[] = [
  "new",
  "very-good",
  "good",
  "used",
  "damaged",
];

function isProductCondition(value: unknown): value is ProductCondition {
  return (
    typeof value === "string" &&
    PRODUCT_CONDITIONS.includes(value as ProductCondition)
  );
}

const productsRouter = Router();

productsRouter.get("/", async (_req, res) => {
  const products = await getAllProducts();

  res.json(products);
});

productsRouter.get("/:productId", async (req, res) => {
  const product = await getProductById(req.params.productId);

  if (!product) {
    res.status(404).json({
      error: "Product not found",
    });

    return;
  }

  res.json(product);
});

productsRouter.post("/:productId/bids", authMiddleware, async (req, res) => {
  const productId = req.params.productId;

  if (typeof productId !== "string") {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const { amount } = req.body;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({ error: "Invalid bid amount" });
    return;
  }

  try {
    const bid = await createBid({
      productId,
      bidderId: req.user!.userId,
      amount,
    });

    res.status(201).json(bid);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Product not found") {
        res.status(404).json({ error: error.message });
        return;
      }

      if (
        error.message === "Product is not an auction" ||
        error.message === "Auction end date is not configured" ||
        error.message === "Auction has ended" ||
        error.message.startsWith("Bid must be at least")
      ) {
        res.status(400).json({ error: error.message });
        return;
      }
    }

    console.error("Failed to create bid:", error);
    res.status(500).json({ error: "Failed to create bid" });
  }
});

productsRouter.put(
  "/:productId",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    const { title, category, condition, imageUrl, listingType } = req.body;

    const productId = req.params.productId;

    if (typeof productId !== "string") {
      res.status(400).json({
        error: "Invalid product ID",
      });

      return;
    }

    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      res.status(404).json({
        error: "Product not found",
      });

      return;
    }

    if (existingProduct.sellerId !== req.user!.userId) {
      res.status(403).json({
        error: "You can only modify your own products",
      });

      return;
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      !isProductCondition(condition) ||
      typeof imageUrl !== "string" ||
      !imageUrl.trim() ||
      (listingType !== "fixed-price" && listingType !== "auction")
    ) {
      res.status(400).json({
        error: "Invalid product data",
      });

      return;
    }

    if (listingType === "fixed-price") {
      const { price } = req.body;

      if (typeof price !== "number" || price < 0) {
        res.status(400).json({
          error: "Invalid fixed-price product data",
        });

        return;
      }

      const product = await updateProduct(productId, {
        title: title.trim(),
        category: category.trim(),
        condition,
        imageUrl: imageUrl.trim(),
        sellerName: existingProduct.sellerName,
        listingType,
        price,
      });

      res.json(product);

      return;
    }

    const { startingPrice, currentBid, bidCount, auctionEndsAt } = req.body;

    if (
      typeof startingPrice !== "number" ||
      startingPrice < 0 ||
      (currentBid !== undefined &&
        currentBid !== null &&
        typeof currentBid !== "number") ||
      (bidCount !== undefined &&
        (!Number.isInteger(bidCount) || bidCount < 0)) ||
      typeof auctionEndsAt !== "string" ||
      !auctionEndsAt.trim()
    ) {
      res.status(400).json({
        error: "Invalid auction product data",
      });

      return;
    }

    const product = await updateProduct(productId, {
      title: title.trim(),
      category: category.trim(),
      condition,
      imageUrl: imageUrl.trim(),
      sellerName: existingProduct.sellerName,
      listingType,
      startingPrice,
      auctionEndsAt: auctionEndsAt.trim(),
    });

    res.json(product);
  },
);

productsRouter.delete(
  "/:productId",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    const productId = req.params.productId;

    if (typeof productId !== "string") {
      res.status(400).json({
        error: "Invalid product ID",
      });

      return;
    }

    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      res.status(404).json({
        error: "Product not found",
      });

      return;
    }

    if (existingProduct.sellerId !== req.user!.userId) {
      res.status(403).json({
        error: "You can only delete your own products",
      });

      return;
    }

    await deleteProduct(productId);

    res.status(204).send();
  },
);

productsRouter.post("/", authMiddleware, sellerMiddleware, async (req, res) => {
  const { title, category, condition, imageUrl, listingType } = req.body;

  const user = await getUserById(req.user!.userId);

  if (!user) {
    res.status(401).json({
      error: "User not found",
    });

    return;
  }

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    !isProductCondition(condition) ||
    typeof imageUrl !== "string" ||
    !imageUrl.trim() ||
    (listingType !== "fixed-price" && listingType !== "auction")
  ) {
    res.status(400).json({
      error: "Invalid product data",
    });

    return;
  }

  if (listingType === "fixed-price") {
    const { price } = req.body;

    if (typeof price !== "number" || price < 0) {
      res.status(400).json({
        error: "Invalid fixed-price product data",
      });

      return;
    }

    const product = await createProduct({
      title: title.trim(),
      category: category.trim(),
      condition,
      imageUrl: imageUrl.trim(),
      sellerId: user.id,
      sellerName: user.name,
      listingType,
      price,
    });

    res.status(201).json(product);

    return;
  }

  const { startingPrice, currentBid, bidCount, auctionEndsAt } = req.body;

  if (
    typeof startingPrice !== "number" ||
    startingPrice < 0 ||
    (currentBid !== undefined &&
      currentBid !== null &&
      typeof currentBid !== "number") ||
    (bidCount !== undefined && (!Number.isInteger(bidCount) || bidCount < 0)) ||
    typeof auctionEndsAt !== "string" ||
    !auctionEndsAt.trim()
  ) {
    res.status(400).json({
      error: "Invalid auction product data",
    });

    return;
  }

  const product = await createProduct({
    title: title.trim(),
    category: category.trim(),
    condition,
    imageUrl: imageUrl.trim(),
    sellerId: user.id,
    sellerName: user.name,
    listingType,
    startingPrice,
    currentBid: currentBid ?? null,
    bidCount: bidCount ?? 0,
    auctionEndsAt: auctionEndsAt.trim(),
  });

  res.status(201).json(product);
});

export default productsRouter;
