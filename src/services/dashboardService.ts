"use server"
import { cookies } from "next/headers"
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getDashboardOverview() {
  const accessToken = (await cookies()).get("accessToken")?.value
  const res = await fetch(`${API_URL}/dashboard/overview`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch dashboard overview")
  return res.json()
}

export async function getUserGrowth(year: number) {
  const accessToken = (await cookies()).get("accessToken")?.value
  const res = await fetch(`${API_URL}/dashboard/user-growth?year=${year}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch user growth")
  return res.json()
}
