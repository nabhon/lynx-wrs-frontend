"use client"

import { ChevronRight, Circle } from "lucide-react"
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

import type { ProjectItem } from "@/providers/ProjectListProvider"
import { title } from "process"

function slugify(title: string) {
  return title.replace(/\s+/g, "_")
}

export function NavProjects({ projects }: { projects: ProjectItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => {
          const slug = slugify(project.projectName)
          const subItems = [
            { title: "Overview", path: `/overview` },
            { title: "Task", path: `/tasks` },
          ]
          return (
            <Collapsible
              key={project.projectId}
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={project.projectName}>
                    <Circle />
                    <span>{project.projectName}</span>
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

                    <SidebarMenuSubItem key="Users">
                      <SidebarMenuSubButton asChild>
                        <a href={`/${slug}/users`}>
                          <span>Users</span>
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
