// app/(app)/layout.tsx
import { AppSidebar } from "@/components/app/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AuthGuard from "@/providers/PathGuard"
import { AppBreadcrumb } from "@/components/ui/app-bread-crumb"
import { ProjectListProvider } from "@/providers/ProjectListProvider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ProjectListProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <AppBreadcrumb/>
              </div>
            </header>
            {/* 👇 children will replace the content section */}
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ProjectListProvider>
    </AuthGuard>
  )
}
