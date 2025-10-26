"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { TaskSummaryChart } from "@/components/dashboard/TaskSummaryChart";
import { getUserGrowth } from "@/services/dashboardService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserGrowthChart = dynamic(
  () =>
    import("@/components/dashboard/UserGrowthChart").then(
      (m) => m.UserGrowthChart
    ),
  { ssr: false }
);

export default function DashboardClient({
  overview,
  growth,
}: {
  overview: {
    totalUsers: number;
    totalProjects: number;
    activeTasks: number;
    overdueTasks: number;
  };
  growth: { month: number; count: number }[];
}) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [growthData, setGrowthData] = useState(growth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await getUserGrowth(year);
        setGrowthData(res.items);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [year]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* การ์ด 4 ใบเหมือน overview */}
      <DashboardCards data={overview} />

      {/* แถวกราฟ 2 ใบ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Growth */}

        <section className="rounded-2xl border border-violet-200/70 bg-white shadow-[0_2px_14px_rgba(124,58,237,0.08)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-neutral-800">
              Users Growth
            </h2>
            <Select
              value={String(year)}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="w-[100px] rounded-full border-violet-200 bg-violet-50 text-violet-700 focus:ring-violet-300">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-violet-100 shadow-lg">
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-[280px]">
            {loading ? (
              <div className="h-full grid place-items-center text-sm text-neutral-500">
                Loading…
              </div>
            ) : (
              <UserGrowthChart data={growthData} />
            )}
          </div>
        </section>

        {/* Active vs Overdue ทั้งระบบ */}
        <section className="rounded-2xl border border-violet-200/70 bg-white shadow-[0_2px_14px_rgba(124,58,237,0.08)] p-5">
          <h2 className="text-[15px] font-semibold text-neutral-800 mb-3">
            Tasks Overview
          </h2>
          <div className="h-[280px]">
            <TaskSummaryChart
              active={overview.activeTasks}
              overdue={overview.overdueTasks}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
