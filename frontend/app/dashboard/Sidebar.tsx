"use client";

import Link from "next/link";
import { useFavorites } from "@/components/FavoritesProvider";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const { favorites } = useFavorites();

  return (
    <>
      {/* Fundo escuro atrás da gaveta, só no mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col border-r border-zinc-800
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-full md:shrink-0`}
      >
        <div className="p-6 text-lg font-bold border-b border-zinc-800 flex items-center justify-between">
          <span>Projeto Integrador</span>
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="md:hidden text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg font-medium text-white hover:bg-zinc-900 transition"
          >
            Dashboard
          </Link>

          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Repositórios Salvos
            </p>
          </div>

          <div className="space-y-1">
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <Link
                  key={`${fav.owner}/${fav.repo}`}
                  href={`/dashboard?repo=${fav.owner}/${fav.repo}`}
                  onClick={onClose}
                  className="py-2 px-4 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition truncate flex items-center gap-2"
                >
                  <span className="text-yellow-500">★</span> {fav.owner}/
                  {fav.repo}
                </Link>
              ))
            ) : (
              <p className="px-4 py-2 text-xs text-zinc-600 italic">
                Nenhum favorito salvo
              </p>
            )}
          </div>

          <div className="pt-6">
            <Link
              href="/dashboard/configuracoes"
              onClick={onClose}
              className="block py-2.5 px-4 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            >
              Configurações
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
            N
          </div>
        </div>
      </aside>
    </>
  );
}