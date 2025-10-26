"use client"

import { cn } from "@/lib/utils"

export function StatCard({
  icon,
  title,
  value,
  className,
}: {
  icon: React.ReactNode
  title: string
  value: number | string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border flex flex-row gap-4 border-violet-200/70 bg-white shadow-[0_2px_14px_rgba(124,58,237,0.08)] p-5",
        className
      )}
    >
      <div className="flex h-full items-center justify-between">
        <div className="rounded-full bg-violet-50 text-violet-700">{icon}</div>
      </div>
      <div className="mt-2">
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        <div className="text-sm text-neutral-600">{title}</div>
      </div>
    </div>
  )
}
