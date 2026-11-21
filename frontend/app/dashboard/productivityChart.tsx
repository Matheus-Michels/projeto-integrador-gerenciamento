"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from 'recharts';

export interface ProductivityChartsProps {
    data: {date: string; prs: number; issues: number;}[];
}

export default function ProductivityChart({ data }: ProductivityChartsProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
        Evolução da Produtividade
      </h3>

      {data.length === 0 ? (
        <p className="h-72 flex items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
          Sem dados para o período selecionado.
        </p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="date" stroke="#888888" fontSize={12} interval="preserveStartEnd" />
              <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="prs" name="Pull Requests" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="issues" name="Issues" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}