import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { User, UserRole } from "../../types/auth";

import { authenticateUser, registerUser } from "./authStorage";

import { AuthContext, type AuthContextValue } from "./AuthContext";

const AUTH_STORAGE_KEY = "currentUser";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  function login(email: string, password: string): boolean {
    const authenticatedUser = authenticateUser(email, password);

    if (!authenticatedUser) {
      return false;
    }

    setUser(authenticatedUser);

    return true;
  }

  function register(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): boolean {
    const registeredUser = registerUser(name, email, password, role);

    if (!registeredUser) {
      return false;
    }

    setUser(registeredUser);

    return true;
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
