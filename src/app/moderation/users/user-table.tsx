'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useUserList } from '@/providers/user-list-provider';
import { DataTablePagination } from '@/app/[project_name]/tasks/data-table-pagination';
import { deleteUserService } from '@/services/userService';

//
// 🧩 Shared type (matches backend UserDto)
//
export type UserDto = {
  id: number;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
};

//
// 🧩 UsersTable Component
//
const UsersTable = () => {
  const { users: fetchedUsers, loading, error, refresh } = useUserList();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (fetchedUsers) setUsers(fetchedUsers);
  }, [fetchedUsers]);

  const handleDelete = async (userId: number) => {
    setDeleting(true);
    try {
      await deleteUserService(userId);
      await refresh();
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleting(false);
    }
  };

  //
  // 🧾 Table columns
  //
  const columns: ColumnDef<UserDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.role}</span>
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) =>
        row.original.lastLogin
          ? new Date(row.original.lastLogin).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '-',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) =>
        new Date(row.original.updatedAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSelectedUser(row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete user {row.original.name}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The user will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleting}
                  onClick={() => handleDelete(row.original.id)}
                >
                  {deleting ? 'Deleting...' : 'Confirm'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  //
  // 🧠 TanStack Table setup
  //
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  //
  // 🧭 Conditional rendering
  //
  if (loading) return null;
  if (error)
    return <p className="text-center text-red-500 py-8">Failed to load users</p>;
  if (!users || users.length === 0)
    return <p className="text-center text-muted-foreground py-8">No users found</p>;

  //
  // 🧩 Render table
  //
  return (
    <div className="space-y-4">
      <table className="w-full border-collapse text-sm">
        <thead className="border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left px-4 py-2 font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-muted/30">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
};

export default UsersTable;
