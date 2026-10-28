"use client";

import { useState, useEffect } from "react";
import PullRequestList, { pullRequest } from "./pullRequestList";
import IssueList, { issue } from "./issueList";
import Toast from "./toast";
import Spinner from "./spinner";
import ProductivityChartProps from "./productivityChart";
import ProductivityChart from "./productivityChart";
import ContributionHeatmap from "./contributionHeatmap";

type TabType = "prs" | "issues";

interface ActivityTabsProps {
  repo: string;
  since?: string | null;
  until?: string | null;
  author?: string | null;
}

export default function ActivityTabs({ repo, since, until, author }: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("prs");
  const [prs, setPrs] = useState<pullRequest[]>([]);
  const [issues, setIssues] = useState<issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isCHartOpen, setIsChartOpen] = useState(false);
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // 1. Converte as datas simples (ex: "2020-01-01") para o formato ISO completo (ex: "2020-01-01T00:00:00.000Z")
        const formattedSince = since ? new Date(since).toISOString() : null;
        const formattedUntil = until ? new Date(until).toISOString() : null;

        // 2. Monta os parâmetros para Pull Requests (aceita 'since', 'until' e 'author')
        const prParams = new URLSearchParams();
        if (formattedSince) prParams.append("since", formattedSince);
        if (formattedUntil) prParams.append("until", formattedUntil);
        if (author) prParams.append("author", author);

        // 3. Monta os parâmetros para Issues (A API do GitHub não suporta 'until' em issues)
        const issueParams = new URLSearchParams();
        if (formattedSince) issueParams.append("since", formattedSince);
        if (author) issueParams.append("author", author);

        const prsQueryString = prParams.toString();
        const issuesQueryString = issueParams.toString();

        let pullsUrl = `http://localhost:3000/github/${repo}/pulls${prsQueryString ? `?${prsQueryString}` : ''}`;
        let issuesUrl = `http://localhost:3000/github/${repo}/issues${issuesQueryString ? `?${issuesQueryString}` : ''}`;

        const [prsRes, issuesRes] = await Promise.all([
          fetch(pullsUrl),
          fetch(issuesUrl)
        ]);

        if (!prsRes.ok || !issuesRes.ok) {
          throw new Error("Não foi possível carregar as atividades deste repositório.");
        }

        const prsData = await prsRes.json();
        const issuesData = await issuesRes.json();

        let formattedPrs: pullRequest[] = prsData.map((pr: any) => ({
          id: pr.id,
          number: pr.number,
          title: pr.title,
          author: pr.user?.login || "desconhecido",
          state: pr.merged_at ? "merged" : pr.state,
          createdAt: new Date(pr.created_at).toLocaleDateString("pt-BR"),
          commentsCount: pr.comments || 0,
        }));

        let formattedIssues: issue[] = issuesData
          .filter((item: any) => !item.pull_request)
          .map((item: any) => ({
            id: item.id,
            number: item.number,
            title: item.title,
            author: item.user?.login || "desconhecido",
            state: item.state,
            labels: item.labels?.map((l: any) => l.name) || [],
            createdAt: new Date(item.created_at).toLocaleDateString("pt-BR"),
            commentsCount: item.comments || 0,
          }));

        setPrs(formattedPrs);
        setIssues(formattedIssues);
        
        const chartMap: Record<string, { date: string; prs: number; issues: number }> = {};
        
        prsData.forEach((pr: any) =>{
          const date = new Date(pr.created_at).toLocaleDateString("pt-br");
          if (!chartMap[date]) {
            chartMap[date] = { date, prs: 0, issues: 0 };
          }
          chartMap[date].prs += 1;
        });

        issuesData.filter((item: any) => !item.pull_request).forEach((issue: any) => {
          const date = new Date(issue.created_at).toLocaleDateString("pt-BR");
          if (!chartMap[date]) {
            chartMap[date] = { date, prs: 0, issues: 0 };
          }
          chartMap[date].issues += 1;
        });

        const aggregatedChartData = Object.values(chartMap).sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split("/").map(Number);
          const [dayB, monthB, yearB] = b.date.split("/").map(Number);
          return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
        });

        setChartData(aggregatedChartData);
        const heatMap: Record<string, number> = {};
        prsData.forEach((pr: any) => {
          if (pr.created_at) {
            const dateStr = pr.created_at.split("T")[0];
            heatMap[dateStr] = (heatMap[dateStr] || 0) + 1;
          }
        });

        issuesData
          .filter((item: any) => !item.pull_request)
          .forEach((issue: any) => {
            if (issue.created_at) {
              const dateStr = issue.created_at.split("T")[0];
              heatMap[dateStr] = (heatMap[dateStr] || 0) + 1;
            }
          });

        const formattedHeatmap = Object.entries(heatMap).map(([date, count]) => ({
          date,
          count,
        }));

        setHeatmapData(formattedHeatmap);

      } catch (err: any) {
        setError(err.message || "Erro ao buscar informações.");
      } finally {
        setLoading(false);
      }
    }

    if (repo) {
      fetchData();
    }
  }, [repo, since, until, author]);

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-10 text-center text-zinc-500 shadow-sm animate-pulse">
        <Spinner size="lg" />
        <p className="text-sm">
          Carregando atividades de{" "} 
          <span className="font-semibold text-black">{repo}</span>...
        </p>
      </div>
    );
  }

  return (
    <>
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      <ContributionHeatmap values={heatmapData} />
      <div className="flex justify-end mb-4">
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsChartOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Ver gráfico de produtividade</span>
          </button>
      </div>
      {isCHartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white"> Evolução de Produtividade </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Métricas agrupadas de Pull Requests e Issues para <span className="font-semibold text-zinc-700 dark:zinc-300">{repo}</span>
                </p>
              </div>
              <button onClick={() => setIsChartOpen(false)}
              className="p-1.5 text-zinc-500 hover-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <ProductivityChart data={chartData} />
            </div>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-4 pt-2">
          <button
            onClick={() => setActiveTab("prs")}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              activeTab === "prs"
                ? "border-black dark:border-white text-black dark:text-white bg-white dark:bg-zinc-900 rounded-t-lg border-t border-l border-r border-zinc-200 dark:border-zinc-800 -mb-px"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <span>Pull Requests</span>
            <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded-full font-medium">
              {prs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("issues")}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              activeTab === "issues"
                ? "border-black dark:border-white text-black dark:text-white bg-white dark:bg-zinc-900 rounded-t-lg border-t border-l border-r border-zinc-200 dark:border-zinc-800 -mb-px"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <span>Issues</span>
            <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded-full font-medium">
              {issues.length}
            </span>
          </button>
        </div>

        <div>
          {activeTab === "prs" ? <PullRequestList prs={prs} /> : <IssueList issues={issues} />}
        </div>
      </div>
    </>
  );
}