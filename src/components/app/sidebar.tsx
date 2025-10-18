"use client"

import * as React from "react"
import {
  Bot,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { NavProjects } from "./nav-project"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useProjectList } from "@/providers/ProjectListProvider"

// This is sample data.
const menu = {
  items: [
    { name: "Dashboard", value: "dashboard", icon: Bot },
    { name: "Tasks", value: "tasks", icon: SquareTerminal },
    { name: "Reports", value: "reports", icon: PieChart },
  ]
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects }  = useProjectList();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menu.items} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
