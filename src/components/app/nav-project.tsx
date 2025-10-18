"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "_")
}

export function NavProjects({
  projects,
}: {
  projects: {
    title: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => {
          const slug = slugify(project.title)
          const subItems = [
            { title: "Overview", path: `/overview` },
            { title: "Task", path: `/tasks` },
          ]
          return (
            <Collapsible
              key={project.title}
              asChild
              defaultOpen={project.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={project.title}>
                    {project.icon && <project.icon />}
                    <span>{project.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {subItems.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={`/${slug}${sub.path}`}>
                            <span>{sub.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                      <SidebarMenuSubItem key="Settings">
                        <SidebarMenuSubButton asChild>
                          <a href={`${slug}/settings`}>
                            <span>Settings</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
