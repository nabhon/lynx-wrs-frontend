"use client"

import { useRouter } from "next/navigation"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
      </SidebarMenu>
    </SidebarGroup>
  )
}
