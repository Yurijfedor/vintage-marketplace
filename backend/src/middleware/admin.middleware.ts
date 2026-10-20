import type { NextFunction, Response } from "express";
import prisma from "../lib/prisma.js";
import type { AuthenticatedRequest } from "./auth.middleware.js";

export async function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user?.userId) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      res.status(403).json({
        message: "Admin access required",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Admin authorization failed:", error);

    res.status(500).json({
      message: "Failed to verify admin access",
    });
  }
}
