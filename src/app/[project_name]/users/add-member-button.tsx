"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover, PopoverTrigger, PopoverContent,
} from "@/components/ui/popover";
import {
  Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getProjectCandidatesService } from "@/services/projectService";
import { addProjectMemberService } from "@/services/projectService";

type UserDto = {
  id: number;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
};

export default function AddMemberButton({
  projectId,
  currentMembers,
  onAdded,
}: {
  projectId: number;
  currentMembers: UserDto[];
  onAdded: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // โหลดผู้ใช้ทั้งหมด (จาก /users/details) แล้วกรองคนที่ยังไม่อยู่ในโปรเจ็กต์
  useEffect(() => {
  if (!open) return;
  let mounted = true;
  (async () => {
    try {
      const res = await getProjectCandidatesService(projectId);
      if (!mounted) return;
      setAllUsers(res.items ?? []); // <-- candidates ตรง ๆ
    } catch (e: any) {
      setAllUsers([]);
      toast.error(e?.message ?? "Failed to load candidates");
    }
  })();
  return () => { mounted = false; };
}, [open, projectId]);

const candidates = allUsers;

  const selectedLabel = useMemo(
    () => candidates.find(c => c.id === selectedUserId)?.name ?? "Select user",
    [candidates, selectedUserId]
  );

  const handleSubmit = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }
    setLoading(true);
    try {
      await addProjectMemberService(projectId, selectedUserId);
      toast.success("Member added to project");
      setOpen(false);
      setSelectedUserId(null);
      await onAdded();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add member to this project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">User</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between", !selectedUserId && "text-muted-foreground")}
                >
                  {selectedLabel}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search user..." />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {candidates.map((u) => (
                        <CommandItem
                          key={u.id}
                          onSelect={() => setSelectedUserId(u.id)}
                        >
                          <Check className={cn("mr-2 h-4 w-4", u.id === selectedUserId ? "opacity-100" : "opacity-0")} />
                          {u.name} <span className="ml-2 text-xs text-muted-foreground">({u.role})</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedUserId}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
