"use client";

import { useState } from "react";
import Spinner from "./spinner";
import Toast from "./toast";

interface RepoStats {
  repo: string;
  commits: number;
  openIssues: number;
  pullRequests: number;
}

interface RepoComparisonProps {
  initialRepoA?: string;
  onBack: () => void;
}

export default function RepoComparison({ initialRepoA = "", onBack }: RepoComparisonProps) {
  const [repoAInput, setRepoAInput] = useState(initialRepoA);
  const [repoBInput, setRepoBInput] = useState("");
  const [statsA, setStatsA] = useState<RepoStats | null>(null);
  const [statsB, setStatsB] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepoStats = async (repoName: string): Promise<RepoStats> => {
    const cleanRepo = repoName.trim();
    if (!cleanRepo || !cleanRepo.includes("/")) {
      throw new Error(`Formato inválido para "${cleanRepo}". Use: usuario/repositorio`);
    }

    const [repoRes, pullsRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${cleanRepo}`),
      fetch(`https://api.github.com/repos/${cleanRepo}/pulls?state=all&per_page=1`),
      fetch(`https://api.github.com/repos/${cleanRepo}/commits?per_page=1`),
    ]);

    if (!repoRes.ok) {
      throw new Error(`Repositório "${cleanRepo}" não foi encontrado no GitHub.`);
    }

    const repoData = await repoRes.json();

    const parseHeaderCount = (res: Response): number => {
      const link = res.headers.get("Link");
      if (link) {
        const match = link.match(/page=(\d+)>; rel="last"/);
        if (match) return parseInt(match[1], 10);
      }
      return 1;
    };

    return {
      repo: cleanRepo,
      commits: parseHeaderCount(commitsRes),
      openIssues: repoData.open_issues_count || 0,
      pullRequests: parseHeaderCount(pullsRes),
    };
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoAInput.trim() || !repoBInput.trim()) {
      setError("Preencha ambos os repositórios para comparar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [resA, resB] = await Promise.all([
        fetchRepoStats(repoAInput),
        fetchRepoStats(repoBInput),
      ]);
      setStatsA(resA);
      setStatsB(resB);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar dados dos repositórios.");
    } finally {
      setLoading(false);
    }
  };

  const getSummaryMessage = (metric: "commits" | "openIssues" | "pullRequests", label: string) => {
    if (!statsA || !statsB) return null;
    const valA = statsA[metric];
    const valB = statsB[metric];

    if (valA === valB) {
      return `Ambos possuem a mesma quantidade de ${label.toLowerCase()} (${valA}).`;
    }
    const winner = valA > valB ? "Projeto A" : "Projeto B";
    return `O ${winner} possui mais ${label.toLowerCase()} registrados.`;
  };

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

      <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
            Comparador de projetos
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light mt-1">
            Uma proposta de interface para o gerenciador de atividades do GitHub.
          </p>
        </div>
        <button
          onClick={onBack}
          className="self-start md:self-center px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-black dark:text-white"
        >
          ← Voltar para Visão Geral
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl">
        <form onSubmit={handleCompare} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Projeto A (usuario/repositorio)
              </label>
              <input
                type="text"
                value={repoAInput}
                onChange={(e) => setRepoAInput(e.target.value)}
                placeholder="Ex: facebook/react"
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Projeto B (usuario/repositorio)
              </label>
              <input
                type="text"
                value={repoBInput}
                onChange={(e) => setRepoBInput(e.target.value)}
                placeholder="Ex: vercel/next.js"
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? "Comparando repositórios..." : "Fazer comparação"}
          </button>
        </form>
      </div>

      {statsA && statsB && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-zinc-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="font-semibold text-lg text-white">Projeto A</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6">{statsA.repo}</p>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-zinc-400 block">Commits</span>
                    <strong className="text-3xl font-black">{statsA.commits}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">Issues abertas</span>
                    <strong className="text-3xl font-black">{statsA.openIssues}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">Pull requests</span>
                    <strong className="text-3xl font-black">{statsA.pullRequests}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-zinc-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="font-semibold text-lg text-white">Projeto B</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6">{statsB.repo}</p>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-zinc-400 block">Commits</span>
                    <strong className="text-3xl font-black">{statsB.commits}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">Issues abertas</span>
                    <strong className="text-3xl font-black">{statsB.openIssues}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">Pull requests</span>
                    <strong className="text-3xl font-black">{statsB.pullRequests}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 shadow-md">
            <h3 className="font-bold text-lg mb-4">Resumo comparativo</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-zinc-400 text-base mt-0.5">☍</span>
                <div>
                  <strong className="block text-white">Commits</strong>
                  <p className="text-zinc-400">{getSummaryMessage("commits", "Commits")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-zinc-400 text-base mt-0.5">◎</span>
                <div>
                  <strong className="block text-white">Issues abertas</strong>
                  <p className="text-zinc-400">{getSummaryMessage("openIssues", "Issues abertas")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-zinc-400 text-base mt-0.5">⇄</span>
                <div>
                  <strong className="block text-white">Pull requests</strong>
                  <p className="text-zinc-400">{getSummaryMessage("pullRequests", "Pull requests")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}