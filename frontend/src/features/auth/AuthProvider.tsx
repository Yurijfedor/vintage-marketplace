import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { User, UserRole } from "../../types/auth";

import { registerUser } from "./authStorage";
import { loginUserApi, getCurrentUserApi } from "./authApi";
import {
  getAuthToken,
  removeAuthToken,
  saveAuthToken,
} from "./authTokenStorage";

import { AuthContext, type AuthContextValue } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    getCurrentUserApi(token)
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        removeAuthToken();
        setUser(null);
      });
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await loginUserApi(email, password);

      saveAuthToken(response.token);
      setUser(response.user);

      return true;
    } catch {
      return false;
    }
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
    removeAuthToken();
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
