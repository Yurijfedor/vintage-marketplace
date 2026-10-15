import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/env.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { sellerMiddleware } from "../middleware/seller.middleware.js";

const uploadsRouter = Router();

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

uploadsRouter.post(
  "/signature",
  authMiddleware,
  sellerMiddleware,
  (_req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "vintage-marketplace/products";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      CLOUDINARY_API_SECRET,
    );

    res.json({
      timestamp,
      folder,
      signature,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
    });
  },
);

export default uploadsRouter;
