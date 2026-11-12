"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

interface ChartData {
    date: string;
    prs: number;
    issues: number;
}

export interface ProductivityChartsProps {
    data: any[];
}

export default function ProductivityChart({ data }: ProductivityChartsProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                Evolução da Produtividade
            </h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                        <YAxis stroke="#888888" fontSize={12} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", color: "#fff", }}
                        />
                        <Line type="monotone" dataKey="prs" name="Pull Requests" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}