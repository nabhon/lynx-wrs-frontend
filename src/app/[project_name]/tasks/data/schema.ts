import { z } from "zod";

export const taskSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  projectKey: z.string(),
  cycleId: z.number(),
  cycleCount: z.number(),
  sprintId: z.number(),
  sprintCount: z.number(),
  key: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  status: z.string(),
  priorities: z.string(),
  estimatePoints: z.number().nullable(),
  actualPoints: z.number().nullable(),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  finishedAt: z.string().nullable(),
  assignedToId: z.number().nullable(),
  assignedToName: z.string().nullable(),
  auditedById: z.number().nullable(),
  auditedByName: z.string().nullable(),
  createdById: z.number().nullable(),
  createdByName: z.string().nullable(),
  updatedById: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;