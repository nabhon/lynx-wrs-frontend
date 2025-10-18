"use client"
import { useRouter } from "next/navigation"
import { type LucideIcon } from "lucide-react"
import { CirclePlus } from "lucide-react"
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
          <SidebarMenuItem key="Create Project">
            <SidebarMenuButton onClick={() => handleNavigate("create_project")}>
              <CirclePlus />
              <span>Create Project</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        }
      </SidebarMenu>
    </SidebarGroup>
  )
}
