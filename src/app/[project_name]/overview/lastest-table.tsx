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
// 🧩 TaskTable Component — show 5 newest tasks
//
const TaskTable = () => {
  const { project, loading } = useProject();

  // 🧠 Compute newest 5 tasks safely
  const newestTasks = useMemo(() => {
    if (!project?.items) return [];
    return [...project.items]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [project]);

  //
  // 🧾 Define columns
  //
  const columns: ColumnDef<TaskItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.title}
        </span>
      ),
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
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  //
  // 🧩 Create table instance
  //
  const table = useReactTable({
    data: newestTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  //
  // 🧭 Conditional rendering
  //
  if (loading)
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );

  if (!project?.items?.length)
    return (
      <p className="text-center text-muted-foreground py-4">
        No tasks found
      </p>
    );

  //
  // 🧱 Render table
  //
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Newest Tasks</h2>
      <table className="w-full border-collapse text-sm">
        <thead className="border-b bg-muted/30">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left px-4 py-2 font-medium"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b hover:bg-muted/20 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;