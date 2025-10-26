"use client";

import { type LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: number | string | undefined | null;
  Icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-violet-200/60 bg-white/90 shadow-sm px-5 py-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
        <Icon className="h-5 w-5 text-violet-600" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-3xl font-semibold">
          {Number(value ?? 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
