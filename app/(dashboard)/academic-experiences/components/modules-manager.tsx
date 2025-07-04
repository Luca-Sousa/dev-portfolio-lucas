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
import { Plus, Trash2, BookOpen, FileText } from "lucide-react";
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
  const modules = form.watch("modules") || [];
  const modulesError = form.formState.errors.modules;

  const addModule = () => {
    const newModule: ModuleFormSchema = {
      title: "",
      iconUrl: [],
      status: ModuleStatus.NOT_STARTED,
      programContent: [],
    };

    const currentModules = form.getValues("modules") || [];
    form.setValue("modules", [...currentModules, newModule]);
    setEditingModule(currentModules.length);
    setShowModuleForm(true);
  };

  const removeModule = (index: number) => {
    const currentModules = form.getValues("modules") || [];
    const newModules = currentModules.filter((_, i) => i !== index);
    form.setValue("modules", newModules);

    if (editingModule === index) {
      setEditingModule(null);
      setShowModuleForm(false);
    }
  };

  const editModule = (index: number) => {
    setEditingModule(index);
    setShowModuleForm(true);
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
        {modulesError && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/5 p-3">
            <p className="text-sm font-medium text-destructive">
              {modulesError.message || "Pelo menos um módulo é obrigatório"}
            </p>
          </div>
        )}
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
                                +{(module.programContent || []).length - 3} mais
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

      {/* Formulário de edição de módulo */}
      {showModuleForm && editingModule !== null && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {modules[editingModule]?.title
                ? `Editando: ${modules[editingModule].title}`
                : `Novo Módulo`}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowModuleForm(false);
                setEditingModule(null);
              }}
            >
              Concluir Edição
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configurações do módulo */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`module-title-${editingModule}`}>
                    Título do Módulo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`module-title-${editingModule}`}
                    placeholder="Ex: Fundamentos de Programação"
                    {...form.register(`modules.${editingModule}.title`)}
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
                          onChange={field.onChange}
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
                  <h4 className="text-lg font-semibold">
                    Conteúdo Programático
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Adicione os tópicos e materiais que fazem parte deste módulo
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
                <div className="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                  <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>Nenhum conteúdo programático adicionado</p>
                  <p className="text-xs">
                    Clique em &ldquo;Adicionar Conteúdo&rdquo; para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(modules[editingModule]?.programContent || []).map(
                    (content, contentIndex) => (
                      <Card key={contentIndex} className="border border-muted">
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
                                  className="min-h-[100px]"
                                  {...form.register(
                                    `modules.${editingModule}.programContent.${contentIndex}.description`,
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
      )}
    </div>
  );
};

export default ModulesManager;
