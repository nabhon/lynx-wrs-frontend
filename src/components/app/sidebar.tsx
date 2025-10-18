"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
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
import { Nav } from "react-day-picker"

// This is sample data.
const menu = {
  items: [
    { name: "Dashboard", value: "dashboard", icon: Bot },
    { name: "Tasks", value: "tasks", icon: SquareTerminal },
    { name: "Reports", value: "reports", icon: PieChart },
  ]
}

const projects = {
  project: [
    {
      title: "Project Alpha",
      icon: Frame,
      isActive: false,
    },
    {
      title: "Project Beta",
      icon: PieChart,
      isActive: false,
    },
    {
      title: "Project Gamma",
      icon: Map,
      isActive: false,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menu.items} />
        <NavProjects projects={projects.project} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
