"use client";
import DueTable from "./due-table";
import { useProject } from "@/providers/ProjectProvider"
import TaskOverviewCards from "@/components/task-overview";
import TaskPieChart from "./task-pie-chart";
import BurndownChart from "./burndown";
import VelocityChart from "./velocity";

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
            <div className="flex flex-row col-span-6 gap-4 ">
                <div className="bg-mute shadow-lg p-4 flex-1 rounded-xl border border-primary overflow-auto relative">
                    <span className="absolute left-4 top-4 text-lg font-semibold">Task Status</span>
                    <TaskPieChart />
                </div>
            </div>
            <div className="flex flex-row col-span-6 gap-4 ">
                <div className="bg-mute shadow-lg p-4 flex-1 rounded-xl border border-primary overflow-auto relative">
                    <span className="absolute left-4 top-4 text-lg font-semibold">Task Status</span>
                    <BurndownChart />
                </div>
            </div>
            <div className="flex flex-row col-span-6 gap-4 ">
                <div className="bg-mute shadow-lg p-4 flex-1 rounded-xl border border-primary overflow-auto relative">
                    <span className="absolute left-4 top-4 text-lg font-semibold">Task Status</span>
                    <VelocityChart />
                </div>
            </div>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
  )
}
