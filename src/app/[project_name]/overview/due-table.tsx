"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useProject, TaskItem } from "@/providers/ProjectProvider";
import { Skeleton } from "@/components/ui/skeleton";

//
// Table For upcoming and overdue tasks
//
const DueTable = () => {
  const { project, loading } = useProject();

  // Filter
  const upcomingTasks = useMemo(() => {
    if (!project?.items) return [];

    const now = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(now.getDate() + 2);

    return project.items
      .filter((task) => {
        if (!task.dueDate) return false;
        if (task.status === "DONE" || task.status === "CANCEL") return false;

        const due = new Date(task.dueDate);
        // Include overdue or within 2 days
        return due <= twoDaysLater;
      })
      .sort(
        (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 10);
  }, [project]);

  const columns: ColumnDef<TaskItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const task = row.original;
        const due = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = due && due < new Date();

        return (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"
              }`}
            >
              {task.title}
            </span>
            {isOverdue && (
              <span className="font-light text-red-500 bg-red-100 px-1.5 py-0.5 rounded">
                Overdue
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "assignedToName",
      header: "Assignee",
      cell: ({ row }) => (
        <span className="text-xs font-medium uppercase tracking-wide text-gray-600">
          {row.original.assignedToName || "Unassigned"}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const due = row.original.dueDate ? new Date(row.original.dueDate) : null;
        const now = new Date();
        const isOverdue = due && due < now;
        return (
          <span
            className={`text-xs ${
              isOverdue ? "text-red-500 font-semibold" : "text-muted-foreground"
            }`}
          >
            {due ? due.toLocaleDateString() : "—"}
          </span>
        );
      },
    },
  ];


  const table = useReactTable({
    data: upcomingTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  if (loading)
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );

  if (!upcomingTasks.length)
    return (
      <p className="text-center text-muted-foreground py-4">
        No upcoming or overdue tasks (excluding Done / Cancel)
      </p>
    );


  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
      <table className="w-full border-collapse text-sm">
        <thead className="border-b bg-muted/30">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left px-4 py-2 font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const due = row.original.dueDate
              ? new Date(row.original.dueDate)
              : null;
            const isOverdue = due && due < new Date();

            return (
              <tr
                key={row.id}
                className={`border-b transition-colors ${
                  isOverdue ? "bg-red-50" : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DueTable;
