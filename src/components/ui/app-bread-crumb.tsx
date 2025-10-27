"use client"
import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  settings: "Settings",
  task: "Tasks",
  overview: "Overview",
}

export function AppBreadcrumb() {
  const pathname = usePathname()

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label =
      labelMap[segment] ??
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/[-_]/g, " ")
    const isLast = index === segments.length - 1
    return { label, href, isLast }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <p>{crumb.label}</p>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
