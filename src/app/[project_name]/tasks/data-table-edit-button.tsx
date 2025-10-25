// src/app/[project_name]/tasks/data-table-edit-button.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";

import { editTaskService, type EditTaskPayload } from "@/services/taskService";
import { useProject } from "@/providers/ProjectProvider";
import type { Task } from "./data/schema";
import { useProjectUsers } from "@/providers/projectUserProvider";

// ====== schema ของฟอร์มแก้ไข (เหมือน create แต่เป็น optional เกือบทั้งหมด) ======
const formSchema = z.object({
  cycle: z.coerce.number().optional(),
  sprint: z.coerce.number().optional(),
  taskname: z.string().min(1, "Required"),
  key: z.string().min(1, "Required"),
  description: z.string().optional().nullable(),
  type: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  priority: z.string().min(1, "Required"),
  estimatepoint: z.coerce.number().nullable().optional(),
  actualpoints: z.coerce.number().nullable().optional(),
  startdate: z.date().nullable().optional(),
  duedate: z.date().nullable().optional(),
  assignee: z.string().optional().nullable(), // เก็บเป็น userId (string) แล้วค่อยแปลงเป็น number
  auditor: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const selectOptions = {
  type: [
    { value: "MIPO", label: "MIPO" },
    { value: "MRPO", label: "MRPO" },
    { value: "MIT", label: "MIT" },
    { value: "MRT", label: "MRT" },
    { value: "TGD", label: "TGD" },
    { value: "RGD", label: "RGD" },
    { value: "MGD", label: "MGD" },
    { value: "TPD", label: "TPD" },
    { value: "STD", label: "STD" },
    { value: "SCD", label: "SCD" },
    { value: "RD", label: "RD" },
    { value: "US", label: "US" },
    { value: "RPD", label: "RPD" },
    { value: "SWD", label: "SWD" },
    { value: "UCD", label: "UCD" },
    { value: "AD", label: "AD" },
    { value: "UCDS", label: "UCDS" },
    { value: "SQ", label: "SQ" },
    { value: "SD", label: "SD" },
    { value: "DBD", label: "DBD" },
    { value: "ER", label: "ER" },
    { value: "DD", label: "DD" },
    { value: "PN", label: "PN" },
    { value: "CHECK", label: "CHECK" },
    { value: "SRSD", label: "SRSD" },
    { value: "VCD", label: "VCD" },
    { value: "UXI", label: "UXI" },
    { value: "SMD", label: "SMD" },
    { value: "FMD", label: "FMD" },
    { value: "SDW", label: "SDW" },
    { value: "TRT", label: "TRT" },
    { value: "POT", label: "POT" },
    { value: "ETC", label: "ETC" },
    { value: "MFT", label: "MFT" },
    { value: "NWA", label: "NWA" },
  ],
  status: [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
    { value: "CANCELED", label: "Canceled" },
    { value: "ON_HOLD", label: "On Hold" },
    { value: "REVIEW", label: "Review" },
    { value: "LATE", label: "Late" },
    { value: "BLOCKED", label: "Blocked" },
    { value: "REVISE", label: "Revise" },
  ],
  priority: [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
  ],
};

// helper: ปุ่ม select
function SelectPopover({
  field,
  label,
  options,
  placeholder,
}: {
  field: any;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? options.find((o) => o.value === field.value)?.label
                : placeholder ?? `Select ${label}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => field.onChange(opt.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        opt.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

function toYMD(date?: Date | null): string | undefined {
  if (!date) return undefined;
  return format(date, "yyyy-MM-dd");
}

export default function EditTaskDialog({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: Task;
}) {
  const [sending, setSending] = useState(false);
  const { refreshProject, project } = useProject();
  const { members, loading: membersLoading } = useProjectUsers();

  const userOptions = useMemo(
    () => (members ?? []).map((m) => ({ label: m.name, value: String(m.id) })),
    [members]
  );

  // เตรียม defaultValues จาก task
  const defaultValues: Partial<FormValues> = useMemo(() => {
    return {
      cycle: task.cycleCount ?? undefined,
      sprint: task.sprintCount ?? undefined,
      taskname: task.title ?? "",
      key: task.key ?? "",
      description: task.description ?? "",
      type: task.type ?? "",
      status: task.status ?? "",
      priority: task.priorities ?? "",
      estimatepoint: task.estimatePoints ?? null,
      actualpoints: task.actualPoints ?? null,
      startdate: task.startDate ? parseISO(task.startDate) : null,
      duedate: task.dueDate ? parseISO(task.dueDate) : null,
      assignee: task.assignedToId ? String(task.assignedToId) : null,
      auditor: task.auditedById ? String(task.auditedById) : null,
    };
  }, [task]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues,
  });

  // Reset the form whenever the defaultValues (derived from task) change
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form.reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setSending(true);
    try {
      const payload: EditTaskPayload = {
        taskId: task.id,
        projectId: project?.projectId ?? task.projectId,
        taskName: values.taskname,
        description: values.description ?? undefined,
        type: values.type,
        status: values.status,
        priority: values.priority,
        estimatePoints: values.estimatepoint ?? undefined,
        actualPoints: values.actualpoints ?? undefined,
        startDate: toYMD(values.startdate),
        endDate: toYMD(values.duedate),
        assigneeId: values.assignee ? Number(values.assignee) : undefined,
        auditorId: values.auditor ? Number(values.auditor) : undefined,
      };

      await editTaskService(payload);
      toast.success("Task updated");
      await refreshProject();
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Update failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details and save changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            {/* cycle / sprint */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="cycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cycle</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="sprint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sprint</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* name / key */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="taskname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Task name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Key</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* description */}
            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Describe this task..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* type / status / priority */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control as any}
                  name="type"
                  render={({ field }) => (
                    <SelectPopover
                      field={field}
                      label="Type"
                      options={selectOptions.type}
                    />
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control as any}
                  name="status"
                  render={({ field }) => (
                    <SelectPopover
                      field={field}
                      label="Status"
                      options={selectOptions.status}
                    />
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control as any}
                  name="priority"
                  render={({ field }) => (
                    <SelectPopover
                      field={field}
                      label="Priority"
                      options={selectOptions.priority}
                    />
                  )}
                />
              </div>
            </div>

            {/* estimate & actual points (บรรทัดเดียวกัน) */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="estimatepoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimate Point</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="actualpoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Points</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* start / due date */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="startdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={(d) => field.onChange(d ?? null)}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="duedate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={(d) => field.onChange(d ?? null)}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* assignee / auditor */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="assignee"
                  render={({ field }) => (
                    <SelectPopover
                      field={field}
                      label="Assignee"
                      options={userOptions}
                      placeholder={membersLoading ? "Loading..." : "Unassigned"}
                    />
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="auditor"
                  render={({ field }) => (
                    <SelectPopover
                      field={field}
                      label="Auditor"
                      options={userOptions}
                      placeholder={membersLoading ? "Loading..." : "None"}
                    />
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={sending}>
                {sending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
