"use client";
import { useState, useEffect } from "react";
import PullRequestList, { pullRequest } from "./pullRequestList";
import IssueList, { issue } from "./issueList";
import Toast from "./toast";
import Spinner from "./spinner";

type TabType = "prs" | "issues";

interface ActivityTabsProps {
  repo: string;
}

export default function ActivityTabs({ repo }: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("prs");
  const [prs, setPrs] = useState<pullRequest[]>([]);
  const [issues, setIssues] = useState<issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [prsRes, issuesRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${repo}/pulls?state=all&per_page=100`),
          fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100`)
        ]);

        if (!prsRes.ok || !issuesRes.ok) {
          throw new Error("Não foi possível carregar as atividades deste repositório.");
        }

        const prsData = await prsRes.json();
        const issuesData = await issuesRes.json();

        const formattedPrs: pullRequest[] = prsData.map((pr: any) => ({
          id: pr.id,
          number: pr.number,
          title: pr.title,
          author: pr.user?.login || "desconhecido",
          state: pr.merged_at ? "merged" : pr.state,
          createdAt: new Date(pr.created_at).toLocaleDateString("pt-BR"),
          commentsCount: pr.comments || 0,
        }));

        const formattedIssues: issue[] = issuesData
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
      } catch (err: any) {
        setError(err.message || "Erro ao buscar informações.");
      } finally {
        setLoading(false);
      }
    }

    if (repo) {
      fetchData();
    }
  }, [repo]);

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