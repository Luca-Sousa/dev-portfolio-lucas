"use client";

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectStatus, Technology } from "@prisma/client";
import { Loader2Icon, FilePlus2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Calendar } from "@/app/components/ui/calendar";
import { toast } from "sonner";
import { ptBR } from "date-fns/locale";
import { FileUpload } from "@/app/components/ui/file-upload";
import {
  CreateProjectSchema,
  createProjectSchema,
} from "../../actions/project/create-project/schema";
import { getTechnologies } from "@/app/data_access/get-technologies";
import { createProject } from "../../actions/project/create-project";
import { handleFileUpload } from "@/app/utils/create-file";

const CreateNewProject = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [status, setStatus] = useState<ProjectStatus[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imagesFiles, setImagesFiles] = useState<(File | string)[]>([]);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      certificateUrl: undefined,
      certificateDesc: "",
      imagesUrl: [],
      thumbnailUrl: undefined,
      repositoryUrl: "",
      deployUrl: "",
      status: "" as ProjectStatus,
      technologies: [],
    },
  });

  useEffect(() => {
    const fetchTechnologies = async () => {
      const techs = await getTechnologies();
      setTechnologies(techs);
    };
    fetchTechnologies();
  }, []);

  useEffect(() => {
    setStatus(Object.values(ProjectStatus));
  }, []);

  const handleSubmitProject = async (data: CreateProjectSchema) => {
    try {
      const uploadedThumbnail =
        thumbnailFile &&
        (await handleFileUpload(thumbnailFile, "thumbnailUrl"));
      const uploadedCertificate =
        certificateFile &&
        (await handleFileUpload(certificateFile, "certificateUrl"));
      const uploadedImages = await Promise.all(
        imagesFiles.map((file) => handleFileUpload(file, "imagesUrl")),
      );

      const projectData = {
        ...data,
        thumbnailUrl: uploadedThumbnail || data.thumbnailUrl,
        certificateUrl: uploadedCertificate || data.certificateUrl,
        imagesUrl: uploadedImages.filter((url): url is string => url !== null),
      };

      await createProject(projectData);

      form.reset();
      setDialogIsOpen(false);
      toast.success("Projeto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar o projeto:", error);
      toast.error("Ocorreu um erro ao criar o projeto!");
    }
  };

  return (
    <Dialog
      open={dialogIsOpen}
      onOpenChange={(open) => {
        setDialogIsOpen(open);
        if (certificateFile) {
          setCertificateFile(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 font-medium">
          <FilePlus2 size={14} />
          Novo Projeto
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-full max-h-[90%] max-w-[75%] flex-col">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmitProject)}
            className="flex h-full flex-col justify-between space-y-2 overflow-hidden"
          >
            <div className="flex h-full justify-between overflow-hidden">
              <div className="mr-2 flex h-full basis-2/5 flex-col overflow-hidden">
                <ScrollArea>
                  <div className="space-y-4 pb-2">
                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={() => (
                        <FormItem className="px-4">
                          <FormLabel>Imagem da Thumbnail</FormLabel>
                          <FormControl>
                            <div className="h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                              <FileUpload
                                onChange={(files) => {
                                  if (files.length > 0) {
                                    const file = files[0];
                                    setThumbnailFile(file);
                                    form.setValue("thumbnailUrl", file);
                                  }
                                }}
                                singleFile
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imagesUrl"
                      render={() => (
                        <FormItem className="px-4">
                          <FormLabel>Imagens do Projeto</FormLabel>
                          <FormControl>
                            <div className="h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                              <FileUpload
                                onChange={(files) => {
                                  setImagesFiles(files);
                                  form.setValue("imagesUrl", files);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="certificateUrl"
                      render={() => (
                        <FormItem className="px-4">
                          <FormLabel>
                            Certificado{" "}
                            <span className="text-xs text-muted-foreground">
                              (opcional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                              <FileUpload
                                onChange={(files) => {
                                  if (files.length > 0) {
                                    const file = files[0];
                                    setCertificateFile(file);
                                    form.setValue("certificateUrl", file);
                                  }
                                }}
                                singleFile
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {certificateFile && (
                      <FormField
                        control={form.control}
                        name="certificateDesc"
                        render={({ field }) => (
                          <FormItem className="px-4">
                            <FormLabel>
                              Descrição - Certificado{" "}
                              <span className="text-xs text-muted-foreground">
                                (opcional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Descrição do Certificado..."
                                className="min-h-32 max-w-lg resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex basis-3/5 flex-col">
                <ScrollArea>
                  <div className="flex w-full flex-1 flex-col gap-3 pb-2 pl-1 pr-4">
                    <div className="flex gap-3">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="h-fit flex-1">
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Título do Projeto"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="w-full max-w-40">
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent align="end">
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {status.map((statusItem) => (
                                    <SelectItem
                                      key={statusItem}
                                      value={statusItem}
                                    >
                                      {statusItem === ProjectStatus.IN_UPDATE &&
                                        "Atualização"}
                                      {statusItem ===
                                        ProjectStatus.IN_PRODUCTION &&
                                        "Finalizado"}
                                      {statusItem ===
                                        ProjectStatus.IN_PROGRESS &&
                                        "Desenvolvimento"}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição - Projeto</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Descrição do Projeto..."
                              className="min-h-32 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Início</FormLabel>
                            <FormControl>
                              <Calendar
                                className="rounded-lg border border-input"
                                classNames={{
                                  day_selected:
                                    "bg-primary font-semibold hover:font-semibold focus:font-semibold text-muted hover:bg-primary hover:text-muted focus:bg-primary focus:text-muted",
                                }}
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                                defaultMonth={field.value}
                                locale={ptBR}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-1 flex-col justify-between">
                        <FormField
                          control={form.control}
                          name="technologies"
                          render={() => (
                            <FormItem>
                              <FormLabel>Tecnologias</FormLabel>
                              <div className="flex flex-wrap gap-4">
                                {technologies.map((tech) => (
                                  <FormField
                                    key={tech.id}
                                    control={form.control}
                                    name="technologies"
                                    render={({ field }) => (
                                      <FormItem key={tech.id}>
                                        <div className="flex items-center gap-3">
                                          <FormControl>
                                            <Checkbox
                                              className="data-[state=checked]:text-black"
                                              checked={field.value?.includes(
                                                tech.id,
                                              )}
                                              onCheckedChange={(checked) =>
                                                checked
                                                  ? field.onChange([
                                                      ...(field.value || []),
                                                      tech.id,
                                                    ])
                                                  : field.onChange(
                                                      (
                                                        field.value || []
                                                      ).filter(
                                                        (value) =>
                                                          value !== tech.id,
                                                      ),
                                                    )
                                              }
                                            />
                                          </FormControl>
                                          <FormLabel className="flex items-center gap-1 text-xs">
                                            <Image
                                              alt={tech.name}
                                              src={tech.iconURL}
                                              width={16}
                                              height={16}
                                            />
                                            {tech.name}
                                          </FormLabel>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="deployUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deploy</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Link de Deploy"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="repositoryUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Repositório</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Link do Repositório"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <DialogFooter className="flex items-end justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button
                    type="reset"
                    disabled={form.formState.isSubmitting}
                    variant={"secondary"}
                    className="gap-1.5"
                  >
                    Cancelar
                  </Button>
                </DialogClose>

                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="gap-1.5 font-semibold"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2Icon className="animate-spin" size={16} />
                  ) : (
                    <FilePlus2 size={16} />
                  )}
                  Salvar Projeto
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProject;
