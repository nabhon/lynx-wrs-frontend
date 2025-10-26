"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useProject } from "@/providers/ProjectProvider";

const STATUS_COLORS: Record<string, string> = {
  TODO: "#60a5fa",         
  IN_PROGRESS: "#facc15",  
  REVIEW: "#34d399",       
  BLOCKED: "#f87171",    
  OTHER: "#a78bfa",       
};

export default function TaskStatusPieChart() {
  const { project, loading, error } = useProject();

  const data = useMemo(() => {
    if (!project?.items) return [];

    // Filter out DONE and CANCEL tasks
    const filtered = project.items.filter(
      (t) => t.status !== "DONE" && t.status !== "CANCEL"
    );

    // Count tasks by status
    const countMap: Record<string, number> = {};
    filtered.forEach((t) => {
      countMap[t.status] = (countMap[t.status] || 0) + 1;
    });

    return Object.entries(countMap).map(([status, value]) => ({
      name: status,
      value,
    }));
  }, [project]);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-red-500">Error loading chart</div>;
  if (!data.length) return <div>No active tasks</div>;

  return (
    <div className="w-full h-[350px] select-none pointer-events-none">
      <ResponsiveContainer>
        <PieChart className="py-4">
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || STATUS_COLORS.OTHER}
              />
            ))}
          </Pie>
          <Tooltip wrapperStyle={{ pointerEvents: "auto" }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
