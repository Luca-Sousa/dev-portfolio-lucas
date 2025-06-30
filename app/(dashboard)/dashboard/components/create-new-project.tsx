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
import { SelectItem } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectStatus, Technology } from "@prisma/client";
import { Loader2Icon, FilePlus2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { toast } from "sonner";
import { FileUpload } from "@/app/components/ui/file-upload";
import {
  CreateProjectSchema,
  createProjectSchema,
} from "../../actions/project/create-project/schema";
import { getTechnologies } from "@/app/data_access/get-technologies";
import { createProject } from "../../actions/project/create-project";
import { handleFileUpload } from "@/app/utils/create-file";
import CustomFormField, {
  FormFieldType,
} from "@/app/components/form/custom-form-field";

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
      figmaUrl: "",
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
      // Upload da thumbnail, se houver
      const uploadedThumbnail =
        thumbnailFile &&
        (await handleFileUpload(thumbnailFile, "thumbnailUrl"));

      // Upload do certificado, se houver
      const uploadedCertificate =
        certificateFile &&
        (await handleFileUpload(certificateFile, "certificateUrl"));

      // Upload das imagens, garantindo que `imagesFiles` seja um array válido
      const uploadedImages = imagesFiles?.length
        ? await Promise.all(
            imagesFiles.map(async (file) => {
              try {
                return await handleFileUpload(file, "imagesUrl");
              } catch {
                return null; // Retorna null para evitar quebra no upload de outros arquivos
              }
            }),
          )
        : [];

      const projectData = {
        ...data,
        thumbnailUrl: uploadedThumbnail || data.thumbnailUrl,
        certificateUrl: uploadedCertificate || data.certificateUrl,
        imagesUrl: uploadedImages.filter((url): url is string => !!url),
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
                          <FormLabel>
                            Imagens do Projeto{" "}
                            <span className="text-xs text-muted-foreground">
                              (opcional)
                            </span>
                          </FormLabel>
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
                    <div className="flex justify-between gap-3">
                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="title"
                        label="Título"
                        placeholder="Título do Projeto"
                      />

                      <div className="flex basis-2/5 gap-3">
                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.POPOVERCALENDER}
                          name="startDate"
                          label="Data de Início"
                          disabledCalendar={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />

                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.SELECT}
                          name="status"
                          label="Status"
                          placeholder="Status"
                          formItemsClassName="w-full max-w-40"
                        >
                          {status.map((statusItem) => (
                            <SelectItem key={statusItem} value={statusItem}>
                              {statusItem === ProjectStatus.IN_UPDATE &&
                                "Atualização"}
                              {statusItem === ProjectStatus.IN_PRODUCTION &&
                                "Finalizado"}
                              {statusItem === ProjectStatus.IN_PROGRESS &&
                                "Desenvolvimento"}
                            </SelectItem>
                          ))}
                        </CustomFormField>
                      </div>
                    </div>

                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.TEXTAREA}
                      name="description"
                      label="Descrição"
                      placeholder="Descrição do Projeto..."
                    />

                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="technologies"
                        render={() => (
                          <FormItem className="flex-1">
                            <FormLabel>Tecnologias</FormLabel>
                            <div className="grid grid-cols-3 gap-4">
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
                                            className="size-5 rounded-full border-2 data-[state=checked]:text-black"
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
                                                    (field.value || []).filter(
                                                      (value) =>
                                                        value !== tech.id,
                                                    ),
                                                  )
                                            }
                                          />
                                        </FormControl>
                                        <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                                          <Image
                                            alt={tech.name}
                                            src={tech.iconURL}
                                            width={20}
                                            height={20}
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
                    </div>

                    <div className="space-y-3">
                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="repositoryUrl"
                        label="Repositório"
                        placeholder="Link do Repositório"
                      />

                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="deployUrl"
                        label="Deploy"
                        placeholder="Link do Deploy"
                        optional
                      />

                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="figmaUrl"
                        label="Figma"
                        placeholder="Link do Figma"
                        optional
                      />
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
