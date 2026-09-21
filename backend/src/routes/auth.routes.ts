import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createUser, getUserByEmail } from "../repositories/user.repository.js";

const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

authRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).json({
      message: "Name, email and password are required",
    });

    return;
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password) {
    res.status(400).json({
      message: "Name, email and password are required",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      message: "Password must contain at least 6 characters",
    });

    return;
  }

  const existingUser = getUserByEmail(normalizedEmail);

  if (existingUser) {
    res.status(409).json({
      message: "User with this email already exists",
    });

    return;
  }

  const userRole = role === "seller" ? "seller" : "buyer";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = createUser({
    name: trimmedName,
    email: normalizedEmail,
    passwordHash,
    role: userRole,
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({
      message: "Email and password are required",
    });

    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = getUserByEmail(normalizedEmail);

  if (!user) {
    res.status(401).json({
      message: "Invalid email or password",
    });

    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    res.status(401).json({
      message: "Invalid email or password",
    });

    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export default authRouter;
