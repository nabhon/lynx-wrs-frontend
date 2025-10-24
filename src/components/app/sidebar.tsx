"use client"

import * as React from "react"
import {
  Bot,
  PieChart,
  SquareTerminal,
} from "lucide-react"
import { getUsersDetailsService } from "@/services/userService"
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
import { useSession } from "@/providers/SessionProvider"

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
  const { user } = useSession();
  console.log("Sidebar User:", user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menu.items} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
       <NavUser user={{ email: user?.email, name: user?.name }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
