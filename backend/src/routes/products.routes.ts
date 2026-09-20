import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../repositories/product.repository.js";

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

productsRouter.get("/", (_req, res) => {
  res.json(getAllProducts());
});

productsRouter.get("/:productId", (req, res) => {
  const product = getProductById(req.params.productId);

  if (!product) {
    res.status(404).json({
      error: "Product not found",
    });

    return;
  }

  res.json(product);
});

productsRouter.put("/:productId", (req, res) => {
  const { title, category, condition, imageUrl, sellerName, listingType } =
    req.body;

  const { productId } = req.params;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    !isProductCondition(condition) ||
    typeof imageUrl !== "string" ||
    !imageUrl.trim() ||
    typeof sellerName !== "string" ||
    !sellerName.trim() ||
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

    const product = updateProduct(productId, {
      title: title.trim(),
      category: category.trim(),
      condition,
      imageUrl: imageUrl.trim(),
      sellerName: sellerName.trim(),
      listingType,
      price,
    });

    if (!product) {
      res.status(404).json({
        error: "Product not found",
      });

      return;
    }

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
    (bidCount !== undefined && (!Number.isInteger(bidCount) || bidCount < 0)) ||
    typeof auctionEndsAt !== "string" ||
    !auctionEndsAt.trim()
  ) {
    res.status(400).json({
      error: "Invalid auction product data",
    });

    return;
  }

  const product = updateProduct(productId, {
    title: title.trim(),
    category: category.trim(),
    condition,
    imageUrl: imageUrl.trim(),
    sellerName: sellerName.trim(),
    listingType,
    startingPrice,
    currentBid: currentBid ?? null,
    bidCount: bidCount ?? 0,
    auctionEndsAt: auctionEndsAt.trim(),
  });

  if (!product) {
    res.status(404).json({
      error: "Product not found",
    });

    return;
  }

  res.json(product);
});

productsRouter.delete("/:productId", (req, res) => {
  const deleted = deleteProduct(req.params.productId);

  if (!deleted) {
    res.status(404).json({
      error: "Product not found",
    });

    return;
  }

  res.status(204).send();
});

productsRouter.post("/", (req, res) => {
  const { title, category, condition, imageUrl, sellerName, listingType } =
    req.body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    !isProductCondition(condition) ||
    typeof imageUrl !== "string" ||
    !imageUrl.trim() ||
    typeof sellerName !== "string" ||
    !sellerName.trim() ||
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

    const product = createProduct({
      title: title.trim(),
      category: category.trim(),
      condition,
      imageUrl: imageUrl.trim(),
      sellerName: sellerName.trim(),
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

  const product = createProduct({
    title: title.trim(),
    category: category.trim(),
    condition,
    imageUrl: imageUrl.trim(),
    sellerName: sellerName.trim(),
    listingType,
    startingPrice,
    currentBid: currentBid ?? null,
    bidCount: bidCount ?? 0,
    auctionEndsAt: auctionEndsAt.trim(),
  });

  res.status(201).json(product);
});

export default productsRouter;
