"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { DataTablePagination } from "@/app/[project_name]/tasks/data-table-pagination";
import { deleteProject } from "@/services/projectService";
import { useProjectList } from "@/providers/ProjectListProvider";

//
// 🧩 Shared type (matches your provider)
//
export type ProjectItem = {
  projectId: number;
  projectKey: string;
  projectName: string;
};

//
// 🧩 ProjectsTable Component
//
const ProjectsTable = () => {
  const { projects: fetchedProjects, loading, error, refreshProjects } =
    useProjectList();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );

  useEffect(() => {
    if (fetchedProjects) setProjects(fetchedProjects);
  }, [fetchedProjects]);

  const handleDelete = async (projectId: number) => {
    setDeleting(true);
    try {
      await deleteProject(projectId);
      await refreshProjects();
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeleting(false);
    }
  };

  //
  // 🧾 Table columns
  //
  const columns: ColumnDef<ProjectItem>[] = [
    {
      accessorKey: "projectName",
      header: "Project Name",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.projectName}
        </span>
      ),
    },
    {
      accessorKey: "projectKey",
      header: "Project Key",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.projectKey}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-start">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSelectedProject(row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete project {row.original.projectName}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The project will be permanently
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleting}
                  onClick={() => handleDelete(row.original.projectId)}
                >
                  {deleting ? "Deleting..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  //
  // 🧠 TanStack Table setup
  //
  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  //
  // 🧭 Conditional rendering
  //
  if (loading) return null;
  if (error)
    return (
      <p className="text-center text-red-500 py-8">Failed to load projects</p>
    );
  if (!projects || projects.length === 0)
    return (
      <p className="text-center text-muted-foreground py-8">
        No projects found
      </p>
    );

  //
  // 🧩 Render table
  //
  return (
    <div className="space-y-4">
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

      {/* ✅ Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
};

export default ProjectsTable;
