import AddUserButton from "./user-add-button"
import UsersTable from "./user-table"
export default function Page() {
  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center">
          <div className="flex flex-col w-full max-w-4xl">
            <div className="flex flex-row w-full">
              <h1 className="text-2xl flex-1 font-bold">Manage Users</h1>
              <AddUserButton />
            </div>    
            <UsersTable/>
          </div>
        </div>
  )
}
