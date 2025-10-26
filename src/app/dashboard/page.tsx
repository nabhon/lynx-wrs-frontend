import { getDashboardOverview, getUserGrowth } from "@/services/dashboardService"
import DashboardClient from "../dashboard/DashboardClient"

export default async function DashboardPage() {
  const overview = await getDashboardOverview()
  const growth = await getUserGrowth(new Date().getFullYear())

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <DashboardClient overview={overview} growth={growth.items} />
    </div>
  )
}
