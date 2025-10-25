// src/app/tasks/[taskId]/page.tsx
import { getTaskByIdService } from "@/services/taskService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type PageProps = { params: { taskId: string } }

export default async function TaskDetailPage({ params }: PageProps) {
  const id = Number(params.taskId)
  const { item: t } = await getTaskByIdService(id)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t.key} — {t.title}
        </h1>
        <Badge variant="secondary">{t.status}</Badge>
      </div>

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

      {t.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{t.description}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <Link href="/tasks" className="text-sm underline underline-offset-4">
          ← Back to My Work
        </Link>
      </div>
    </div>
  )
}
