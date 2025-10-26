"use client";
import DueTable from "./due-table";
import { useProject } from "@/providers/ProjectProvider";
import OverviewHeaderCards from "./OverviewHeaderCards";
import TaskPieChart from "./task-pie-chart";
import BurndownChart from "./burndown";
import VelocityChart from "./velocity";

export default function Page() {
  const { project, loading, error } = useProject();
  if (loading) return <div />;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No project found</div>;

  return (
    <div className="flex-1 space-y-6 px-4 md:px-6 pb-6">
      {/* หัวข้อ */}
      <h1 className="text-2xl font-semibold">Overview</h1>

      {/* การ์ด 4 ใบ สไตล์เดียวกับ Dashboard */}
      <OverviewHeaderCards tasks={project.items as any} />

      {/* แถวกราฟ/ตาราง */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="relative lg:col-span-8 rounded-2xl border border-violet-200/60 bg-white/90 shadow-sm p-4">
          <span className="absolute left-4 top-4 text-lg font-semibold">Upcoming Deadlines</span>
          <div className="pt-8">
            <DueTable />
          </div>
        </div>

        <div className="relative rounded-2xl lg:col-span-4 border border-violet-200/60 bg-white/90 shadow-sm p-4">
          <span className="absolute left-4 top-4 text-lg font-semibold">Task Status</span>
          <div className="pt-8">
            <TaskPieChart />
          </div>
        </div>

        <div className="relative rounded-2xl lg:col-span-6 border border-violet-200/60 bg-white/90 shadow-sm p-4">
          <span className="absolute left-4 top-4 text-lg font-semibold">Burndown</span>
          <div className="pt-8">
            <BurndownChart />
          </div>
        </div>

        <div className="relative rounded-2xl lg:col-span-6 border border-violet-200/60 bg-white/90 shadow-sm p-4">
          <span className="absolute left-4 top-4 text-lg font-semibold">Velocity</span>
          <div className="pt-8">
            <VelocityChart />
          </div>
        </div>
      </div>
    </div>
  );
}
