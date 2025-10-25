// src/components/tasks/TaskTabs.tsx
"use client"

import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import type { MyTaskDto } from "@/services/taskService"

function TaskTable({ data }: { data: MyTaskDto[] }) {
  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No tasks at the moment</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">All Tasks</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-4 py-2 text-left w-[120px]">Project</th>
              <th className="px-4 py-2 text-left w-[80px]">Key</th>
              <th className="px-4 py-2 text-left w-[260px]">Name</th>
              <th className="px-4 py-2 text-left w-[120px]">Status</th>
              <th className="px-4 py-2 text-left w-[160px]">Assignee</th>
              <th className="px-4 py-2 text-left w-[160px]">Auditor</th>
              <th className="px-4 py-2 text-left w-[120px]">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t.id} className="border-b hover:bg-muted/20">
                <td className="px-4 py-2">{t.projectKey}</td>
                <td className="px-4 py-2">
                  <Link href={`/tasks/${t.id}`} className="underline underline-offset-2 hover:opacity-80">
                    {t.key}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <Link href={`/tasks/${t.id}`} className="hover:underline">
                    {t.title}
                  </Link>
                </td>
                <td className="px-4 py-2">{t.status}</td>
                <td className="px-4 py-2">{t.assignedToName ?? "-"}</td>
                <td className="px-4 py-2">{t.auditedByName ?? "-"}</td>
                <td className="px-4 py-2">{t.dueDate ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default function TaskTabs({
  active,
  review,
}: {
  active: MyTaskDto[]
  review: MyTaskDto[]
}) {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList>
        <TabsTrigger value="active">My Tasks</TabsTrigger>
        <TabsTrigger value="review">Pending Review</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-4">
        <TaskTable data={active} />
      </TabsContent>

      <TabsContent value="review" className="mt-4">
        <TaskTable data={review} />
      </TabsContent>
    </Tabs>
  )
}
