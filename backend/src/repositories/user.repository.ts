import { randomUUID } from "node:crypto";

import type { User, UserRole } from "../types/user.js";

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

const users: User[] = [];

export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}

export function getUserByEmail(email: string): User | undefined {
  const normalizedEmail = email.trim().toLowerCase();

  return users.find((user) => user.email === normalizedEmail);
}

export function createUser(input: CreateUserInput): User {
  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    role: input.role,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  return user;
}
