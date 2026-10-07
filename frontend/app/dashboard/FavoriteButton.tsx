"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ owner, repo }: { owner: string; repo: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return;

        const res = await fetch(`http://localhost:3000/favorites/${userToken}`);
        if (res.ok) {
          const favorites = await res.json();
          const isSaved = favorites.some((fav: any) => fav.owner === owner && fav.repo === repo);
          setIsFavorited(isSaved);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (owner && repo) {
      checkFavoriteStatus();
    }
  }, [owner, repo]);

  const toggleFavorite = async () => {
    try {
      const userToken = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

      if (!userToken) {
        router.push('/login');
        return;
      }

      if (!isFavorited) {
        const res = await fetch('http://localhost:3000/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userToken,
            owner,
            repo,
          }),
        });

        if (res.ok || res.status === 409) {
          setIsFavorited(true);
          router.refresh(); 
        } else if (res.status === 401) {
          router.push('/login');
        } else {
          console.error('Erro no servidor ao tentar salvar o favorito.');
        }
      } else {
        const res = await fetch(`http://localhost:3000/favorites/${owner}/${repo}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setIsFavorited(false);
          router.refresh();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-all border-2 border-black ${
        isFavorited
          ? 'bg-black text-white shadow-md'
          : 'bg-white text-black hover:bg-zinc-100'
      }`}
    >
      {isFavorited ? '★ Salvo' : '☆ Favoritar'}
    </button>
  );
}