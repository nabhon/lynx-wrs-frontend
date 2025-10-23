'use client';

import { useState, useEffect } from 'react';
import type { ColumnDef } from '@/components/ui/shadcn-io/table';
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from '@/components/ui/shadcn-io/table';
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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useUserList } from '@/providers/user-list-provider';

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
// 🧰 Mock delete service
//
async function deleteUserService(userId: number) {
  console.log(`🗑️ Delete user ID: ${userId}`);
  return new Promise((resolve) => setTimeout(resolve, 500));
}

//
// 🧩 UsersTable Component
//
const UsersTable = () => {
  // ✅ get users from provider
  const { users: fetchedUsers, loading, error } = useUserList();

  // ✅ local state for UI updates (e.g., delete)
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ update local list when fetchedUsers change
  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  const handleDelete = async (userId: number) => {
    setDeleting(true);
    await deleteUserService(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setDeleting(false);
    setSelectedUser(null);
  };

  //
  // 🧾 Table columns
  //
  const columns: ColumnDef<UserDto>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full ring-2 ring-background"
            style={{ backgroundColor: '#10B981' }}
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <TableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.role}</span>
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: ({ column }) => <TableColumnHeader column={column} title="Last login" />,
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
      header: ({ column }) => <TableColumnHeader column={column} title="Created at" />,
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <TableColumnHeader column={column} title="Updated at" />,
      cell: ({ row }) =>
        new Date(row.original.updatedAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
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
  // 🧭 Conditional rendering
  //
  if (loading) return null; // show nothing while loading
  if (error) return <p className="text-center text-red-500 py-8">Failed to load users</p>;
  if (!users || users.length === 0)
    return <p className="text-center text-muted-foreground py-8">No users found</p>;

  //
  // 🧩 Render table
  //
  return (
    <TableProvider columns={columns} data={users}>
      <TableHeader>
        {({ headerGroup }) => (
          <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
            {({ header }) => <TableHead header={header} key={header.id} />}
          </TableHeaderGroup>
        )}
      </TableHeader>
      <TableBody>
        {({ row }) => (
          <TableRow key={row.id} row={row}>
            {({ cell }) => <TableCell cell={cell} key={cell.id} />}
          </TableRow>
        )}
      </TableBody>
    </TableProvider>
  );
};

export default UsersTable;
