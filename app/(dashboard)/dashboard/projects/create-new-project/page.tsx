"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input-aceternity";
import { ProjectStatus } from "@prisma/client";
import { useForm } from "react-hook-form";

const CreateNewProject = () => {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      certificateUrl: undefined,
      certificateDesc: undefined,
      imagesUrl: [],
      thumbnailUrl: "",
      repositoryUrl: "",
      deployUrl: "",
      status: "" as ProjectStatus,
      technologies: [],
    },
  });

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-700 bg-neutral-900 p-2 md:p-10">
        <div className="flex h-20 w-full items-center justify-between gap-2 rounded-lg bg-neutral-800 px-6">
          <span className="text-2xl font-bold">Criar Novo Projeto</span>
        </div>

        <div className="p-10">
          <Form {...form}>
            <form className="flex h-full flex-col justify-between space-y-2 overflow-hidden">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="h-fit flex-1">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do Projeto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewProject;
