// src/app/tasks/[taskId]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { getTaskByIdService } from "@/services/taskService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type PageProps = { params: { taskId: string } }

export const dynamic = "force-dynamic"

export default async function TaskDetailPage({ params }: PageProps) {
  const id = Number(params.taskId)
  if (!id || Number.isNaN(id)) return notFound()

  try {
    const { item: t } = await getTaskByIdService(id)
    if (!t) return notFound()

    return (
      <div className="p-6 space-y-6">
        {/* Back button */}
        <div className="flex items-center justify-between">
          <Link href="/tasks">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to My Work
            </Button>
          </Link>
        </div>

        {/* Title + status */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {t.projectKey} • {t.key} — {t.title}
          </h1>
          <Badge variant="secondary">{t.status}</Badge>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Project</div>
              <div>{t.projectKey}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Type</div>
              <div>{t.type}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Priority</div>
              <div>{t.priorities}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Status</div>
              <div>{t.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Assignee</div>
              <div>{t.assignedToName ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Auditor</div>
              <div>{t.auditedByName ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Start Date</div>
              <div>{t.startDate ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Due Date</div>
              <div>{t.dueDate ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Estimate / Actual</div>
              <div>
                {t.estimatePoints ?? 0} / {t.actualPoints ?? 0}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Created / Updated</div>
              <div>
                {t.createdAt} / {t.updatedAt}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{t.description ?? "-"}</p>
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    return notFound()
  }
}
