"use client";

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectStatus, Technology } from "@prisma/client";
import { Loader2Icon, FilePlus2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { toast } from "sonner";
import { FileUpload } from "@/app/components/ui/file-upload";
import { getTechnologies } from "@/app/data_access/get-technologies";
import CustomFormField, {
  FormFieldType,
} from "@/app/components/form/custom-form-field";
import { useAction } from "next-safe-action/hooks";
import { upsertProject } from "@/app/_actions/project/project.actions";
import { z } from "zod";
import { fileOrUrl } from "@/app/lib/utils";
import { Project } from "@/app/types";

const upsertProjectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  startDate: z
    .date({ message: "A data é obrigatória" })
    .refine((date) => date <= new Date(), {
      message: "A data não pode ser no futuro",
    }),
  certificateUrl: fileOrUrl.optional(),
  certificateDesc: z.string().optional(),
  imagesUrl: fileOrUrl.optional(),
  thumbnailUrl: fileOrUrl.refine((val) => val !== undefined, {
    message: "A thumbnail é obrigatória",
  }),
  repositoryUrl: z.string().url({ message: "URL do repositório inválida" }),
  deployUrl: z.string().optional(),
  figmaUrl: z.string().optional(),
  status: z.enum(["IN_PROGRESS", "IN_UPDATE", "IN_PRODUCTION"], {
    message: "Selecione um status válido",
  }),
  technologies: z
    .array(z.string().min(1, { message: "O nome da tecnologia é obrigatório" }))
    .min(1, { message: "Selecione pelo menos uma tecnologia" }),
});

type UpsertProjectSchema = z.infer<typeof upsertProjectSchema>;

interface UpsertProjectFormProps {
  isOpen: boolean;
  project?: Project;
  onSuccess?: () => void;
}

const UpsertProjectForm = ({
  isOpen,
  project,
  onSuccess,
}: UpsertProjectFormProps) => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [status, setStatus] = useState<ProjectStatus[]>([]);

  const form = useForm<UpsertProjectSchema>({
    shouldUnregister: true,
    resolver: zodResolver(upsertProjectSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      startDate: project?.startDate ?? new Date(),
      certificateUrl: project?.certificateUrl
        ? [project.certificateUrl]
        : undefined,
      certificateDesc: project?.certificateDesc ?? "",
      imagesUrl: project?.imagesUrl ?? [],
      thumbnailUrl: project?.thumbnailUrl ? [project.thumbnailUrl] : undefined,
      repositoryUrl: project?.repositoryUrl ?? "",
      deployUrl: project?.deployUrl ?? "",
      figmaUrl: project?.figmaUrl ?? "",
      status: project?.status ?? ("IN_PROGRESS" as ProjectStatus),
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

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: project?.title ?? "",
        description: project?.description ?? "",
        startDate: project?.startDate ?? new Date(),
        certificateUrl: project?.certificateUrl
          ? [project.certificateUrl]
          : undefined,
        certificateDesc: project?.certificateDesc ?? "",
        imagesUrl: project?.imagesUrl ?? [],
        thumbnailUrl: project?.thumbnailUrl
          ? [project.thumbnailUrl]
          : undefined,
        repositoryUrl: project?.repositoryUrl ?? "",
        deployUrl: project?.deployUrl ?? "",
        figmaUrl: project?.figmaUrl ?? "",
        status: project?.status ?? ("IN_PROGRESS" as ProjectStatus),
        technologies: [],
      });
    }
  }, [form, isOpen, project]);

  const upsertProjectAction = useAction(upsertProject, {
    onSuccess: () => {
      toast.success("Projeto criado com sucesso!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.error("Erro ao criar o projeto:", error);
      toast.error("Ocorreu um erro ao criar o projeto!");
    },
  });

  const isLoading = upsertProjectAction.isPending;

  const uploadToR2 = async (file: File) => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileContent: file.type,
      }),
    });
    if (!res.ok) throw new Error("Falha ao obter URL pré-assinada");
    const { signedUrl, fileKey } = await res.json();

    await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    return `https://pub-cc396dbf1dd44f8dad20a09f8a694ebd.r2.dev/${fileKey}`;
  };

  const handleSubmitProject = async (values: UpsertProjectSchema) => {
    // Thumbnail
    let thumbnailUrl: string = "";
    if (Array.isArray(values.thumbnailUrl) && values.thumbnailUrl.length > 0) {
      const thumb = values.thumbnailUrl[0];
      if (typeof thumb === "string") {
        thumbnailUrl = thumb;
      } else if (
        thumb &&
        typeof thumb === "object" &&
        "name" in thumb &&
        "size" in thumb
      ) {
        thumbnailUrl = await uploadToR2(thumb);
      }
    }

    // Certificado
    let certificateUrl: string | undefined = undefined;
    if (
      Array.isArray(values.certificateUrl) &&
      values.certificateUrl.length > 0
    ) {
      const cert = values.certificateUrl[0];
      if (typeof cert === "string") {
        certificateUrl = cert;
      } else if (
        cert &&
        typeof cert === "object" &&
        "name" in cert &&
        "size" in cert
      ) {
        certificateUrl = await uploadToR2(cert);
      }
    }

    // Imagens do projeto
    let imagesUrl: string[] = [];
    if (Array.isArray(values.imagesUrl) && values.imagesUrl.length > 0) {
      imagesUrl = await Promise.all(
        values.imagesUrl.map(async (img) =>
          typeof img === "string"
            ? img
            : img && typeof img === "object" && "name" in img && "size" in img
              ? await uploadToR2(img)
              : "",
        ),
      );
      imagesUrl = imagesUrl.filter(Boolean);
    }

    upsertProjectAction.execute({
      ...values,
      id: project?.id,
      thumbnailUrl,
      certificateUrl,
      imagesUrl,
    });
  };

  return (
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
                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="thumbnailUrl"
                    label="Imagens da Thumbnail"
                    formItemsClassName="px-4"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <div className="h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                          <FileUpload
                            files={field.value}
                            onChange={field.onChange}
                            singleFile
                          />
                        </div>
                      </FormControl>
                    )}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="imagesUrl"
                    label="Imagens do Projeto"
                    optional
                    formItemsClassName="px-4"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <div className="h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                          <FileUpload
                            files={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                    )}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="certificateUrl"
                    label="Certificado"
                    optional
                    formItemsClassName="px-4"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <div className="h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                          <FileUpload
                            files={field.value}
                            onChange={field.onChange}
                            singleFile
                          />
                        </div>
                      </FormControl>
                    )}
                  />

                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.TEXTAREA}
                    name="certificateDesc"
                    label="Descrição - Certificado"
                    placeholder="Descrição do Certificado..."
                    optional
                    textareaClassName="min-h-32 max-w-lg resize-none"
                  />
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
                          <SelectItem
                            key={statusItem}
                            value={statusItem}
                            defaultValue={project?.status}
                          >
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
                    textareaClassName="min-h-32 resize-none"
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
                  disabled={isLoading}
                  variant={"secondary"}
                  className="gap-1.5"
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                disabled={isLoading}
                type="submit"
                className="gap-1.5 font-semibold"
              >
                {isLoading ? (
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
  );
};

export default UpsertProjectForm;
