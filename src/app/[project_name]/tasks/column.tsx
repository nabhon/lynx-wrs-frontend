"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { priorities, statuses } from "./data/data"
import { Task } from "./data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { useParams, useRouter } from "next/navigation"

function TitleCell({ row }: { row: any }) {
  const router = useRouter()
  const params = useParams()
  const slug = params?.project_name as string

  return (
    <button
      className="text-primary underline text-left truncate min-w-[500px] font-medium"
      onClick={(e) => {
        e.stopPropagation()
        router.push(`/${slug}/tasks/${row.original.id}`)
      }}
      title={row.original.title}
    >
      {row.original.title}
    </button>
  )
}

export const columns: ColumnDef<Task>[] = [
   {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },{
    accessorKey: "cycleCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cycle" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("cycleCount") ?? "-"}</div>
    ),
    filterFn: (row, id, value) => {
      const values = (row.getValue(id))
      return value.includes(values)
    },
  },

  // ✅ Sprint
  {
    accessorKey: "sprintCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sprint" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("sprintCount") ?? "-"}</div>
    ),
    filterFn: (row, id, filterValues) => {
      const value = row.getValue(id)
      return filterValues.includes(value)
    },
  },
  // ✅ Task ID
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => <div className="w-[40px]">{row.getValue("key")}</div>,
    enableSorting: false,
    enableHiding: false,
  },

  // ✅ Type
  {
    accessorKey: "type",
    header: ({ column}) => (
      <DataTableColumnHeader column={column} title="Type" />
      ),
    cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    enableHiding: true,
    enableSorting: false,
  },
  // ✅ Title
 {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <TitleCell row={row} />, // ⬅️ ใช้คอมโพเนนต์ใหม่
    enableSorting: false,
  },
  // ✅ Assigned To
  {
    accessorKey: "assignedToName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <span className="truncate font-medium">{row.getValue("assignedToName")}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  // ✅ Auditor
  {
    accessorKey: "auditedByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auditor" />
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <span className="truncate font-medium">{row.getValue("auditedByName")}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  // ✅ Status
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )
      if (!status) return null
      return (
        <div className="flex w-[120px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },

  // ✅ Priority
  {
    accessorKey: "priorities",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priorities")
      )
      if (!priority) return null
      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
  },

  // ✅ Estimate Points
  {
    accessorKey: "estimatePoints",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estimate Points" />
    ),
    cell: ({ row }) => <div>{row.getValue("estimatePoints") ?? "-"}</div>,
  },

  // ✅ Actual Points
  {
    accessorKey: "actualPoints",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actual Points" />
    ),
    cell: ({ row }) => <div>{row.getValue("actualPoints") ?? "-"}</div>,
  },

  // ✅ Start Date
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("startDate") as unknown as string | number | Date | null
      return <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
    },
  },

  // ✅ Due Date
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as unknown as string | number | Date | null
      return <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
    },
  },

  // ✅ Finished At
  {
    accessorKey: "finishedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Finished At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("finishedAt") as unknown as string | number | Date | null
      return <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
    },
  },

  // ✅ Actions
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
