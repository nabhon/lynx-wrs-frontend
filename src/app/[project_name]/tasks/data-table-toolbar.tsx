"use client"

import { Table } from "@tanstack/react-table"
import { X, CirclePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { cycles, employees, priorities, sprints, statuses, types } from "./data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("cycleCount") && (
          <DataTableFacetedFilter
            column={table.getColumn("cycleCount")}
            title="Cycle"
            options={cycles}
          />
        )}
        {table.getColumn("sprintCount") && (
          <DataTableFacetedFilter
            column={table.getColumn("sprintCount")}
            title="Sprint"
            options={sprints}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={types}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priorities") && (
          <DataTableFacetedFilter
            column={table.getColumn("priorities")}
            title="Priority"
            options={priorities}
          />
        )}
        {table.getColumn("assignedToName") && (
          <DataTableFacetedFilter
            column={table.getColumn("assignedToName")}
            title="Assignee"
            options={employees}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <Button variant="outline" size="sm" className="h-8 mx-2 lg:px-3">
        <CirclePlus/>
        New Task
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  )
}