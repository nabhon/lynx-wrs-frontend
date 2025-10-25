"use client";

import { TaskStatsCard } from "./task-stat-card";

export type TaskItem = {
  id: number;
  title: string;
  status: string; // e.g., "TODO" | "IN_PROGRESS" | "DONE" | "CANCEL"
  dueDate?: string; // ISO string
};

type Props = {
  tasks: TaskItem[];
};

export default function TaskOverviewCards({ tasks }: Props) {
  const now = new Date();

  const notDone = (t: TaskItem) =>
    t.status !== "DONE" && t.status !== "CANCEL";

  const total = tasks.filter(notDone).length;

  const dueSoon = tasks.filter(
    (t) =>
      notDone(t) &&
      t.dueDate &&
      new Date(t.dueDate).getTime() - now.getTime() <= 2 * 24 * 60 * 60 * 1000 &&
      new Date(t.dueDate).getTime() >= now.getTime()
  ).length;

  const overdue = tasks.filter(
    (t) => notDone(t) && t.dueDate && new Date(t.dueDate) < now
  ).length;

  const completed = tasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="flex flex-row flex-1 gap-4">
      <TaskStatsCard title="Total Tasks" count={total} color="" />
      <TaskStatsCard title="Due Soon" count={dueSoon} color="" />
      <TaskStatsCard title="Overdue" count={overdue} color="" />
      <TaskStatsCard title="Completed" count={completed} color="" />
    </div>
  );
}
