import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: "buyer" | "seller";
  };
}

interface JwtPayload {
  userId: string;
  role: "buyer" | "seller";
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      message: "Authorization header is required",
    });

    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      message: "Invalid authorization format",
    });

    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "string" ||
      (payload.role !== "buyer" && payload.role !== "seller")
    ) {
      res.status(401).json({
        message: "Invalid token payload",
      });

      return;
    }

    const user: JwtPayload = {
      userId: payload.userId,
      role: payload.role,
    };

    req.user = user;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
