export interface pullRequest {
  id: number;
  number: number;
  title: string;
  author: string;
  state: "open" | "closed" | "merged";
  createdAt: string;
  commentsCount: number;
}
interface pullRequestListProps {
  prs: pullRequest[];
}

export default function PullRequestList({ prs }: pullRequestListProps) {
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

  if(!prs || prs.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        Nenhum pull request encontrado para este repositório.
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200">
      {prs.map((pr) => (
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