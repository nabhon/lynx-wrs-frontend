// src/app/dashboard/page.tsx
import { getDashboardOverview, getUserGrowth } from "@/services/dashboardService";
import {
  getMyWorkingTasksService,
  getMyPendingReviewTasksService,
  type MyTaskDto,
} from "@/services/taskService";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // ----- ข้อมูลฝั่ง ADMIN (ไม่ใช้ก็ไม่เป็นไรสำหรับ user/mod) -----
  const rawOverview = await getDashboardOverview().catch(() => null);
  const growth = await getUserGrowth(new Date().getFullYear()).catch(() => ({ items: [] as {month:number;count:number}[] }));

  // map เผื่อ backend เปลี่ยนชื่อคีย์
  const overview = {
    totalUsers:
      rawOverview?.totalUsers ??
      rawOverview?.total_users ??
      rawOverview?.users ??
      rawOverview?.userCount ??
      0,
    totalProjects:
      rawOverview?.totalProjects ??
      rawOverview?.total_projects ??
      rawOverview?.projects ??
      rawOverview?.projectCount ??
      0,
    activeTasks:
      rawOverview?.activeTasks ?? rawOverview?.active_tasks ?? rawOverview?.active ?? 0,
    overdueTasks:
      rawOverview?.overdueTasks ?? rawOverview?.overdue_tasks ?? rawOverview?.overdue ?? 0,
  };

  // ----- ข้อมูลฝั่ง USER/MODERATOR -----
  const myWorking = await getMyWorkingTasksService().catch(
    () => ({ items: [] as MyTaskDto[] })
  );
  const myPending = await getMyPendingReviewTasksService().catch(
    () => ({ items: [] as MyTaskDto[] })
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <DashboardClient
        overview={overview}
        growth={growth.items}
        myWorking={myWorking.items ?? []}
        myPending={myPending.items ?? []}
      />
    </div>
  );
}
