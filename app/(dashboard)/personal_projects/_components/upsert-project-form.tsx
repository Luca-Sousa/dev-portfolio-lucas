"use client";

import { Button } from "@/app/components/ui/button";
import { FormControl, Form } from "@/app/components/ui/form";
import { SelectItem } from "@/app/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectStatus, Technology } from "@prisma/client";
import {
  Loader2Icon,
  Save,
  ImageIcon,
  Images,
  FileText,
  Zap,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileUpload } from "@/app/(dashboard)/_components/file-upload";
import { SortableImageUpload } from "@/app/(dashboard)/personal_projects/_components/sortable-image-upload";
import { getTechnologies } from "@/app/data_access/get-technologies";
import CustomFormField, {
  FormFieldType,
} from "@/app/components/form/custom-form-field";
import { useAction } from "next-safe-action/hooks";
import { upsertProject } from "@/app/_actions/project/project.actions";
import { z } from "zod";
import { fileOrUrl } from "@/app/lib/utils";
import { Project } from "@/app/types";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

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
  thumbnailUrl: fileOrUrl.min(1, { message: "A thumbnail é obrigatória" }),
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

const STEPS = [
  {
    id: "thumbnail",
    title: "Thumbnail",
    description: "Imagem principal do projeto",
    icon: ImageIcon,
  },
  {
    id: "gallery",
    title: "Galeria",
    description: "Imagens do projeto",
    icon: Images,
  },
  {
    id: "info",
    title: "Informações",
    description: "Dados gerais do projeto",
    icon: FileText,
  },
  {
    id: "technologies",
    title: "Tecnologias",
    description: "Tecnologias utilizadas",
    icon: Zap,
  },
  {
    id: "certificate",
    title: "Certificado",
    description: "Certificado e descrição",
    icon: Award,
  },
] as const;

type Step = (typeof STEPS)[number]["id"];

const UpsertProjectForm = ({
  isOpen,
  project,
  onSuccess,
}: UpsertProjectFormProps) => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [status, setStatus] = useState<ProjectStatus[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("thumbnail");

  const form = useForm<UpsertProjectSchema>({
    resolver: zodResolver(upsertProjectSchema),
    mode: "onChange", // Para validar em tempo real
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      certificateUrl: [],
      certificateDesc: "",
      imagesUrl: [],
      thumbnailUrl: [],
      repositoryUrl: "",
      deployUrl: "",
      figmaUrl: "",
      status: "IN_PROGRESS" as ProjectStatus,
      technologies: [],
    },
  });

  // Função para verificar se uma etapa está completa
  const isStepComplete = (stepId: Step): boolean => {
    // Se tem erros, não está completa
    if (hasStepErrors(stepId)) return false;

    const values = form.getValues();

    switch (stepId) {
      case "thumbnail":
        return !!(values.thumbnailUrl && values.thumbnailUrl.length > 0);
      case "gallery":
        return true; // Galeria é opcional
      case "info":
        return !!(
          values.title?.trim() &&
          values.description?.trim() &&
          values.repositoryUrl?.trim() &&
          values.startDate &&
          values.status
        );
      case "technologies":
        return !!(values.technologies && values.technologies.length > 0);
      case "certificate":
        return true; // Certificado é opcional
      default:
        return false;
    }
  };

  // Função para verificar se uma etapa tem erros
  const hasStepErrors = (stepId: Step): boolean => {
    const errors = form.formState.errors;

    switch (stepId) {
      case "thumbnail":
        return !!errors.thumbnailUrl;
      case "gallery":
        return !!errors.imagesUrl;
      case "info":
        return !!(
          errors.title ||
          errors.description ||
          errors.repositoryUrl ||
          errors.startDate ||
          errors.status ||
          errors.deployUrl ||
          errors.figmaUrl
        );
      case "technologies":
        return !!errors.technologies;
      case "certificate":
        return !!(errors.certificateUrl || errors.certificateDesc);
      default:
        return false;
    }
  };

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
      // Sempre criar novos arrays/objetos para evitar referências cruzadas
      const resetValues = {
        title: project?.title || "",
        description: project?.description || "",
        startDate: project?.startDate || new Date(),
        certificateUrl: project?.certificateUrl ? [project.certificateUrl] : [],
        certificateDesc: project?.certificateDesc || "",
        imagesUrl: project?.imagesUrl ? [...project.imagesUrl] : [],
        thumbnailUrl: project?.thumbnailUrl ? [project.thumbnailUrl] : [],
        repositoryUrl: project?.repositoryUrl || "",
        deployUrl: project?.deployUrl || "",
        figmaUrl: project?.figmaUrl || "",
        status: project?.status || ("IN_PROGRESS" as ProjectStatus),
        technologies: project?.technologies?.map((tech) => tech.id) || [],
      };

      form.reset(resetValues);
      setCurrentStep("thumbnail");
    }
  }, [form, isOpen, project]);

  const upsertProjectAction = useAction(upsertProject, {
    onSuccess: () => {
      toast.success(
        project
          ? "Projeto atualizado com sucesso!"
          : "Projeto criado com sucesso!",
      );
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.error("Erro ao salvar o projeto:", error);
      toast.error("Ocorreu um erro ao salvar o projeto!");
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
    try {
      // Thumbnail
      let thumbnailUrl: string = "";
      if (
        Array.isArray(values.thumbnailUrl) &&
        values.thumbnailUrl.length > 0
      ) {
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
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao fazer upload dos arquivos!");
    }
  };

  // Função para renderizar o conteúdo de cada step
  const renderStepContent = () => {
    switch (currentStep) {
      case "thumbnail":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Thumbnail do Projeto</h3>
              <p className="text-sm text-muted-foreground">
                Selecione a imagem principal que representará seu projeto
              </p>
            </div>

            <CustomFormField
              key={`thumbnail-${currentStep}`}
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="thumbnailUrl"
              label="Imagem da Thumbnail"
              renderSkeleton={(field) => (
                <FormControl>
                  <div className="rounded-lg border-2 border-dashed border-border bg-card">
                    <FileUpload
                      files={field.value}
                      onChange={field.onChange}
                      singleFile
                    />
                  </div>
                </FormControl>
              )}
            />
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Galeria de Imagens</h3>
              <p className="text-sm text-muted-foreground">
                Adicione imagens que mostrem seu projeto em funcionamento
              </p>
            </div>
            <CustomFormField
              key={`gallery-${currentStep}`}
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="imagesUrl"
              label="Imagens do Projeto"
              optional
              renderSkeleton={(field) => (
                <FormControl>
                  <SortableImageUpload
                    files={field.value}
                    onChange={field.onChange}
                    maxFiles={8}
                    maxFileSize={10}
                    showPreview={true}
                  />
                </FormControl>
              )}
            />
          </div>
        );

      case "info":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Informações do Projeto</h3>
              <p className="text-sm text-muted-foreground">
                Dados básicos e links relacionados ao projeto
              </p>
            </div>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="title"
              label="Título do Projeto"
              placeholder="Digite o título do projeto"
            />

            <div className="grid grid-cols-2 gap-6">
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
                label="Status do Projeto"
                placeholder="Selecione um status"
              >
                {status.map((statusItem) => (
                  <SelectItem
                    key={statusItem}
                    value={statusItem}
                    defaultValue={project?.status}
                  >
                    {statusItem === ProjectStatus.IN_UPDATE && "Em Atualização"}
                    {statusItem === ProjectStatus.IN_PRODUCTION && "Finalizado"}
                    {statusItem === ProjectStatus.IN_PROGRESS &&
                      "Em Desenvolvimento"}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label="Descrição do Projeto"
              placeholder="Descreva o projeto, suas funcionalidades e objetivos..."
              textareaClassName="min-h-32 resize-none"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="repositoryUrl"
              label="URL do Repositório"
              placeholder="https://github.com/usuario/projeto"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="deployUrl"
              label="URL do Deploy"
              placeholder="https://projeto.vercel.app"
              optional
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="figmaUrl"
              label="URL do Figma"
              placeholder="https://figma.com/design/..."
              optional
            />
          </div>
        );

      case "technologies":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Tecnologias Utilizadas</h3>
              <p className="text-sm text-muted-foreground">
                Selecione e ordene as tecnologias usadas no projeto
              </p>
            </div>
            <CustomFormField
              key={`technologies-${currentStep}-${technologies.length}`}
              control={form.control}
              fieldType={FormFieldType.SORTABLE_TECH_SELECTOR}
              name="technologies"
              label="Tecnologias"
              allTechnologies={technologies}
            />
          </div>
        );

      case "certificate":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Certificado</h3>
              <p className="text-sm text-muted-foreground">
                Adicione certificado ou comprovante relacionado ao projeto
              </p>
            </div>

            <CustomFormField
              key={`certificate-${currentStep}`}
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="certificateUrl"
              label="Arquivo do Certificado"
              optional
              renderSkeleton={(field) => (
                <FormControl>
                  <div className="rounded-lg border-2 border-dashed border-border bg-card">
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
              label="Descrição do Certificado"
              placeholder="Descreva o certificado ou curso relacionado..."
              textareaClassName="min-h-32 resize-none"
              optional
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DialogContent className="flex h-full max-h-[80vh] max-w-4xl flex-col p-0">
      <DialogHeader className="px-6 pb-4 pt-6">
        <DialogTitle>
          {project ? "Editar Projeto" : "Criar Novo Projeto"}
        </DialogTitle>
        <DialogDescription>
          Preencha as informações do projeto seguindo as etapas
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral com steps */}
        <div className="w-64 border-r border-border bg-muted/30 p-4">
          <nav className="space-y-2">
            {STEPS.map((step) => {
              const IconComponent = step.icon;
              const isComplete = isStepComplete(step.id);
              const hasErrors = hasStepErrors(step.id);
              const isCurrent = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full rounded-lg p-3 text-left transition-all duration-200 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        isCurrent
                          ? "bg-primary-foreground text-primary"
                          : hasErrors
                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                            : isComplete
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <IconComponent size={16} />
                      {/* Bolinha verde para completo */}
                      {isComplete && !isCurrent && !hasErrors && (
                        <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      )}
                      {/* Bolinha vermelha para com erros */}
                      {hasErrors && !isCurrent && (
                        <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitProject)}>
                {renderStepContent()}
              </form>
            </Form>
          </div>

          {/* Footer com botão de salvar */}
          <div className="border-t border-border p-6">
            <div className="flex justify-end">
              <Button
                disabled={isLoading}
                onClick={form.handleSubmit(handleSubmitProject)}
                size="lg"
                className="min-w-full gap-2 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="animate-spin" size={16} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {project ? "Atualizar Projeto" : "Criar Projeto"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
export default UpsertProjectForm;
