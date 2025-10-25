// src/app/[project_name]/tasks/data-table-add-button.tsx
"use client";

import { useMemo, useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";

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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// mock
import { createTaskService } from "@/services/taskService";
import { useProject } from "@/providers/ProjectProvider";
import { useProjectUsers } from "@/providers/projectUserProvider";

// =========================
// Schema
// =========================
const formSchema = z.object({
  cycle: z.string().optional(),
  sprint: z.string().optional(),
  taskname: z.string().min(1, "Required"),
  key: z.string().min(1, "Required"),
  description: z.string().optional(),
  type: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  priority: z.string().min(1, "Required"),
  actualpoints: z.coerce.number().optional(),
  estimatepoint: z.coerce.number().optional(),
  startdate: z.coerce.date().optional(),
  duedate: z.coerce.date().optional(),
  assignee: z.string().optional(),
  auditor: z.string().optional(),
});

// =========================
// Options
// =========================
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
    {
      value: "TODO",
      label: "To Do",
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
    },
    {
      value: "DONE",
      label: "Done",
    },
    {
      value: "CANCELED",
      label: "Canceled",
    },
    {
      value: "ON_HOLD",
      label: "On Hold",
    },
    {
      value: "REVIEW",
      label: "Review",
    },
    {
      value: "LATE",
      label: "Late",
    },
    {
      value: "BLOCKED",
      label: "Blocked",
    },
    {
      value: "REVISE",
      label: "Revise",
    },
  ],
  priority: [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
  ],
};

// =========================
// Component
// =========================
export default function AddTaskDialog() {
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const { refreshProject, project } = useProject();
  const { members, loading: membersLoading } = useProjectUsers();

  type FormValues = z.infer<typeof formSchema>;

  const userOptions = useMemo(
    () => (members ?? []).map((u) => ({ label: u.name, value: String(u.id) })),
    [members]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {},
  });

  // submit
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    setSending(true);
    if (!project?.projectId) {
      toast.error("Project not found");
      return;
    }
    const payload = {
      projectId: project.projectId,
      cycleCount: values.cycle ? Number(values.cycle) : 1,
      sprintCount: values.sprint ? Number(values.sprint) : 1,
      taskKey: values.key,
      taskName: values.taskname,
      description: values.description || "",
      type: values.type,
      status: values.status,
      priority: values.priority,
      actualPoints: values.actualpoints || 0,
      estimatePoints: values.estimatepoint || 0,
      startDate: values.startdate ? values.startdate.toISOString() : undefined,
      endDate: values.duedate ? values.duedate.toISOString() : undefined,
      assigneeId: values.assignee ? Number(values.assignee) : undefined,
      auditorId: values.auditor ? Number(values.auditor) : undefined,
    };

    try {
      const result = await createTaskService(payload);
      toast.success(`Task "${result.taskName}" created successfully!`);
      form.reset();
      await refreshProject();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task.");
    } finally {
      setSending(false);
    }
  };

  // helper render for popover selects
  const renderSelect = (
    field: any,
    label: string,
    options: { label: string; value: string }[]
  ) => (
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
                : `Select ${label}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => form.setValue(field.name, opt.value)}
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

  // =========================
  // JSX
  // =========================
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 mx-2">
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Fill in the task details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            {/* cycle/sprint */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="cycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cycle</FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
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
                        <Input placeholder="1" {...field} />
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
                        <Input placeholder="Create new task" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Key</FormLabel>
                      <FormControl>
                        <Input placeholder="LYNX-1" {...field} />
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
                      placeholder="Describe this task..."
                      className="resize-none"
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
                  render={({ field }) =>
                    renderSelect(field, "Type", selectOptions.type)
                  }
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control as any}
                  name="status"
                  render={({ field }) =>
                    renderSelect(field, "Status", selectOptions.status)
                  }
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control as any}
                  name="priority"
                  render={({ field }) =>
                    renderSelect(field, "Priority", selectOptions.priority)
                  }
                />
              </div>
            </div>

            {/* estimate */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control as any}
                  name="estimatepoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimate Point</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* actual points */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control as any}
                  name="actualpoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Points</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          placeholder="0"
                          {...field}
                        />
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
                            selected={field.value}
                            onSelect={field.onChange}
                            className=""
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
                            selected={field.value}
                            onSelect={field.onChange}
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
                  render={({ field }) =>
                    renderSelect(field, "Assignee", userOptions)
                  }
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control as any}
                  name="auditor"
                  render={({ field }) =>
                    renderSelect(field, "Auditor", userOptions)
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={sending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={sending}>
                {sending ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
