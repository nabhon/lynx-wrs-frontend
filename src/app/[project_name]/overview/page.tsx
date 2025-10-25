"use client";
import DueTable from "./due-table";
import { useProject } from "@/providers/ProjectProvider"
import TaskOverviewCards from "@/components/task-overview";

export default function Page() {
    const { project, loading, error } = useProject();
    if (loading) return <div></div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>No project found</div>;
  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-12 gap-4 h-fit">
            <div className="flex col-span-12">
                <TaskOverviewCards tasks={project!.items as any} />
            </div>
            <div className="flex flex-row col-span-6 gap-4 ">
                <div className="bg-mute shadow-lg p-4 flex-1 rounded-xl border border-primary overflow-auto">
                    <DueTable />
                </div>
            </div>
            <div className="bg-red-500 h-full col-span-6 rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
  )
}
