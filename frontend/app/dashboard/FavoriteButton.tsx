"use client";

import { useFavorites } from "@/components/FavoritesProvider";

export default function FavoriteButton({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();

  if (!owner || !repo) return null;

  const favorited = isFavorited(owner, repo);

  return (
    <button
      onClick={() =>
        favorited ? removeFavorite(owner, repo) : addFavorite(owner, repo)
      }
      className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-all border-2 border-black cursor-pointer ${
        favorited
          ? "bg-black text-white shadow-md"
          : "bg-white text-black hover:bg-zinc-100"
      }`}
    >
      {favorited ? "★ Salvo" : "☆ Favoritar"}
    </button>
  );
}
