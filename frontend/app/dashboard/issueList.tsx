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

const mockIssues: issue[] = [
  {
    id: 1,
    number: 48,
    title: "Desenvolver Abas de Pull Requests e Issues",
    author: "matheus-michels",
    state: "open",
    labels: ["frontend", "enhancement"],
    createdAt: "há 2 dias",
    commentsCount: 4,
  },
  {
    id: 2,
    number: 46,
    title: "Paginação e Ordenação Dinâmica nas Tabelas",
    author: "matheus-michels",
    state: "open",
    labels: ["backend", "frontend"],
    createdAt: "há 2 dias",
    commentsCount: 2,
  },
  {
    id: 3,
    number: 14,
    title: "Criar ranking de contribuintes",
    author: "matheus-michels",
    state: "open",
    labels: ["frontend"],
    createdAt: "há 2 semanas",
    commentsCount: 0,
  },
];

export default function IssueList() {
  return (
    <div className="divide-y divide-zinc-200">
      {mockIssues.map((issue) => (
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
  );
}