"use client";

type TaskStatsCardProps = {
  title: string;
  count: number;
  color?: string;
};

export function TaskStatsCard({ title, count, color }: TaskStatsCardProps) {
  return (
    <div
      className={`relative col-span-3 p-4 shadow-lg rounded-2xl flex flex-1 flex-col min-h-[15vh] border border-primary bg-white`}
    >
      <span className="absolute left-4 top-4 text-lg font-bold">{title}</span>
      <div className="flex-1 flex items-center justify-center">
        <span className={`font-bold text-4xl ${color ?? ""}`}>{count}</span>
      </div>
    </div>
  );
}
