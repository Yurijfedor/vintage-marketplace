import type { User, UserRole } from "../types/user.js";
import prisma from "../lib/prisma.js";

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

function mapUser(user: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "buyer" | "seller";
  createdAt: Date;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getUserById(userId: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user ? mapUser(user) : undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  return user ? mapUser(user) : undefined;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash: input.passwordHash,
      role: input.role,
    },
  });

  return mapUser(user);
}
