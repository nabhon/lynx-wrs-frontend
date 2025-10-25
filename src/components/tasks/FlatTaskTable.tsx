"use client";

import * as React from "react";
import type { MyTaskDto } from "@/services/taskService";
import { cn } from "@/lib/utils";
import TaskDetailDialog from "./TaskDetailDialog";

export default function FlatTaskTable({ items }: { items: MyTaskDto[] }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<MyTaskDto | null>(null);

  if (!items?.length) {
    return <p className="text-sm text-muted-foreground">No tasks at the moment</p>;
  }

  const handleRowClick = (task: MyTaskDto) => {
    setSelected(task);
    setOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-4 py-2 text-left w-[120px]">Project</th>
              <th className="px-4 py-2 text-left w-[80px]">Key</th>
              <th className="px-4 py-2 text-left w-[260px]">Title</th>
              <th className="px-4 py-2 text-left w-[120px]">Status</th>
              <th className="px-4 py-2 text-left w-[160px]">Assignee</th>
              <th className="px-4 py-2 text-left w-[160px]">Auditor</th>
              <th className="px-4 py-2 text-left w-[120px]">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr
                key={t.id}
                onClick={() => handleRowClick(t)}
                className={cn(
                  "border-b cursor-pointer transition-colors hover:bg-muted/30 active:bg-muted/50"
                )}
              >
                <td className="px-4 py-2">{t.projectKey}</td>
                <td className="px-4 py-2">{t.key}</td>
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2">{t.status}</td>
                <td className="px-4 py-2">{t.assignedToName ?? "-"}</td>
                <td className="px-4 py-2">{t.auditedByName ?? "-"}</td>
                <td className="px-4 py-2">{t.dueDate ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TaskDetailDialog open={open} onOpenChange={setOpen} task={selected} />
    </>
  );
}
