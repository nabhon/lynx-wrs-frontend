"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { priorities, statuses } from "./data/data"
import { Task } from "./data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Task>[] = [
  // ✅ Row selection column
  { id: "select", 
    header: ({ table }) => (
      <Checkbox 
      checked={ 
        table.getIsAllPageRowsSelected() || 
        (table.getIsSomePageRowsSelected() && "indeterminate") 
      } onCheckedChange={(value) => 
        table.toggleAllPageRowsSelected(!!value)} 
        aria-label="Select all" 
        className="translate-y-[2px]" 
        /> 
      ), 
      cell: ({ row }) => ( 
      <Checkbox 
      checked={row.getIsSelected()} 
      onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className=" translate-y-[2px]" /> ), enableSorting: false, enableHiding: false, },
  {
    accessorKey: "cycle_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cycle" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("cycle_id") ?? "-"}</div>
    ),
    filterFn: (row, id, value) => {
      const values = (row.getValue(id))
      return value.includes(values)
    },
  },

  // ✅ Sprint
  {
    accessorKey: "sprint_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sprint" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("sprint_id") ?? "-"}</div>
    ),
    filterFn: (row, id, filterValues) => {
      const value = row.getValue(id)
      return filterValues.includes(value)
    },
  },
  // ✅ Task ID
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => <div className="w-[40px]">{row.getValue("id")}</div>,
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
    cell: ({ row }) => {
      return (
        <div className="flex">
          <span className="truncate min-w-[500px] font-medium">{row.getValue("title")}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  // ✅ Assigned To
  {
    accessorKey: "assigned_to_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <span className="truncate font-medium">{row.getValue("assigned_to_name")}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  // ✅ Auditor
  {
    accessorKey: "audited_by_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auditor" />
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <span className="truncate font-medium">{row.getValue("audited_by_name")}</span>
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
    accessorKey: "estimate_points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estimate Points" />
    ),
    cell: ({ row }) => <div>{row.getValue("estimate_points") ?? "-"}</div>,
  },

  // ✅ Actual Points
  {
    accessorKey: "actual_points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actual Points" />
    ),
    cell: ({ row }) => <div>{row.getValue("actual_points") ?? "-"}</div>,
  },

  // ✅ Start Date
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("start_date")
      return <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
    },
  },

  // ✅ Due Date
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("due_date")
      return <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
    },
  },

  // ✅ Finished At
  {
    accessorKey: "finished_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Finished At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("finished_at")
      return <span>{date ? new Date(date).toLocaleDateString() : "-"}</span>
    },
  },

  // ✅ Actions
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
