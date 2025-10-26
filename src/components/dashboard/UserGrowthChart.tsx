"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts"

type Growth = { month: number; count: number }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="rounded-xl border bg-white px-3 py-2 shadow-md">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{p.value} users</div>
    </div>
  )
}

export function UserGrowthChart({ data }: { data: Growth[] }) {
  // map 1..12 -> name + count (เผื่อเดือนไหนไม่มีข้อมูลให้เป็น 0)
  const rows = Array.from({ length: 12 }, (_, i) => {
    const found = data.find((d) => d.month === i + 1)
    return { name: MONTHS[i], count: found?.count ?? 0 }
  })

  return (
    
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ left: 12, right: 12, top: 10, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            >
              {/* แสดงตัวเลขบนจุด */}
              <LabelList dataKey="count" position="top" className="text-[10px]" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
     
    </div>
  )
}

export default UserGrowthChart
