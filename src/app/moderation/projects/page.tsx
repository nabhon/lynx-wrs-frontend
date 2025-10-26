import AddProjectButton from "./project-add-button"
import ProjectsTable from "./project-table"

export default function Page() {
  return (
        <div className="flex flex-1 flex-col gap-4 pt-0 items-center">
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full mb-2">
              <h1 className="text-2xl flex-1 font-bold">Manage Project</h1>
              <AddProjectButton />
            </div>    
            <div className="rounded-2xl border border-violet-200/60 bg-background/90 shadow-sm flex w-full "><ProjectsTable/></div>
          </div>
        </div>
  )
}
