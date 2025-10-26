import { getDashboardOverview, getUserGrowth } from "@/services/dashboardService"
import DashboardClient from "../dashboard/DashboardClient"

export default async function DashboardPage() {
  // fetch raw data from API
  const rawOverview = await getDashboardOverview()
  const growth = await getUserGrowth(new Date().getFullYear())

  // Map/massage API response into the shape expected by the client components.
  // This provides robustness when the backend uses slightly different keys.
  const overview = {
    totalUsers:
      rawOverview?.totalUsers ?? rawOverview?.total_users ?? rawOverview?.users ?? rawOverview?.userCount ?? 0,
    totalProjects:
      rawOverview?.totalProjects ?? rawOverview?.total_projects ?? rawOverview?.projects ?? rawOverview?.projectCount ?? 0,
    activeTasks:
      rawOverview?.activeTasks ?? rawOverview?.active_tasks ?? rawOverview?.active ?? 0,
    overdueTasks:
      rawOverview?.overdueTasks ?? rawOverview?.overdue_tasks ?? rawOverview?.overdue ?? 0,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <DashboardClient overview={overview} growth={growth.items} />
    </div>
  )
}
