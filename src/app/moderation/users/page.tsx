import AddUserButton from "./user-add-button"
import UsersTable from "./user-table"
export default function Page() {
  return (
        <div className="flex flex-1 flex-col gap-4 items-center">
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full">
              <h1 className="text-2xl flex-1 font-bold mb-2">Manage Users</h1>
              <AddUserButton />
            </div>    
            <div className="rounded-2xl border border-violet-200/60 bg-background/90 shadow-sm flex w-full">
              <UsersTable/>
            </div>
          </div>
        </div>
  )
}
