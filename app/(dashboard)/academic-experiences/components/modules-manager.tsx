"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Plus,
  Trash2,
  BookOpen,
  FileText,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import {
  UpsertAcademicExperienceFormSchema,
  ModuleFormSchema,
  ProgramContentFormSchema,
} from "@/app/_actions/academic-experience/schema";
import { ModuleStatus } from "@prisma/client";
import { FileUpload } from "@/app/(dashboard)/_components/file-upload";
import { FormControl } from "@/app/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/app/components/form/custom-form-field";

interface ModulesManagerProps {
  form: UseFormReturn<UpsertAcademicExperienceFormSchema>;
}

const ModulesManager = ({ form }: ModulesManagerProps) => {
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleValidationErrors, setModuleValidationErrors] = useState<
    string[]
  >([]);
  const [originalModuleData, setOriginalModuleData] =
    useState<ModuleFormSchema | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const modules = form.watch("modules") || [];

  // Função para fazer deep copy de um módulo
  const deepCopyModule = (module: ModuleFormSchema): ModuleFormSchema => {
    return {
      ...module,
      iconUrl: [...(module.iconUrl || [])],
      programContent: (module.programContent || []).map((content) => ({
        ...content,
        certUrl: [...(content.certUrl || [])],
      })),
    };
  };

  // Função para validar se um módulo está completo
  const validateModule = (moduleIndex: number): string[] => {
    const currentModule = modules[moduleIndex];
    const errors: string[] = [];

    if (!currentModule) {
      errors.push("Módulo não encontrado");
      return errors;
    }

    if (!currentModule.title || currentModule.title.trim() === "") {
      errors.push("Título do módulo é obrigatório");
    }

    if (!currentModule.iconUrl || currentModule.iconUrl.length === 0) {
      errors.push("Ícone do módulo é obrigatório");
    }

    if (
      !currentModule.programContent ||
      currentModule.programContent.length === 0
    ) {
      errors.push("Pelo menos um conteúdo programático é obrigatório");
    } else {
      // Validar se todos os conteúdos programáticos têm título e descrição
      const emptyContent = currentModule.programContent.some(
        (content) => !content.title?.trim() || !content.description?.trim(),
      );

      if (emptyContent) {
        errors.push(
          "Todos os conteúdos programáticos devem ter título e descrição preenchidos",
        );
      }
    }

    return errors;
  };

  // Função para concluir a edição com validação
  const finishModuleEditing = () => {
    if (editingModule === null) return;

    const errors = validateModule(editingModule);

    if (errors.length > 0) {
      setModuleValidationErrors(errors);
      return;
    }

    // Se não há erros, concluir edição
    setModuleValidationErrors([]);
    setShowModuleForm(false);
    setEditingModule(null);
    setOriginalModuleData(null);
    setIsCreatingNew(false);
  };

  const addModule = () => {
    const newModule: ModuleFormSchema = {
      title: "",
      iconUrl: [],
      status: ModuleStatus.NOT_STARTED,
      programContent: [],
    };

    const currentModules = form.getValues("modules") || [];
    form.setValue("modules", [...currentModules, newModule]);

    // Marcar como novo módulo e configurar estados
    setIsCreatingNew(true);
    setOriginalModuleData(null); // Não há dados originais para novo módulo
    setEditingModule(currentModules.length);
    setShowModuleForm(true);
    setModuleValidationErrors([]); // Limpar erros ao criar novo módulo
  };

  // Função para cancelar edição e remover módulo vazio se necessário
  const handleCancelModuleEditing = () => {
    if (editingModule === null) return;

    if (isCreatingNew) {
      // Se é um novo módulo, sempre remover da lista
      removeModule(editingModule);
    } else {
      // Se é edição de módulo existente, reverter para dados originais
      if (originalModuleData) {
        const currentModules = form.getValues("modules") || [];
        currentModules[editingModule] = deepCopyModule(originalModuleData);
        form.setValue("modules", currentModules);
      }

      // Resetar estados
      setShowModuleForm(false);
      setEditingModule(null);
      setOriginalModuleData(null);
      setIsCreatingNew(false);
      setModuleValidationErrors([]);
    }
  };

  const removeModule = (index: number) => {
    const currentModules = form.getValues("modules") || [];
    const newModules = currentModules.filter((_, i) => i !== index);
    form.setValue("modules", newModules);

    if (editingModule === index) {
      setEditingModule(null);
      setShowModuleForm(false);
      setOriginalModuleData(null);
      setIsCreatingNew(false);
      setModuleValidationErrors([]); // Limpar erros ao remover módulo
    }
  };

  const editModule = (index: number) => {
    // Salvar dados originais do módulo antes de editar
    const moduleToEdit = modules[index];
    setOriginalModuleData(moduleToEdit ? deepCopyModule(moduleToEdit) : null);
    setIsCreatingNew(false); // Não é novo, é edição
    setEditingModule(index);
    setShowModuleForm(true);
    setModuleValidationErrors([]); // Limpar erros ao editar módulo diferente
  };

  const addProgramContent = (moduleIndex: number) => {
    const newContent: ProgramContentFormSchema = {
      title: "",
      description: "",
      certUrl: [],
    };

    const currentModules = form.getValues("modules") || [];
    const targetModule = currentModules[moduleIndex];
    if (targetModule) {
      targetModule.programContent = [
        ...(targetModule.programContent || []),
        newContent,
      ];
      form.setValue("modules", currentModules);
      clearValidationErrors(); // Limpar erros ao adicionar conteúdo
    }
  };

  const removeProgramContent = (moduleIndex: number, contentIndex: number) => {
    const currentModules = form.getValues("modules") || [];
    const targetModule = currentModules[moduleIndex];
    if (targetModule) {
      targetModule.programContent = (targetModule.programContent || []).filter(
        (_, i) => i !== contentIndex,
      );
      form.setValue("modules", currentModules);
    }
  };

  const getStatusLabel = (status: ModuleStatus) => {
    switch (status) {
      case ModuleStatus.NOT_STARTED:
        return "Não Iniciado";
      case ModuleStatus.IN_PROGRESS:
        return "Em Progresso";
      case ModuleStatus.COMPLETED:
        return "Concluído";
      default:
        return status;
    }
  };

  const getStatusColor = (status: ModuleStatus) => {
    switch (status) {
      case ModuleStatus.NOT_STARTED:
        return "bg-slate-100 text-slate-700 border-slate-200";
      case ModuleStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case ModuleStatus.COMPLETED:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Função para limpar erros de validação
  const clearValidationErrors = () => {
    if (moduleValidationErrors.length > 0) {
      setModuleValidationErrors([]);
    }
  };

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 rounded-full bg-muted/50 p-6">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">Nenhum módulo criado</h3>
        <p className="mb-6 max-w-md text-muted-foreground">
          Organize sua formação em módulos. Cada módulo pode conter múltiplos
          conteúdos programáticos.
        </p>

        <Button
          onClick={addModule}
          size="lg"
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Criar Primeiro Módulo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mostrar lista de módulos OU formulário de edição */}
      {!showModuleForm ? (
        <>
          {/* Lista de módulos existentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Módulos Criados ({modules.length})
              </h3>
              <Button onClick={addModule} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Módulo
              </Button>
            </div>

            <div className="grid gap-4">
              {modules.map((module, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-200 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h4 className="truncate text-lg font-semibold">
                              {module.title || `Módulo ${index + 1}`}
                            </h4>
                            <Badge
                              className={`text-xs ${getStatusColor(module.status)}`}
                            >
                              {getStatusLabel(module.status)}
                            </Badge>
                          </div>
                          <p className="mb-3 text-sm text-muted-foreground">
                            {(module.programContent || []).length} conteúdo(s)
                            programático(s)
                          </p>

                          {/* Lista de conteúdos programáticos */}
                          {(module.programContent || []).length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Conteúdos:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(module.programContent || [])
                                  .slice(0, 3)
                                  .map((content, contentIndex) => (
                                    <Badge
                                      key={contentIndex}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {content.title ||
                                        `Conteúdo ${contentIndex + 1}`}
                                    </Badge>
                                  ))}
                                {(module.programContent || []).length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{(module.programContent || []).length - 3}{" "}
                                    mais
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editModule(index)}
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeModule(index)}
                          className="border-destructive/20 text-destructive hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Formulário de edição de módulo */
        editingModule !== null && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {modules[editingModule]?.title
                  ? `Editando: ${modules[editingModule].title}`
                  : `Novo Módulo`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelModuleEditing}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar à Lista
                </Button>
                <Button
                  variant={
                    moduleValidationErrors.length > 0
                      ? "destructive"
                      : "outline"
                  }
                  size="sm"
                  onClick={finishModuleEditing}
                  className={
                    moduleValidationErrors.length > 0 ? "animate-pulse" : ""
                  }
                >
                  {moduleValidationErrors.length > 0
                    ? "Corrigir Erros"
                    : "Concluir Edição"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exibir erros de validação */}
              {moduleValidationErrors.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-destructive/20 p-1">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 text-sm font-medium text-destructive">
                        Corrija os seguintes problemas antes de concluir:
                      </h4>
                      <ul className="space-y-1 text-sm text-destructive">
                        {moduleValidationErrors.map((error, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="block h-1 w-1 rounded-full bg-destructive" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {/* Configurações do módulo */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`module-title-${editingModule}`}>
                      Título do Módulo{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`module-title-${editingModule}`}
                      placeholder="Ex: Fundamentos de Programação"
                      {...form.register(`modules.${editingModule}.title`, {
                        onChange: clearValidationErrors,
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`module-status-${editingModule}`}>
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={modules[editingModule]?.status}
                      onValueChange={(value) =>
                        form.setValue(
                          `modules.${editingModule}.status`,
                          value as ModuleStatus,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ModuleStatus.NOT_STARTED}>
                          Não Iniciado
                        </SelectItem>
                        <SelectItem value={ModuleStatus.IN_PROGRESS}>
                          Em Progresso
                        </SelectItem>
                        <SelectItem value={ModuleStatus.COMPLETED}>
                          Concluído
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Ícone do Módulo <span className="text-destructive">*</span>
                  </Label>
                  <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-4">
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.SKELETON}
                      name={`modules.${editingModule}.iconUrl`}
                      label=""
                      renderSkeleton={(field) => (
                        <FormControl>
                          <FileUpload
                            files={field.value}
                            onChange={(files) => {
                              field.onChange(files);
                              clearValidationErrors();
                            }}
                            singleFile
                            maxFileSize={2}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Conteúdo Programático */}
              <div className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="flex items-center gap-2 text-lg font-semibold">
                      Conteúdo Programático
                      <span className="text-destructive">*</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione os tópicos e materiais que fazem parte deste
                      módulo
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addProgramContent(editingModule)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Conteúdo
                  </Button>
                </div>

                {(modules[editingModule]?.programContent || []).length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-8 text-center transition-colors hover:bg-muted/30">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h4 className="mb-2 font-semibold text-foreground">
                      Conteúdo Programático Obrigatório
                    </h4>
                    <p className="mx-auto mb-4 max-w-sm text-sm text-muted-foreground">
                      Adicione pelo menos um conteúdo programático para este
                      módulo
                    </p>
                    <Button
                      type="button"
                      onClick={() => addProgramContent(editingModule)}
                      size="sm"
                      className="bg-primary shadow-sm hover:bg-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Primeiro Conteúdo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(modules[editingModule]?.programContent || []).map(
                      (content, contentIndex) => (
                        <Card
                          key={contentIndex}
                          className="border border-muted"
                        >
                          <CardContent className="p-4">
                            <div className="mb-4 flex items-start justify-between">
                              <h5 className="font-medium">
                                Conteúdo {contentIndex + 1}
                              </h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeProgramContent(
                                    editingModule,
                                    contentIndex,
                                  )
                                }
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`content-title-${editingModule}-${contentIndex}`}
                                  >
                                    Título{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id={`content-title-${editingModule}-${contentIndex}`}
                                    placeholder="Ex: Introdução ao JavaScript"
                                    {...form.register(
                                      `modules.${editingModule}.programContent.${contentIndex}.title`,
                                      {
                                        onChange: clearValidationErrors,
                                      },
                                    )}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`content-description-${editingModule}-${contentIndex}`}
                                  >
                                    Descrição{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Textarea
                                    id={`content-description-${editingModule}-${contentIndex}`}
                                    placeholder="Descreva o conteúdo abordado, objetivos de aprendizagem..."
                                    className="min-h-[200px] resize-none"
                                    {...form.register(
                                      `modules.${editingModule}.programContent.${contentIndex}.description`,
                                      {
                                        onChange: clearValidationErrors,
                                      },
                                    )}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Certificado (Opcional)</Label>
                                <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-4">
                                  <CustomFormField
                                    control={form.control}
                                    fieldType={FormFieldType.SKELETON}
                                    name={`modules.${editingModule}.programContent.${contentIndex}.certUrl`}
                                    label=""
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
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default ModulesManager;
