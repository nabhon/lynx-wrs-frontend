"use server"

import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type CreateTaskPayload = {
  projectId: number
  cycleCount: number
  sprintCount: number
  taskKey: string
  taskName: string
  description?: string
  type: string
  status: string
  priority: string
  actualPoints?:number 
  estimatePoints?: number
  startDate?: string
  endDate?: string
  assigneeId?: number
  auditorId?: number
}

export type EditTaskPayload = {
  taskId: number
  projectId: number
  cycleId?: number
  sprintId?: number
  taskKey?: string
  taskName?: string
  description?: string
  type?: string
  status?: string
  priority?: string
  estimatePoints?: number
  actualPoints?: number
  startDate?: string 
  endDate?: string
  assigneeId?: number
  auditorId?: number
}

export async function createTaskService(payload: CreateTaskPayload) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Request failed: ${response.status} - ${errText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("createTaskService error:", error)
    throw error
  }
}


export async function editTaskService(payload: EditTaskPayload) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const response = await fetch(`${API_URL}/tasks`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Request failed: ${response.status} - ${errText}`)
  }

  return await response.json()
}