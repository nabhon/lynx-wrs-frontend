import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
//export const taskSchema = z.object({
//  id: z.string(),
//  title: z.string(),
//  status: z.string(),
//  label: z.string(),
//  priority: z.string(),
//})

export const taskSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  cycle_id: z.number(),     // allow null if optional
  sprint_id: z.number(),    // allow null if optional
  key: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  type: z.string(),                    // replaces old "label"
  status: z.string(),
  priorities: z.string(),              // matches your JSON field
  estimate_points: z.number().nullable(),
  actual_points: z.number().nullable(),
  start_date: z.string().nullable(),
  due_date: z.string().nullable(),
  finished_at: z.string().nullable(),
  assigned_to_id: z.number().nullable(),
  assigned_to_name: z.string().nullable(),
  audited_by_id: z.number().nullable(),
  audited_by_name: z.string().nullable(),
  created_by_name: z.string().nullable(),
  created_by_id: z.number().nullable(),
  updated_by_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
})

export type Task = z.infer<typeof taskSchema>