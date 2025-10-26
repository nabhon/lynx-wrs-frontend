import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export function TaskSummaryChart({ active, overdue }: { active: number; overdue: number }) {
  const data = [
    { name: "Active", value: active },
    { name: "Overdue", value: overdue },
  ]
  const COLORS = ["#22c55e", "#ef4444"]

  return (
  
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" label>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
  )
}
