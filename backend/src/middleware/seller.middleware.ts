import type { NextFunction, Response } from "express";

import type { AuthenticatedRequest } from "./auth.middleware.js";

export function sellerMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "seller" && req.user?.role !== "admin") {
    res.status(403).json({
      message: "Seller access required",
    });

    return;
  }

  next();
}
