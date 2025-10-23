import CreateProjectForm from "@/components/form/create-project-form"

export default function Page() {
  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center">
          <div className="flex flex-col w-full max-w-[768px]">
            <h1 className="text-2xl font-bold">Create New Project</h1>
            
            <CreateProjectForm/>
          </div>
        </div>
  )
}
