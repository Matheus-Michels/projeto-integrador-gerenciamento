"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ActivityTabs from "./activityTabs";
import ContributorRanking from "./contributorRanking";
import FavoriteButton from "./FavoriteButton";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [repoInput, setRepoInput] = useState("");
  const [currentRepo, setCurrentRepo] = useState<string | null>(null);

  useEffect(() => {
    const queryRepo = searchParams.get("repo");
    if (queryRepo) {
      setCurrentRepo(queryRepo);
      setRepoInput(queryRepo);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim()) return;

    router.push(`/dashboard?repo=${repoInput.trim()}`);
  };

  const [owner, repo] = currentRepo ? currentRepo.split("/") : ["", ""];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Bloco de Boas-Vindas */}
      <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors duration-200">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
          Visão Geral
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light mt-1">
          Acompanhamento de pull requests, issues e atividades recentes dos repositórios conectados.
        </p>
      </div>

      {/* Formulário de Busca */}
      <div className="bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors duration-200">
        <form
          onSubmit={handleSearch}
          className="bg-zinc-50 dark:bg-zinc-800/40 border-2 border-zinc-200 dark:border-zinc-700 p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-dashed rounded-lg"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Buscar Repositório no GitHub
            </label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="usuario/repositorio"
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition cursor-pointer mt-auto self-end"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Exibição condicional dos dados */}
      {currentRepo ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
              Resultados para: <span className="text-black dark:text-white font-bold">{currentRepo}</span>
            </p>
            <FavoriteButton owner={owner} repo={repo} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <ActivityTabs repo={currentRepo} />
            </div>
            <div className="lg:col-span-1">
              <ContributorRanking repo={currentRepo} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center shadow-sm transition-colors duration-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-1">
            Nenhum repositório selecionado
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Digite o nome de um repositório no campo acima e clique em <strong>Buscar</strong> para carregar as Issues e Pull Requests.
          </p>
        </div>
      )}
    </div>
  );
}