"use client";

import * as React from "react";
import type { MyTaskDto } from "@/services/taskService";

export default function FlatTaskTable({ items }: { items: MyTaskDto[] }) {
  if (!items?.length) {
    return <p className="text-sm text-muted-foreground">No tasks at the moment</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-sm table-fixed">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="px-4 py-2 text-left w-[120px]">Project</th>
            <th className="px-4 py-2 text-left w-[90px]">Key</th>
            <th className="px-4 py-2 text-left w-[260px]">Name</th>
            <th className="px-4 py-2 text-left w-[120px]">Status</th>
            <th className="px-4 py-2 text-left w-[180px]">Assignee</th>
            <th className="px-4 py-2 text-left w-[180px]">Auditor</th>
            <th className="px-4 py-2 text-left w-[130px]">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} className="border-b hover:bg-muted/20">
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
  );
}
