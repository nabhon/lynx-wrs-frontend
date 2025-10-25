"use client";

import * as React from "react";
import type { MyTaskDto } from "@/services/taskService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-2 py-1">
      <div className="col-span-1 text-sm text-muted-foreground">{label}</div>
      <div className="col-span-3 text-sm">{value ?? "-"}</div>
    </div>
  );
}

export default function TaskDetailDialog({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: MyTaskDto | null;
}) {
  const t = task;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-muted-foreground">{t?.projectKey}</span>
            <span className="font-semibold">{t?.key}</span>
            {t?.status && <Badge variant="secondary">{t.status}</Badge>}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Row label="Assignee" value={t?.assignedToName} />
          <Row label="Auditor" value={t?.auditedByName} />
          <Row label="Type" value={t?.type} />
          <Row label="Priority" value={t?.priorities} />
          <Row label="Start Date" value={t?.startDate} />
          <Row label="Due Date" value={t?.dueDate} />
          <Row label="Estimate Points" value={t?.estimatePoints} />
          <Row label="Actual Points" value={t?.actualPoints} />
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-1">Description</div>
            <div className="rounded-md border p-3 text-sm whitespace-pre-wrap min-h-16">
              {t?.description || "—"}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
