"use client"
import { useRouter } from "next/navigation"
import { type LucideIcon } from "lucide-react"
import { Presentation, User } from "lucide-react"
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
        { (user?.role === "MODERATOR" || user?.role === "ADMIN") &&
          <div>
            <SidebarMenuItem key="Manage Projects">
            <SidebarMenuButton onClick={() => handleNavigate("moderation/projects")}>
              <Presentation />
              <span>Manage Projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
            <SidebarMenuItem key="Manage Users">
            <SidebarMenuButton onClick={() => handleNavigate("moderation/users")}>
              <User />
              <span>Manage Users</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          </div>
        }

        
      </SidebarMenu>
    </SidebarGroup>
  )
}
