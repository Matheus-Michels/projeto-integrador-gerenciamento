"use client";

import { useState, useMemo } from "react";

export interface issue {
  id: number;
  number: number;
  title: string;
  author: string;
  state: "open" | "closed";
  labels: string[];
  createdAt: string;
  commentsCount: number;
}

interface issueListProps {
  issues: issue[];
}

type SortField = "date" | "author" | "comments";
type SortOrder = "asc" | "desc";

export default function IssueList({ issues }: issueListProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "author" ? "asc" : "desc");
    }
    setCurrentPage(1);
  };

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = a.number - b.number;
      } else if (sortField === "author") {
        comparison = a.author.localeCompare(b.author);
      } else if (sortField === "comments") {
        comparison = a.commentsCount - b.commentsCount;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [issues, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedIssues.length / itemsPerPage) || 1;
  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedIssues.slice(start, start + itemsPerPage);
  }, [sortedIssues, currentPage]);

  if(!issues || issues.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        Nenhuma issue encontrada para este repositório.
      </div>
    );
  }
  return (
    <div>
      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Ordenar por:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSort("date")}
            className={`px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
              sortField === "date"
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            Data / Número {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            type="button"
            onClick={() => handleSort("author")}
            className={`px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
              sortField === "author"
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            Autor {sortField === "author" && (sortOrder === "asc" ? "A-Z" : "Z-A")}
          </button>
          <button
            type="button"
            onClick={() => handleSort("comments")}
            className={`px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
              sortField === "comments"
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            Comentários {sortField === "comments" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

    <div className="divide-y divide-zinc-200">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors duration-150"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  issue.state === "open"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-zinc-100 text-zinc-700 border-zinc-200"
                }`}
              >
                {issue.state === "open" ? "Aberta" : "Fechada"}
              </span>
              <span className="font-medium text-black tracking-tight text-sm md:text-base">
                {issue.title}
              </span>
              <span className="text-xs text-zinc-400">#{issue.number}</span>

              {issue.labels.map((label) => (
                <span
                  key={label}
                  className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              Aberta por <span className="font-medium text-zinc-700">{issue.author}</span> • {issue.createdAt}
            </p>
          </div>

          <div className="flex items-center text-xs text-zinc-400">
            💬 {issue.commentsCount}
          </div>
        </div>
      ))}
    </div>

    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
        <span className="text-zinc-500 dark:text-zinc-400">
          Página <strong className="text-black dark:text-white">{currentPage}</strong> de{" "}
          <strong className="text-black dark:text-white">{totalPages}</strong> (
          {sortedIssues.length} total)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg font-medium text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Anterior
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg font-medium text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}