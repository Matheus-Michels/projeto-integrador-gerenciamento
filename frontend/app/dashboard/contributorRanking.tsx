"use client";

import { useEffect, useState } from "react";
import Spinner from "./spinner";
import Toast from "./toast";

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

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-500 dark:text-zinc-400 shadow-sm flex flex-col items-center justify-center gap-3">
        <Spinner size="md" />
        <p className="text-sm">Carregando colaboradores...</p>
      </div>
    );
  }

  return (
    <>
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

      {contributors.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center text-zinc-500 dark:text-zinc-400 text-sm shadow-sm">
          Nenhum colaborador encontrado para este repositório.
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-black dark:text-white text-sm uppercase tracking-wider">
                Ranking de Colaboradores
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Top 10 utilizadores por número de commits no repositório
              </p>
            </div>
            <span className="text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-full">
              {contributors.length} membros
            </span>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {contributors.map((user, index) => {
              const position = index + 1;
              return (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 text-xs font-bold text-center ${
                        position === 1
                          ? "text-yellow-600 dark:text-yellow-400 font-black text-sm"
                          : position === 2
                          ? "text-zinc-500 dark:text-zinc-400 font-bold"
                          : position === 3
                          ? "text-amber-700 dark:text-amber-500 font-bold"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {getMedalBadge(position)}
                    </span>

                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                    />

                    <div>
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-black dark:text-white hover:underline text-sm tracking-tight"
                      >
                        {user.login}
                      </a>
                      <p className="text-xs text-zinc-400">Contribuidor verificado</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-black dark:text-white">
                      {user.contributions}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">commits</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}