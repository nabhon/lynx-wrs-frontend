// src/components/app/nav-main.tsx
"use client"
import { useRouter } from "next/navigation"
import { type LucideIcon, Presentation, User } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/providers/SessionProvider"

export function NavMain({
  items,
}: {
  items: {
    name: string
    value: string
    icon?: LucideIcon
  }[]
}) {
  const router = useRouter()
  const { user } = useSession()

  const isAdmin = user?.role === "ADMIN"
  const canModerate = isAdmin || user?.role === "MODERATOR"

  const handleNavigate = (value: string) => {
    router.push(`/${value}`)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.value}>
            <SidebarMenuButton onClick={() => handleNavigate(item.value)}>
              {item.icon && <item.icon />}
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        {/* MODERATOR & ADMIN: Manage Projects */}
        {canModerate && (
          <SidebarMenuItem key="Manage Projects">
            <SidebarMenuButton onClick={() => handleNavigate("moderation/projects")}>
              <Presentation />
              <span>Manage Projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {/* ADMIN only: Manage Users */}
        {isAdmin && (
          <SidebarMenuItem key="Manage Users">
            <SidebarMenuButton onClick={() => handleNavigate("moderation/users")}>
              <User />
              <span>Manage Users</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
