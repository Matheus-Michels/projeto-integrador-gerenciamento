export interface pullRequest {
  id: number;
  number: number;
  title: string;
  author: string;
  state: "open" | "closed" | "merged";
  createdAt: string;
  commentsCount: number;
}

const mockPullRequests: pullRequest[] = [
  {
    id: 1,
    number: 52,
    title: "feat: adiciona componente de abas para PRs e Issues",
    author: "thalesdev",
    state: "open",
    createdAt: "há 2 horas",
    commentsCount: 3,
  },
  {
    id: 2,
    number: 51,
    title: "fix: corrige rotas protegidas e isolamento de layout",
    author: "contributor1",
    state: "merged",
    createdAt: "ontem",
    commentsCount: 1,
  },
  {
    id: 3,
    number: 50,
    title: "refactor: migração para Next.js App Router",
    author: "matheus",
    state: "closed",
    createdAt: "há 3 dias",
    commentsCount: 5,
  },
];

export default function PullRequestList() {
  const getBadgeStyle = (state: pullRequest["state"]) => {
    switch (state) {
      case "open":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "merged":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "closed":
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const getBadgeLabel = (state: pullRequest["state"]) => {
    switch (state) {
      case "open":
        return "Aberto";
      case "merged":
        return "Merged";
      case "closed":
        return "Fechado";
    }
  };

  return (
    <div className="divide-y divide-zinc-200">
      {mockPullRequests.map((pr) => (
        <div
          key={pr.id}
          className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors duration-150"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                  pr.state
                )}`}
              >
                {getBadgeLabel(pr.state)}
              </span>
              <span className="font-medium text-black tracking-tight text-sm md:text-base">
                {pr.title}
              </span>
              <span className="text-xs text-zinc-400">#{pr.number}</span>
            </div>
            <p className="text-xs text-zinc-500">
              Aberto por <span className="font-medium text-zinc-700">{pr.author}</span> • {pr.createdAt}
            </p>
          </div>

          <div className="flex items-center text-xs text-zinc-400">
            💬 {pr.commentsCount}
          </div>
        </div>
      ))}
    </div>
  );
}