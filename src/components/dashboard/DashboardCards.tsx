"use client"

import { Users, Folder, PlayCircle, AlertTriangle } from "lucide-react"

export function DashboardCards({
  data,
}: {
  data: { totalUsers: number; totalProjects: number; activeTasks: number; overdueTasks: number }
}) {
  const items = [
    { title: "Users", value: data.totalUsers, icon: Users },
    { title: "Projects", value: data.totalProjects, icon: Folder },
    { title: "Active works", value: data.activeTasks, icon: PlayCircle },
    { title: "Overdue works", value: data.overdueTasks, icon: AlertTriangle },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-2xl border border-violet-200/70 bg-white shadow-[0_2px_14px_rgba(124,58,237,0.08)] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="grid place-items-center rounded-xl bg-violet-50 text-violet-700 w-10 h-10">
              <it.icon className="w-5 h-5" />
            </div>
            <div className="ml-auto text-4xl font-bold tracking-tight">{it.value}</div>
          </div>
          <div className="mt-2 text-[15px] text-neutral-700">{it.title}</div>
        </div>
      ))}
    </div>
  )
}
