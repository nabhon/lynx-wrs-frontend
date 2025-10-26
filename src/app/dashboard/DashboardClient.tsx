// src/app/dashboard/DashboardClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "@/providers/SessionProvider";

import { TaskSummaryChart } from "@/components/dashboard/TaskSummaryChart";
import { StatCard } from "@/components/dashboard/StatCard"; // ✅ ใช้แทน DashboardCards

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CircleAlert,
  Clock4,
  CheckCheck,
  ListTodo,
  Users,
  Folder,
  PlayCircle,
  AlertTriangle,
} from "lucide-react";
import type { MyTaskDto } from "@/services/taskService";

// recharts (client-only)
const UserGrowthChart = dynamic(
  () =>
    import("@/components/dashboard/UserGrowthChart").then(
      (m) => m.UserGrowthChart
    ),
  { ssr: false }
);
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Legend as RLegend,
} from "recharts";

// ---------- helpers ----------
function isNotDone(t: MyTaskDto) {
  return t.status !== "DONE" && t.status !== "CANCELED";
}
function isActive(t: MyTaskDto) {
  return !["DONE", "BLOCKED", "CANCELED"].includes(t.status);
}
function isOverdue(t: MyTaskDto, now = new Date()) {
  return isNotDone(t) && t.dueDate && new Date(t.dueDate) < now;
}
function isDueSoon(t: MyTaskDto, now = new Date()) {
  if (!isNotDone(t) || !t.dueDate) return false;
  const due = new Date(t.dueDate);
  const diff = due.getTime() - now.getTime();
  return diff >= 0 && diff <= 2 * 24 * 60 * 60 * 1000; // 48h
}

// ---------- main component ----------
export default function DashboardClient({
  overview,
  growth,
  myWorking,
  myPending,
}: {
  overview: {
    totalUsers: number;
    totalProjects: number;
    activeTasks: number;
    overdueTasks: number;
  };
  growth: { month: number; count: number }[];
  myWorking: MyTaskDto[];
  myPending: MyTaskDto[];
}) {
  const { user } = useSession();
  const role = user?.role ?? "USER";
  const isAdmin = role === "ADMIN";

  // ---------------- ADMIN UI ----------------
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [growthData, setGrowthData] = useState(growth);
  const [loadingGrowth, setLoadingGrowth] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoadingGrowth(true);
      try {
        const { getUserGrowth } = await import("@/services/dashboardService");
        const res = await getUserGrowth(year);
        setGrowthData(res.items);
      } finally {
        setLoadingGrowth(false);
      }
    })();
  }, [year, isAdmin]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // ---------------- USER/MOD UI ----------------
  const now = new Date();
  const userStats = useMemo(() => {
    const total = myWorking.filter(isNotDone).length;
    const dueSoon = myWorking.filter((t) => isDueSoon(t, now)).length;
    const overdue = myWorking.filter((t) => isOverdue(t, now)).length;
    const awaitReview = (myPending ?? []).length;
    return { total, dueSoon, overdue, awaitReview };
  }, [myWorking, myPending]);

  const deadlines = useMemo(() => {
    const rows = myWorking
      .filter(isNotDone)
      .filter((t) => t.dueDate)
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 8);
    return rows;
  }, [myWorking]);

  const pieData = useMemo(() => {
    const by = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0 };
    myWorking.forEach((t) => {
      if (t.status in by) (by as any)[t.status] += 1;
    });
    return [
      { name: "TODO", value: by.TODO },
      { name: "IN_PROGRESS", value: by.IN_PROGRESS },
      { name: "REVIEW", value: by.REVIEW },
    ];
  }, [myWorking]);

  // ---------------- RENDER ----------------
  if (isAdmin) {
    // ✅ ADMIN DASHBOARD (ใช้ StatCard)
    return (
      <div className="space-y-6">
        {/* แถวการ์ด 4 ใบ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            title="Users"
            value={overview.totalUsers}
          />
          <StatCard
            icon={<Folder className="h-5 w-5" />}
            title="Projects"
            value={overview.totalProjects}
          />
          <StatCard
            icon={<PlayCircle className="h-5 w-5" />}
            title="Active works"
            value={overview.activeTasks}
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Overdue works"
            value={overview.overdueTasks}
          />
        </div>

        {/* แถวกราฟ */}
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
              {loadingGrowth ? (
                <div className="h-full grid place-items-center text-sm text-neutral-500">
                  Loading…
                </div>
              ) : (
                <UserGrowthChart data={growthData} />
              )}
            </div>
          </section>

          {/* Active vs Overdue (ทั้งระบบ) */}
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

  // ✅ USER / MODERATOR DASHBOARD
  return (
    <div className="space-y-6">
      {/* แถวการ์ด 4 ใบ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={<ListTodo className="h-5 w-5" />}
          title="Total Tasks"
          value={userStats.total}
        />
        <StatCard
          icon={<Clock4 className="h-5 w-5" />}
          title="Due Soon"
          value={userStats.dueSoon}
        />
        <StatCard
          icon={<CircleAlert className="h-5 w-5" />}
          title="Overdue"
          value={userStats.overdue}
        />
        <StatCard
          icon={<CheckCheck className="h-5 w-5" />}
          title="Await review"
          value={userStats.awaitReview}
        />
      </div>

      {/* ตาราง + กราฟพาย */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-violet-200/70 bg-white shadow-[0_2px_14px_rgba(124,58,237,0.08)] p-5">
          <h2 className="text-[15px] font-semibold text-neutral-800 mb-3">
            Upcoming Deadlines
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-violet-50/60 text-neutral-700">
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Assignee</th>
                  <th className="px-3 py-2 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {deadlines.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-8 text-center text-neutral-500"
                    >
                      No upcoming deadlines
                    </td>
                  </tr>
                )}
                {deadlines.map((t) => {
                  const overdue = isOverdue(t, now);
                  return (
                    <tr
                      key={t.id}
                      className={cn(
                        "border-b last:border-0",
                        overdue && "bg-red-50/60"
                      )}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-800">
                            {t.title}
                          </span>
                          {overdue && (
                            <Badge variant="destructive" className="h-5">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">{t.assignedToName ?? "-"}</td>
                      <td className="px-3 py-2 text-red-600 tabular-nums">
                        {t.dueDate ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pie Chart */}
        <section className="rounded-2xl border border-violet-200/70 bg-white shadow-[0_2px_14px_rgba(124,58,237,0.08)] p-5">
          <h2 className="text-[15px] font-semibold text-neutral-800 mb-3">
            Task Status
          </h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  label
                >
                  <Cell fill="#60a5fa" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#22c55e" />
                </Pie>
                <RTooltip />
                <RLegend />
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
