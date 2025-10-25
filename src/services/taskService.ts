// src/services/taskService.ts
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

export type MyTaskDto = {
  id: number
  projectId: number
  projectKey: string
  key: string
  title: string
  description?: string | null
  type: string
  status: string
  priorities: string
  estimatePoints?: number | null
  actualPoints?: number | null
  startDate?: string | null
  dueDate?: string | null
  finishedAt?: string | null
  assignedToId?: number | null
  assignedToName?: string | null
  auditedById?: number | null
  auditedByName?: string | null
  createdById?: number | null
  createdByName?: string | null
  updatedById?: number | null
  createdAt: string
  updatedAt: string
}

type ApiList<T> = { message: string; items: T[] }

type ApiItem<T> = { message: string; item: T }

export async function getTaskByIdService(taskId: number): Promise<ApiItem<MyTaskDto>> {
  const accessToken = (await cookies()).get("accessToken")?.value
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Failed to fetch task (${res.status})`)
  return res.json()
}

export async function getMyWorkingTasksService(): Promise<ApiList<MyTaskDto>> {
  const accessToken = (await cookies()).get("accessToken")?.value
  const res = await fetch(`${API_URL}/tasks/my-working`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Failed to fetch my working tasks (${res.status})`)
  return res.json()
}

export async function getMyPendingReviewTasksService(): Promise<ApiList<MyTaskDto>> {
  const accessToken = (await cookies()).get("accessToken")?.value
  const res = await fetch(`${API_URL}/tasks/pending-review`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Failed to fetch my pending reviews (${res.status})`)
  return res.json()
}

// ตัวห่อให้หน้า /tasks ใช้ชื่อเดิมต่อได้
export async function getMyWorkService(): Promise<{ active: MyTaskDto[]; review: MyTaskDto[] }> {
  const [active, review] = await Promise.all([
    getMyWorkingTasksService(),
    getMyPendingReviewTasksService(),
  ])
  return { active: active.items ?? [], review: review.items ?? [] }
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

