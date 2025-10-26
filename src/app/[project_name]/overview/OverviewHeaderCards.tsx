"use client";

import { AlarmClock, AlertTriangle, CheckCircle2, ListTodo } from "lucide-react";
import {StatCard} from "@/components/dashboard/StatCard";

type TaskItem = {
  id: number;
  title: string;
  status: string;          // TODO | IN_PROGRESS | REVIEW | DONE | CANCELED | ...
  dueDate?: string | null; // ISO
};

export default function OverviewHeaderCards({ tasks }: { tasks: TaskItem[] }) {
  const now = new Date();

  const notDone = (t: TaskItem) => t.status !== "DONE" && t.status !== "CANCELED";

  const totalTasks = tasks.length;
  const overdue = tasks.filter(
    (t) => notDone(t) && t.dueDate && new Date(t.dueDate) < now
  ).length;
  const dueSoon = tasks.filter((t) => {
    if (!notDone(t) || !t.dueDate) return false;
    const d = new Date(t.dueDate).getTime();
    return d >= now.getTime() && d - now.getTime() <= 2 * 24 * 60 * 60 * 1000; // within 2 days
  }).length;
  const completed = tasks.filter((t) => t.status === "DONE").length;

  const items = [
    { title: "Total Tasks", value: totalTasks, icon: <ListTodo className="h-6 w-6" /> },
    { title: "Due Soon", value: dueSoon, icon: <AlarmClock className="h-6 w-6" /> },
    { title: "Overdue", value: overdue, icon: <AlertTriangle className="h-6 w-6" /> },
    { title: "Completed", value: completed, icon: <CheckCircle2 className="h-6 w-6" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <StatCard
          title={it.title}
          value={it.value}
          icon={it.icon}
        />
      ))}
    </div>
  );
}
