import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  FavoritesContext,
  type FavoritesContextValue,
} from "./FavoritesContext";

const FAVORITES_STORAGE_KEY = "favoriteProductIds";

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(() => {
    const storedFavoriteIds = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!storedFavoriteIds) {
      return [];
    }

    return JSON.parse(storedFavoriteIds) as string[];
  });

  useEffect(() => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteProductIds),
    );
  }, [favoriteProductIds]);

  function toggleFavorite(productId: string) {
    setFavoriteProductIds((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId],
    );
  }

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteProductIds,
      toggleFavorite,
      isFavorite: (productId: string) => favoriteProductIds.includes(productId),
    }),
    [favoriteProductIds],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
