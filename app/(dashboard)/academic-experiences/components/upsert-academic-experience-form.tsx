"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcademicExperienceWithModules } from "@/app/types/academic-experience";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Form } from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  GraduationCap,
  Building2,
  FileText,
  BookOpen,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleFileUpload } from "@/app/utils/create-file";
import { useAction } from "next-safe-action/hooks";
import { upsertAcademicExperience } from "@/app/_actions/academic-experience/academic-experience.actions";
import {
  upsertAcademicExperienceFormSchema,
  UpsertAcademicExperienceFormSchema,
} from "@/app/_actions/academic-experience/schema";
import CustomFormField, {
  FormFieldType,
} from "@/app/components/form/custom-form-field";
import { FileUpload } from "@/app/(dashboard)/_components/file-upload";
import { FormControl } from "@/app/components/ui/form";
import ModulesManager from "./modules-manager";
import { cn } from "@/app/lib/utils";

interface UpsertAcademicExperienceFormProps {
  isOpen: boolean;
  onSuccess: () => void;
  academicExperience?: AcademicExperienceWithModules;
}

const TABS = [
  {
    id: "basic",
    title: "Informações Básicas",
    icon: GraduationCap,
    fields: ["title", "type", "dateDuration", "description"],
  },
  {
    id: "institution",
    title: "Instituição",
    icon: Building2,
    fields: ["institution", "institutionUrl", "imageUrl"],
  },
  {
    id: "documents",
    title: "Documentos",
    icon: FileText,
    fields: ["certificateUrl", "declarationUrl"],
  },
  {
    id: "modules",
    title: "Módulos",
    icon: BookOpen,
    fields: ["modules"],
  },
] as const;

const UpsertAcademicExperienceForm = ({
  isOpen,
  onSuccess,
  academicExperience,
}: UpsertAcademicExperienceFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const upsertAcademicExperienceAction = useAction(upsertAcademicExperience, {
    onSuccess: () => {
      toast.success(
        academicExperience
          ? "Experiência acadêmica atualizada com sucesso!"
          : "Experiência acadêmica criada com sucesso!",
      );
      form.reset();
      setActiveTab("basic");
      setHasUnsavedChanges(false);
      onSuccess();
      router.refresh();
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError);
      } else {
        toast.error("Erro ao salvar experiência acadêmica");
      }
    },
  });

  const getDefaultValues = (
    academicExperience?: AcademicExperienceWithModules,
  ): UpsertAcademicExperienceFormSchema => ({
    id: academicExperience?.id || undefined,
    title: academicExperience?.title || "",
    type: academicExperience?.type || "",
    dateDuration: academicExperience?.dateDuration || "",
    institution: academicExperience?.institution || "",
    description: academicExperience?.description || "",
    imageUrl: academicExperience?.imageUrl ? [academicExperience.imageUrl] : [],
    institutionUrl: academicExperience?.institutionUrl || "",
    certificateUrl: academicExperience?.certificateUrl
      ? [academicExperience.certificateUrl]
      : [],
    declarationUrl: academicExperience?.declarationUrl
      ? [academicExperience.declarationUrl]
      : [],
    modules:
      academicExperience?.modules?.map((module) => ({
        id: module.id,
        title: module.title,
        iconUrl: module.iconUrl ? [module.iconUrl] : [],
        status: module.status,
        programContent:
          module.programContent?.map((content) => ({
            id: content.id,
            title: content.title,
            description: content.description,
            certUrl: content.certUrl ? [content.certUrl] : [],
          })) || [],
      })) || [],
  });

  const form = useForm<UpsertAcademicExperienceFormSchema>({
    resolver: zodResolver(upsertAcademicExperienceFormSchema),
    defaultValues: getDefaultValues(academicExperience),
  });

  // Observar valores do formulário para validação reativa
  const watchedValues = useWatch({ control: form.control });

  // Atualizar os valores do formulário quando academicExperience mudar
  useEffect(() => {
    if (isOpen) {
      const newValues = getDefaultValues(academicExperience);
      form.reset(newValues);
      setActiveTab("basic"); // Resetar para a primeira aba
      setHasUnsavedChanges(false);
    }
  }, [academicExperience, isOpen, form]);

  // Detectar mudanças no formulário
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Garantir que o AlertDialog seja fechado quando o Dialog principal for fechado
  useEffect(() => {
    if (!isOpen) {
      setShowConfirmDialog(false);
      setHasUnsavedChanges(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Função de validação reativa usando useMemo
  const getTabValidationState = useMemo(() => {
    return (tabId: string) => {
      const tab = TABS.find((t) => t.id === tabId);
      if (!tab) return "valid";

      // Garantir que watchedValues existe antes de fazer verificações
      if (!watchedValues) return "empty";

      const fieldsToCheck = [...tab.fields];

      // Verificação especial para módulos
      if (tabId === "modules") {
        const modules = watchedValues.modules;
        if (!modules || modules.length === 0) {
          return "error";
        }
        // Verificar se todos os módulos têm dados obrigatórios
        const hasInvalidModule = modules.some((module) => {
          if (!module.title || !module.iconUrl || module.iconUrl.length === 0) {
            return true;
          }
          // Verificar se tem pelo menos um conteúdo programático válido
          if (!module.programContent || module.programContent.length === 0) {
            return true;
          }
          return module.programContent.some((content) => {
            return !content.title || !content.description;
          });
        });
        return hasInvalidModule ? "error" : "valid";
      }

      // Para documentos, todos são opcionais - sempre válido se não há erros
      if (tabId === "documents") {
        const hasErrors = fieldsToCheck.some((field) => {
          const fieldState = form.getFieldState(
            field as keyof UpsertAcademicExperienceFormSchema,
          );
          return fieldState.error;
        });
        return hasErrors ? "error" : "valid";
      }

      // Para outros campos, verificar se há erros de validação
      const hasErrors = fieldsToCheck.some((field) => {
        const fieldState = form.getFieldState(
          field as keyof UpsertAcademicExperienceFormSchema,
        );
        return fieldState.error;
      });

      // Verificar se TODOS os valores obrigatórios estão preenchidos
      const allRequiredFieldsFilled = fieldsToCheck.every((field) => {
        const value = watchedValues[field as keyof typeof watchedValues];

        if (Array.isArray(value)) return value.length > 0;
        return Boolean(value && String(value).trim());
      });

      if (hasErrors) return "error";
      if (allRequiredFieldsFilled) return "valid";
      return "empty";
    };
  }, [watchedValues, form]);

  const handleSubmitAcademicExperience = async (
    values: UpsertAcademicExperienceFormSchema,
  ) => {
    try {
      // Imagem principal
      let imageUrl: string = "";
      if (Array.isArray(values.imageUrl) && values.imageUrl.length > 0) {
        const img = values.imageUrl[0];
        if (typeof img === "string") {
          imageUrl = img;
        } else if (
          img &&
          typeof img === "object" &&
          "name" in img &&
          "size" in img
        ) {
          imageUrl = await handleFileUpload(img);
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
          certificateUrl = await handleFileUpload(cert);
        }
      }

      // Declaração
      let declarationUrl: string | undefined = undefined;
      if (
        Array.isArray(values.declarationUrl) &&
        values.declarationUrl.length > 0
      ) {
        const decl = values.declarationUrl[0];
        if (typeof decl === "string") {
          declarationUrl = decl;
        } else if (
          decl &&
          typeof decl === "object" &&
          "name" in decl &&
          "size" in decl
        ) {
          declarationUrl = await handleFileUpload(decl);
        }
      }

      // Processar módulos
      const processedModules = await Promise.all(
        (values.modules || []).map(async (module) => {
          // Upload do ícone do módulo
          let iconUrl: string = "";
          if (Array.isArray(module.iconUrl) && module.iconUrl.length > 0) {
            const icon = module.iconUrl[0];
            if (typeof icon === "string") {
              iconUrl = icon;
            } else if (
              icon &&
              typeof icon === "object" &&
              "name" in icon &&
              "size" in icon
            ) {
              iconUrl = await handleFileUpload(icon);
            }
          }

          // Processar conteúdo programático
          const processedProgramContent = await Promise.all(
            (module.programContent || []).map(async (content) => {
              let certUrl: string | undefined = undefined;
              if (
                Array.isArray(content.certUrl) &&
                content.certUrl.length > 0
              ) {
                const cert = content.certUrl[0];
                if (typeof cert === "string") {
                  certUrl = cert;
                } else if (
                  cert &&
                  typeof cert === "object" &&
                  "name" in cert &&
                  "size" in cert
                ) {
                  certUrl = await handleFileUpload(cert);
                }
              }

              return {
                id: content.id,
                title: content.title,
                description: content.description,
                certUrl,
              };
            }),
          );

          return {
            id: module.id,
            title: module.title,
            iconUrl,
            status: module.status,
            programContent: processedProgramContent,
          };
        }),
      );

      upsertAcademicExperienceAction.execute({
        ...values,
        id: academicExperience?.id,
        imageUrl,
        certificateUrl,
        declarationUrl,
        modules: processedModules,
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao fazer upload dos arquivos!");
    }
  };

  const onSubmit = async (data: UpsertAcademicExperienceFormSchema) => {
    // Validar todos os campos obrigatórios
    const isValid = await form.trigger();

    if (!isValid) {
      // Encontrar a primeira aba com erro e navegar para ela
      for (const tab of TABS) {
        const tabState = getTabValidationState(tab.id);
        if (tabState === "error") {
          setActiveTab(tab.id);
          toast.error(`Preencha os campos obrigatórios em "${tab.title}"`);
          return;
        }
      }
    }

    // Validar se módulos estão preenchidos
    if (!data.modules || data.modules.length === 0) {
      toast.error("Pelo menos um módulo é obrigatório");
      setActiveTab("modules");
      return;
    }

    await handleSubmitAcademicExperience(data);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const handleClose = () => {
    if (hasUnsavedChanges && !isClosing) {
      setShowConfirmDialog(true);
    } else {
      onSuccess();
    }
  };

  const handleConfirmClose = () => {
    setIsClosing(true);
    setShowConfirmDialog(false);
    setHasUnsavedChanges(false);
    // Aguardar o AlertDialog fechar completamente antes de fechar o Dialog principal
    setTimeout(() => {
      setIsClosing(false);
      onSuccess();
    }, 150);
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              {academicExperience
                ? "Editar Experiência Acadêmica"
                : "Nova Experiência Acadêmica"}
              {hasUnsavedChanges && (
                <Badge variant="outline" className="ml-auto">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Não salvo
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-base">
              {academicExperience
                ? "Atualize os dados da sua experiência acadêmica. Use as abas para navegar entre as seções."
                : "Adicione uma nova experiência acadêmica ao seu portfólio. Preencha todos os campos obrigatórios."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex h-[calc(90vh-220px)] gap-6">
            {/* Sidebar de navegação */}
            <div className="w-64 flex-shrink-0 space-y-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Seções
                </h3>
                <nav className="space-y-1">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const validationState = getTabValidationState(tab.id);
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-all",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="flex-1 truncate">{tab.title}</span>
                        {validationState === "error" && (
                          <AlertCircle className="h-3 w-3 text-destructive" />
                        )}
                        {validationState === "valid" && (
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Resumo do progresso */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="mb-2 text-sm font-medium">Progresso</h4>
                  <div className="space-y-2">
                    {TABS.map((tab) => {
                      const validationState = getTabValidationState(tab.id);
                      return (
                        <div
                          key={tab.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-muted-foreground">
                            {tab.title}
                          </span>
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              validationState === "valid" && "bg-emerald-500",
                              validationState === "error" && "bg-destructive",
                              validationState === "empty" &&
                                "bg-muted-foreground/30",
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 overflow-y-auto">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Aba: Informações Básicas */}
                  {activeTab === "basic" && (
                    <Card>
                      <CardContent className="space-y-6 p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <h2 className="text-lg font-semibold">
                            Informações Básicas
                          </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.INPUT}
                              name="title"
                              label="Título da Formação"
                              placeholder="Ex: Bacharelado em Ciência da Computação"
                            />
                          </div>

                          <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.INPUT}
                            name="type"
                            label="Tipo de Formação"
                            placeholder="Ex: Graduação, Pós-graduação, Curso"
                          />

                          <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.INPUT}
                            name="dateDuration"
                            label="Duração"
                            placeholder="Ex: 2020 - 2024, Jan 2023 - Dez 2023"
                          />

                          <div className="md:col-span-2">
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.TEXTAREA}
                              name="description"
                              label="Descrição da Formação"
                              placeholder="Descreva brevemente a formação, principais conhecimentos adquiridos, áreas de foco..."
                              textareaClassName="resize-none min-h-32"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Aba: Instituição */}
                  {activeTab === "institution" && (
                    <Card>
                      <CardContent className="space-y-6 p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-primary" />
                          <h2 className="text-lg font-semibold">
                            Instituição de Ensino
                          </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Informações da Instituição */}
                          <div className="space-y-6">
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.INPUT}
                              name="institution"
                              label="Nome da Instituição"
                              placeholder="Ex: Universidade Federal de São Paulo"
                            />

                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.INPUT}
                              name="institutionUrl"
                              label="Site da Instituição"
                              placeholder="https://www.unifesp.br"
                              typeInput="url"
                            />
                          </div>

                          {/* Logo da Instituição */}
                          <div className="space-y-3">
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.SKELETON}
                              name="imageUrl"
                              label="Logo da Instituição"
                              renderSkeleton={(field) => (
                                <FormControl>
                                  <FileUpload
                                    files={field.value}
                                    onChange={field.onChange}
                                    singleFile
                                    maxFileSize={5}
                                  />
                                </FormControl>
                              )}
                            />
                            <p className="text-xs text-muted-foreground">
                              Formato PNG, JPG ou SVG. Máximo 5MB.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Aba: Documentos */}
                  {activeTab === "documents" && (
                    <Card>
                      <CardContent className="space-y-6 p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <h2 className="text-lg font-semibold">
                            Documentos e Certificações
                          </h2>
                          <Badge variant="secondary" className="ml-auto">
                            Opcional
                          </Badge>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="space-y-4">
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.SKELETON}
                              name="certificateUrl"
                              label="Certificado de Conclusão"
                              optional
                              renderSkeleton={(field) => (
                                <FormControl>
                                  <FileUpload
                                    files={field.value}
                                    onChange={field.onChange}
                                    singleFile
                                    maxFileSize={10}
                                  />
                                </FormControl>
                              )}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                              Certificado oficial de conclusão do curso. PDF até
                              10MB.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.SKELETON}
                              name="declarationUrl"
                              label="Declaração de Participação"
                              optional
                              renderSkeleton={(field) => (
                                <FormControl>
                                  <FileUpload
                                    files={field.value}
                                    onChange={field.onChange}
                                    singleFile
                                    maxFileSize={10}
                                  />
                                </FormControl>
                              )}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                              Declaração de participação ou histórico escolar.
                              PDF até 10MB.
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-4">
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              <p className="mb-1 font-medium">
                                Sobre os documentos
                              </p>
                              <p>
                                Os documentos são opcionais mas recomendados
                                para comprovar sua formação. Aceitos apenas
                                arquivos PDF. Certifique-se de que os documentos
                                estejam legíveis.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Aba: Módulos */}
                  {activeTab === "modules" && (
                    <Card>
                      <CardContent className="space-y-6 p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h2 className="text-lg font-semibold">
                            Módulos e Conteúdo Programático
                          </h2>
                          <Badge variant="secondary" className="ml-auto">
                            Obrigatório
                          </Badge>
                        </div>

                        <ModulesManager form={form} />

                        {form.formState.errors.modules && (
                          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              <p className="text-sm font-medium text-destructive">
                                {form.formState.errors.modules.message ||
                                  "Pelo menos um módulo é obrigatório"}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </form>
              </Form>
            </div>
          </div>

          {/* Footer com botões de ação */}
          <DialogFooter className="border-t bg-muted/30 px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {hasUnsavedChanges && (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>Alterações não salvas</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={form.formState.isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {academicExperience ? "Atualizando..." : "Salvando..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {academicExperience ? "Atualizar" : "Salvar"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para confirmar saída sem salvar */}
      {showConfirmDialog && (
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={(open) => {
            if (!open) {
              handleCancelClose();
            }
          }}
        >
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Alterações não salvas
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você tem alterações não salvas no formulário. Se continuar,
                todas as alterações serão perdidas.
                <br />
                <strong>Deseja realmente sair sem salvar?</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelClose}>
                Continuar editando
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmClose}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sair sem salvar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default UpsertAcademicExperienceForm;
