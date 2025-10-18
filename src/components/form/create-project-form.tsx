"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createProjectService } from "@/services/projectService"
import { useProjectList } from "@/providers/ProjectListProvider"

const formSchema = z.object({
  projectnameinput: z.string().min(1, "Required").max(100),
  projectkeyinput: z.string().min(1, "Required").max(20),
  projectdescription: z.string().max(500).optional(),
})

export default function CreateProjectForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectnameinput: "",
      projectkeyinput: "",
      projectdescription: "",
    },
  })

  const [sending, setSending] = useState(false);
  const { refreshProjects } = useProjectList();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSending(true);
    const payload = {
      projectName: values.projectnameinput,
      projectKey: values.projectkeyinput,
      projectDescription: values.projectdescription || "",
    }
    try {
      const result = await createProjectService(payload)
      toast.success(`Project "${result.projectName}" created successfully!`)
      form.reset()
      setSending(false);
      await refreshProjects();
    } catch (error) {
        setSending(false);
      toast.error("Failed to create project. Please try again.")
    }
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full mx-auto py-4"
      >
        <FormField
          control={form.control}
          name="projectnameinput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Lynx Project" type="text" {...field} />
              </FormControl>
              <FormDescription>Enter your project name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectkeyinput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Key</FormLabel>
              <FormControl>
                <Input placeholder="LYNX" type="text" {...field} />
              </FormControl>
              <FormDescription>Enter your project key</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectdescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Placeholder" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Enter your project description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={sending}>Submit</Button>
      </form>
    </Form>
  )
}
