const AUTH_TOKEN_STORAGE_KEY = "authToken";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function saveAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
