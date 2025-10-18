"use client";
import { columns } from "./column";
import { DataTable } from "./data-table";
import { useProject } from "@/providers/ProjectProvider";


export default function TaskPage() {
  const { project, loading, error } = useProject();

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>No project data found.</p>;

  const tasks = project.items;

  return (
    <>
      <div className="md:hidden"></div>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
