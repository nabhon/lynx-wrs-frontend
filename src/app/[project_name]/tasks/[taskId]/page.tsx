import { notFound } from "next/navigation"
import { getTaskByIdService } from "@/services/taskService"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProjectTaskDetailPage({
  params,
}: {
  params: { project_name: string; taskId: string }
}) {
  const id = Number(params.taskId)
  const slug = params.project_name
  if (!id || Number.isNaN(id)) return notFound()

  try {
    const res = await getTaskByIdService(id)
    const t = res.item
    if (!t) return notFound()

    return (
      <div className="p-6 space-y-6">
        {/* ✅ ปุ่มกลับ */}
        <div className="flex items-center justify-between">
          <Link href={`/${slug}/tasks`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>

        <h1 className="text-2xl font-bold">
          {t.projectKey} • {t.key} — {t.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-md border p-4 space-y-2">
            <h2 className="font-semibold">Overview</h2>
            <p><span className="font-medium">Status:</span> {t.status}</p>
            <p><span className="font-medium">Priority:</span> {t.priorities}</p>
            <p><span className="font-medium">Assignee:</span> {t.assignedToName ?? "-"}</p>
            <p><span className="font-medium">Auditor:</span> {t.auditedByName ?? "-"}</p>
            <p><span className="font-medium">Start:</span> {t.startDate ?? "-"}</p>
            <p><span className="font-medium">Due:</span> {t.dueDate ?? "-"}</p>
          </div>

          <div className="rounded-md border p-4 space-y-2">
            <h2 className="font-semibold">Points</h2>
            <p><span className="font-medium">Estimate:</span> {t.estimatePoints ?? "-"}</p>
            <p><span className="font-medium">Actual:</span> {t.actualPoints ?? "-"}</p>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-wrap">{t.description ?? "-"}</p>
        </div>
      </div>
    )
  } catch {
    return notFound()
  }
}
