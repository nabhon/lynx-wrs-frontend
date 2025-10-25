// src/app/[project_name]/users/page.tsx
"use client";

import AddMemberButton from "./add-member-button"; // 👈 ปุ่มเพิ่มสมาชิก
import { useProjectUsers } from "@/providers/projectUserProvider"
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { DataTablePagination } from "@/app/[project_name]/tasks/data-table-pagination";
import {
  useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, type ColumnDef,
} from "@tanstack/react-table";

export default function ProjectUsersPage() {
  const { members, loading, error, removeMember, projectId, refresh, projectName } = useProjectUsers();

  const columns: ColumnDef<any>[] = [
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "role", header: "Role", cell: ({ row }) => <span>{row.original.role}</span> },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remove {row.original.name} from project?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will only remove the user from this project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeMember(row.original.id)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center w-full mb-2">
        <h1 className="text-2xl font-bold flex-1">{projectName ?? "Project"} — Members</h1>
        {projectId && (
          <AddMemberButton
            projectId={projectId}
            currentMembers={members ?? []}
            onAdded={refresh}
          />
        )}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="border-b">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-muted/30">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <DataTablePagination table={table} />
    </div>
  );
}
