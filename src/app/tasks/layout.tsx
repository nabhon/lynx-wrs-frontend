import AuthGuard from "@/providers/PathGuard"
import { AppSidebar } from "@/components/app/sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppBreadcrumb } from "@/components/ui/app-bread-crumb"
import { ProjectListProvider } from "@/providers/ProjectListProvider"

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ProjectListProvider>
        <SidebarProvider>
          <AppSidebar /> {/* <-- ใช้ useProjectList ข้างในได้แล้ว */}
          <SidebarInset>
            <header className="flex h-16 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AppBreadcrumb />
            </header>
            <main className="p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </ProjectListProvider>
    </AuthGuard>
  )
}
