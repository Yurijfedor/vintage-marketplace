import { createContext } from "react";

import type { User, UserRole } from "../../types/auth";

export interface AuthContextValue {
  user: User | null;

  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;

  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => boolean;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
