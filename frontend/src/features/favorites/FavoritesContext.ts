import { createContext } from "react";

export interface FavoritesContextValue {
  favoriteProductIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);
