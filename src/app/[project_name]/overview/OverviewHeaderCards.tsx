"use client";

import { AlarmClock, AlertTriangle, CheckCircle2, ListTodo } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

// ใช้ type เดียวกับ Task ใน ProjectProvider
type TaskItem = {
  id: number;
  title: string;
  status: string;          // TODO | IN_PROGRESS | REVIEW | DONE | CANCELED | ...
  dueDate?: string | null; // ISO
};

export default function OverviewHeaderCards({ tasks }: { tasks: TaskItem[] }) {
  const now = new Date();

  const notDone = (t: TaskItem) => t.status !== "DONE" && t.status !== "CANCELED";

  const totalTasks   = tasks.length;
  const overdue      = tasks.filter(t => notDone(t) && t.dueDate && new Date(t.dueDate) < now).length;
  const dueSoon      = tasks.filter(t => {
    if (!notDone(t) || !t.dueDate) return false;
    const d = new Date(t.dueDate).getTime();
    return d >= now.getTime() && d - now.getTime() <= 2 * 24 * 60 * 60 * 1000; // 2 วัน
  }).length;
  const completed    = tasks.filter(t => t.status === "DONE").length;

  const items = [
    { title: "Total Tasks", value: totalTasks, Icon: ListTodo },
    { title: "Due Soon",    value: dueSoon,    Icon: AlarmClock },
    { title: "Overdue",     value: overdue,    Icon: AlertTriangle },
    { title: "Completed",   value: completed,  Icon: CheckCircle2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <StatCard key={it.title} title={it.title} value={it.value} Icon={it.Icon} />
      ))}
    </div>
  );
}
