"use client";

import { useEffect, useState } from "react";

export interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface ContributorRankingProps {
  repo: string;
}

export default function ContributorRanking({ repo }: ContributorRankingProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributors() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo}/contributors?per_page=10`
        );

        if (!res.ok) {
          throw new Error("Não foi possível carregar o ranking de colaboradores.");
        }

        const data = await res.json();
        setContributors(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar colaboradores.");
      } finally {
        setLoading(false);
      }
    }

    if (repo) {
      fetchContributors();
    }
  }, [repo]);

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center text-zinc-500 shadow-sm animate-pulse">
        A carregar ranking de colaboradores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 shadow-sm text-sm">
        {error}
      </div>
    );
  }

  if (contributors.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-6 text-center text-zinc-500 text-sm shadow-sm">
        Nenhum colaborador encontrado para este repositório.
      </div>
    );
  }

  const getMedalBadge = (position: number) => {
    switch (position) {
      case 1:
        return "🥇 1º";
      case 2:
        return "🥈 2º";
      case 3:
        return "🥉 3º";
      default:
        return `${position}º`;
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-black text-sm uppercase tracking-wider">
            Ranking de Colaboradores
          </h2>
          <p className="text-xs text-zinc-500">
            Top 10 utilizadores por número de commits no repositório
          </p>
        </div>
        <span className="text-xs font-semibold bg-zinc-200 text-zinc-700 px-2.5 py-0.5 rounded-full">
          {contributors.length} membros
        </span>
      </div>

      <div className="divide-y divide-zinc-200">
        {contributors.map((user, index) => {
          const position = index + 1;
          return (
            <div
              key={user.id}
              className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-9 text-xs font-bold text-center ${
                    position === 1
                      ? "text-yellow-600 font-black text-sm"
                      : position === 2
                      ? "text-zinc-500 font-bold"
                      : position === 3
                      ? "text-amber-700 font-bold"
                      : "text-zinc-400"
                  }`}
                >
                  {getMedalBadge(position)}
                </span>

                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-10 h-10 rounded-full border border-zinc-200"
                />

                <div>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-black hover:underline text-sm tracking-tight"
                  >
                    {user.login}
                  </a>
                  <p className="text-xs text-zinc-400">Contribuidor verificado</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-black">
                  {user.contributions}
                </span>
                <span className="text-xs text-zinc-500 ml-1">commits</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}