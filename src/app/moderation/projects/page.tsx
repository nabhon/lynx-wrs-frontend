import AddProjectButton from "./project-add-button"
import ProjectsTable from "./project-table"

export default function Page() {
  return (
        <div className="flex flex-1 flex-col gap-4 pt-0 items-center">
          <div className="flex flex-col w-full px-4">
            <div className="flex flex-row w-full mb-2">
              <h1 className="text-2xl flex-1 font-bold">Manage Project</h1>
              <AddProjectButton />
            </div>    
            <ProjectsTable/>
          </div>
        </div>
  )
}
