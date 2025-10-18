// src/services/projectService.ts
"use server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type CreateProjectPayload = {
  projectName: string
  projectKey: string
  projectDescription?: string
}

export async function createProjectService(payload: CreateProjectPayload) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value
  try {
    const response = await fetch(`${API_URL}/projects`, {
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
    console.error("createProjectService error:", error)
    throw error
  }
}

export async function getProjectListService() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value
  const res = await fetch(`${API_URL}/projects/list`, {
    method: "GET",
    headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
     },
  });
  if (!res.ok) throw new Error("Failed to fetch project list");
  return res.json();
}

export async function getProjectDataService(projectName: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value
    const res = await fetch(`${API_URL}/projects?projectName=${projectName}`, {
    method: "GET",
    headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
     },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch project data (${res.status})`);
  }

  return res.json();
}
