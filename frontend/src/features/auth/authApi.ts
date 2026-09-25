import type { User, UserRole } from "../../types/auth";

const API_BASE_URL = "http://localhost:3000/api";

interface LoginResponse {
  token: string;
  user: User;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let errorMessage = "Request failed";

  try {
    const errorData = (await response.json()) as ApiErrorResponse;

    errorMessage = errorData.message ?? errorData.error ?? errorMessage;
  } catch {
    // Keep the default error message.
  }

  throw new Error(errorMessage);
}

export async function registerUserApi(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  return parseResponse<User>(response);
}

export async function loginUserApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return parseResponse<LoginResponse>(response);
}

export async function getCurrentUserApi(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<User>(response);
}
