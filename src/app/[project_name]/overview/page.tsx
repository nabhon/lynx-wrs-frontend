import TaskTable from "./lastest-table"

export default function Page() {
  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-12 gap-4 h-fit">
            <div className="flex flex-row col-span-12 gap-4 ">
                <div className="bg-red-500 h-full flex-1/3 rounded-xl" >
                
                </div>
                <div className="bg-mute shadow-2xl p-4 flex-2/3 rounded-xl">
                    <TaskTable />
                </div>
            </div>
            <div className="bg-red-500 aspect-video row-span-4 rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
  )
}
