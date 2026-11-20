"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Session from "supertokens-web-js/recipe/session";
import { apiFetch, ApiError } from "@/config/api";
import Toast from "@/app/dashboard/toast";

type Favorite = { owner: string; repo: string };

type FavoritesContextType = {
  favorites: Favorite[];
  isFavorited: (owner: string, repo: string) => boolean;
  addFavorite: (owner: string, repo: string) => Promise<void>;
  removeFavorite: (owner: string, repo: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const load = useCallback(async () => {
    try {
      const loggedIn = await Session.doesSessionExist();
      if (!loggedIn) {
        setFavorites([]);
        return;
      }
      const data = await apiFetch<Favorite[]>("/favorites");
      setFavorites(data ?? []);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return;
        console.error(error);
        setToast({
          message: error instanceof ApiError ? error.message : "Não foi possível carregar seus favoritos.",
          type: "error",
        });
      }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isFavorited = (owner: string, repo: string) =>
    favorites.some((f) => f.owner === owner && f.repo === repo);

  const addFavorite = async (owner: string, repo: string) => {
    const loggedIn = await Session.doesSessionExist();
    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    const previous = favorites;
    if (!isFavorited(owner, repo)) {
      setFavorites([...favorites, { owner, repo }]);
    }

    try {
      await apiFetch("/favorites", {
        method: "POST",
        body: JSON.stringify({ owner, repo }),
      });
    } catch (error) {
      setFavorites(previous);
      setToast({
        message: error instanceof ApiError ? error.message : "Não foi possível atualizar os favoritos.",
        type: "error",
      });
    }
  };

  const removeFavorite = async (owner: string, repo: string) => {
    const previous = favorites;
    setFavorites(
      favorites.filter((f) => !(f.owner === owner && f.repo === repo)),
    );

    try {
      await apiFetch(`/favorites/${owner}/${repo}`, {
        method: "DELETE",
      });
    } catch (error) {
      setFavorites(previous);
      console.error(error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorited, addFavorite, removeFavorite }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
