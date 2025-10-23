"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

import { RegisterUser } from "@/services/userService";

const formSchema = z.object({
  email: z.string().min(1).min(2),
  name: z.string().min(1).min(2),
  surname: z.string().min(1).min(2),
  role: z.string(),
});

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const roles = [
    { label: "User", value: "USER" },
    { label: "Moderator", value: "MODERATOR" },
    { label: "Admin", value: "ADMIN" },
  ] as const;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      role: "USER",
    },
  });

  const [sending, setSending] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSending(true);
    const payload = {
      email: values.email,
      name: values.name,
      surname: values.surname || "",
      role: values.role || "USER",
    };

    try {
      await RegisterUser(payload);
      toast.success(`User created successfully!`);
      form.reset();
      onSuccess?.(); // 👈 close dialog after success
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@lynx.com" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Role</FormLabel>
              <Popover >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? roles.find((role) => role.value === field.value)
                            ?.label
                        : "Select role"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search role..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {roles.map((role) => (
                          <CommandItem
                            value={role.label}
                            key={role.value}
                            onSelect={() => {
                              form.setValue("role", role.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                role.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {role.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4 w-full">Submit</Button>
      </form>
    </Form>
  );
}
