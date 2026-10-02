import { getAuthToken } from "../features/auth/authTokenStorage";

const API_BASE_URL = "http://localhost:3000/api";

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export interface CreatedBid {
  id: string;
  amount: number;
  createdAt: string;
  bidderId: string;
  productId: string;
}

export async function createBid(
  productId: string,
  amount: number,
): Promise<CreatedBid> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      amount,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ?? "Beim Abgeben des Gebots ist ein Fehler aufgetreten.",
    );
  }

  return (await response.json()) as CreatedBid;
}
