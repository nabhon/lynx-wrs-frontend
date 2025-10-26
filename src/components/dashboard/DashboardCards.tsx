"use client";

import { Users, Folder, PlayCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// component card ย่อย (StatCard)
function StatCard({
  icon,
  title,
  value,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-violet-200/70 bg-white shadow-[0_2px_14px_rgba(124,58,237,0.08)] p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-full bg-violet-50 text-violet-700 p-2">{icon}</div>
      </div>
      <div className="mt-2">
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        <div className="text-sm text-neutral-600">{title}</div>
      </div>
    </div>
  );
}

// export หลัก
export function DashboardCards({
  data,
}: {
  data: {
    totalUsers: number;
    totalProjects: number;
    activeTasks: number;
    overdueTasks: number;
  };
}) {
  const items = [
    {
      title: "Users",
      value: data.totalUsers,
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Projects",
      value: data.totalProjects,
      icon: <Folder className="w-5 h-5" />,
    },
    {
      title: "Active works",
      value: data.activeTasks,
      icon: <PlayCircle className="w-5 h-5" />,
    },
    {
      title: "Overdue works",
      value: data.overdueTasks,
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {items.map((it) => (
        <StatCard key={it.title} icon={it.icon} title={it.title} value={it.value} />
      ))}
    </div>
  );
}
