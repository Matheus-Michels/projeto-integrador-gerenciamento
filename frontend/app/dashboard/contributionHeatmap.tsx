"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface HeatmapValue {
  date: string;
  count: number;
}

interface ContributionHeatmapProps {
  values: HeatmapValue[];
  endDate?: Date;
}

export default function ContributionHeatmap({ values, endDate = new Date() }: ContributionHeatmapProps) {
  const end = endDate ?? new Date();
  const startDate = new Date(end);
  startDate.setMonth(startDate.getMonth() - 6);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm my-4">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        Mapa de Calor de Contribuições
      </h3>
      
      <div className="heatmap-container overflow-x-auto pb-2">
        {values.length === 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            Nenhuma contribuição no período.
          </p>
        )}
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          titleForValue={(value) =>
            value && value.count > 0
              ? `${value.count} contribuição(ões) em ${new Date(value.date + "T00:00:00").toLocaleDateString("pt-BR")}`
              : "Sem contribuições"
          }
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return "color-empty";
            }
            if (value.count >= 4) return "color-scale-4";
            if (value.count === 3) return "color-scale-3";
            if (value.count === 2) return "color-scale-2";
            return "color-scale-1";
          }}
          showWeekdayLabels={true}
        />
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>Menos</span>
        <svg width="12" height="12" className="react-calendar-heatmap">
          <rect width="12" height="12" className="color-empty" />
        </svg>
        <svg width="12" height="12" className="react-calendar-heatmap">
          <rect width="12" height="12" className="color-scale-1" />
        </svg>
        <svg width="12" height="12" className="react-calendar-heatmap">
          <rect width="12" height="12" className="color-scale-2" />
        </svg>
        <svg width="12" height="12" className="react-calendar-heatmap">
          <rect width="12" height="12" className="color-scale-3" />
        </svg>
        <svg width="12" height="12" className="react-calendar-heatmap">
          <rect width="12" height="12" className="color-scale-4" />
        </svg>
        <span>Mais</span>
      </div>
      <style jsx global>{`
        .react-calendar-heatmap .color-empty {
          fill: #ebedf0;
        }
        .dark .react-calendar-heatmap .color-empty {
          fill: #27272a;
        }
        .react-calendar-heatmap .color-scale-1 { fill: #9be9a8; }
        .react-calendar-heatmap .color-scale-2 { fill: #40c463; }
        .react-calendar-heatmap .color-scale-3 { fill: #30a14e; }
        .react-calendar-heatmap .color-scale-4 { fill: #216e39; }
        .react-calendar-heatmap rect {
          rx: 2px;
          ry: 2px;
        }
      `}</style>
    </div>
  );
}