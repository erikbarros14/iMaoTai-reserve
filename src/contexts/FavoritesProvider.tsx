'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

type FavoritesContextType = {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};
  // Create a context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'voyage-planner-favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedFavorites = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedFavorites) {
        setFavoriteIds(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites from local storage", error);
    }
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds(prevIds => {
      const newIds = prevIds.includes(id)
        ? prevIds.filter(favId => favId !== id)
        : [...prevIds, id];
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newIds));
      } catch (error) {
        console.error("Failed to save favorites to local storage", error);
      }
      return newIds;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favoriteIds.includes(id), [favoriteIds]);

  const value = { favoriteIds, toggleFavorite, isFavorite };

  return (
    <FavoritesContext.Provider value={value}>
      {isMounted ? children : null}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
