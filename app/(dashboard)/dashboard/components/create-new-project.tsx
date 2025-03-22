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
import { deleteFileFromBucket } from "@/app/api/upload/route";

interface CreateProjectDialogContentProps {
  onSuccess?: () => void;
}

const CreateProjectDialogContent = ({
  onSuccess,
}: CreateProjectDialogContentProps) => {
  // Estados para dados externos
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [status, setStatus] = useState<ProjectStatus[]>([]);

  // Estados locais para URLs dos uploads
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<
    string | null
  >(null);
  const [uploadedImagesUrl, setUploadedImagesUrl] = useState<string[]>([]);
  const [uploadedCertificateUrl, setUploadedCertificateUrl] = useState<
    string | null
  >(null);

  // Configuração do formulário
  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      certificateUrl: "",
      certificateDesc: "",
      imagesUrl: [],
      thumbnailUrl: "",
      repositoryUrl: "",
      deployUrl: "",
      status: "" as ProjectStatus,
      technologies: [],
    },
  });

  // Buscar tecnologias ao montar o componente
  useEffect(() => {
    const fetchTechnologies = async () => {
      const techs = await getTechnologies();
      setTechnologies(techs);
    };
    fetchTechnologies();
  }, []);

  // Configura os status com base no enum ProjectStatus
  useEffect(() => {
    setStatus(Object.values(ProjectStatus));
  }, []);

  // Função para upload de um único arquivo (thumbnail e certificado)
  const handleSingleFileUpload = async (
    file: File,
    field: "thumbnailUrl" | "certificateUrl",
  ): Promise<string | null> => {
    try {
      const fileName = file.name;
      const fileContent = file.type;

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileContent }),
      });

      if (!uploadResponse.ok)
        throw new Error("Falha ao obter URL pré-assinada");

      const { signedUrl, fileKey } = await uploadResponse.json();

      const fileUploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": fileContent },
        body: file,
      });

      if (!fileUploadResponse.ok) throw new Error("Falha no upload");

      const customUrl = `https://pub-14cdb793b4b54085abc21edea67d935a.r2.dev/${fileKey}`;

      // Validação para atribuir o valor corretamente
      if (field === "thumbnailUrl") {
        setUploadedThumbnailUrl(customUrl);
      } else if (field === "certificateUrl") {
        setUploadedCertificateUrl(customUrl);
      }

      return customUrl;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao subir o arquivo");
      return null;
    }
  };

  // Função para upload de múltiplos arquivos (imagens do projeto)
  const handleMultipleFileUpload = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const fileName = file.name;
        const fileContent = file.type;

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, fileContent }),
        });

        if (!uploadResponse.ok)
          throw new Error("Falha ao obter URL pré-assinada");

        const { signedUrl, fileKey } = await uploadResponse.json();

        const fileUploadResponse = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": fileContent },
          body: file,
        });

        if (!fileUploadResponse.ok) throw new Error("Falha no upload");

        const customUrl = `https://pub-14cdb793b4b54085abc21edea67d935a.r2.dev/${fileKey}`;
        uploadedUrls.push(customUrl);
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        toast.error(`Erro ao subir o arquivo: ${file.name}`);
      }
    }
    return uploadedUrls;
  };

  // Função para deletar um arquivo único (thumbnail ou certificado)
  const handleDeleteSingleFile = async (fileUrl: string, fieldName: string) => {
    try {
      const fileKey = fileUrl.split("/").pop();
      if (!fileKey) return;

      await deleteFileFromBucket(fileKey);

      // Atualiza o estado e o formulário de acordo com o campo
      if (fieldName === "thumbnailUrl") {
        setUploadedThumbnailUrl("");
        form.setValue("thumbnailUrl", "");
      } else if (fieldName === "certificateUrl") {
        setUploadedCertificateUrl("");
        form.setValue("certificateUrl", "");
      }

      toast.success("Arquivo removido com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar o arquivo:", error);
      toast.error("Erro ao deletar o arquivo");
    }
  };

  // Função para deletar uma imagem específica do array de imagens
  const handleDeleteImageFromArray = async (fileUrl: string) => {
    try {
      const fileKey = fileUrl.split("/").pop();
      if (!fileKey) return;
      await deleteFileFromBucket(fileKey);
      // Atualiza o estado e o formulário removendo a imagem específica
      const updatedImages = uploadedImagesUrl.filter((url) => url !== fileUrl);
      setUploadedImagesUrl(updatedImages);
      form.setValue("imagesUrl", updatedImages);
      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      toast.error("Erro ao deletar a imagem");
    }
  };

  // Submissão do formulário
  const handleSubmitProject = async (data: CreateProjectSchema) => {
    try {
      await createProject({ ...data });
      toast.success("Projeto criado com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar o projeto:", error);
      toast.error("Ocorreu um erro ao criar o projeto!");
    }
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
            {/* Área esquerda: Uploads */}
            <div className="mr-2 flex h-full basis-2/5 flex-col overflow-hidden">
              <ScrollArea>
                <div className="space-y-4 pb-2">
                  {/* Thumbnail */}
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({}) => (
                      <FormItem className="px-4">
                        <FormLabel>Imagem da Thumbnail</FormLabel>
                        <FormControl>
                          <FileUpload
                            key="thumbnailUrl"
                            singleFile
                            onChange={async (files) => {
                              if (files.length > 0) {
                                const fileUrl = await handleSingleFileUpload(
                                  files[0],
                                  "thumbnailUrl",
                                );
                                if (fileUrl) {
                                  setUploadedThumbnailUrl(fileUrl);
                                  form.setValue("thumbnailUrl", fileUrl);
                                }
                              }
                            }}
                            uploadedFileUrl={uploadedThumbnailUrl || ""}
                            handleDeleteFile={(fileKey, onSuccess) => {
                              handleDeleteSingleFile(fileKey, "thumbnailUrl");
                              onSuccess();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Imagens do Projeto */}
                  <FormField
                    control={form.control}
                    name="imagesUrl"
                    render={({}) => (
                      <FormItem className="px-4">
                        <FormLabel>Imagens do Projeto</FormLabel>
                        <FormControl>
                          <FileUpload
                            key="imagesUrl"
                            onChange={async (files) => {
                              if (files.length > 0) {
                                const fileUrls =
                                  await handleMultipleFileUpload(files);
                                const newImages = [
                                  ...uploadedImagesUrl,
                                  ...fileUrls,
                                ];
                                setUploadedImagesUrl(newImages);
                                form.setValue("imagesUrl", newImages);
                              }
                            }}
                            uploadedFileUrl={uploadedImagesUrl[0]}
                            handleDeleteFile={(fileUrl: string) =>
                              handleDeleteImageFromArray(fileUrl)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Certificado */}
                  <FormField
                    control={form.control}
                    name="certificateUrl"
                    render={({}) => (
                      <FormItem className="px-4">
                        <FormLabel>
                          Certificado{" "}
                          <span className="text-xs text-muted-foreground">
                            (opcional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            key="certificateUrl"
                            singleFile
                            onChange={async (files) => {
                              if (files.length > 0) {
                                const fileUrl = await handleSingleFileUpload(
                                  files[0],
                                  "certificateUrl",
                                );
                                if (fileUrl) {
                                  setUploadedCertificateUrl(fileUrl);
                                  form.setValue("certificateUrl", fileUrl);
                                }
                              }
                            }}
                            uploadedFileUrl={uploadedCertificateUrl || ""}
                            handleDeleteFile={(fileKey, onSuccess) => {
                              handleDeleteSingleFile(fileKey, "certificateUrl");
                              onSuccess();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Descrição do Certificado (se houver certificado) */}
                  {uploadedCertificateUrl && (
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
                              className="min-h-32 resize-none"
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

            {/* Área direita: Informações do Projeto */}
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
                            <Input placeholder="Título do Projeto" {...field} />
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
                                    {statusItem === ProjectStatus.IN_PROGRESS &&
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
                                                    (field.value || []).filter(
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
                              <Input placeholder="Link de Deploy" {...field} />
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
                className="gap-1.5 font-semibold text-secondary"
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
  );
};

export default CreateProjectDialogContent;
