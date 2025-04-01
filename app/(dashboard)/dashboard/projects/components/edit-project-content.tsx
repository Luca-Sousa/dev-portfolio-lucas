"use client";

import { updateProjectDescription } from "@/app/(dashboard)/actions/project/update-project-description";
import { updateProjectTitle } from "@/app/(dashboard)/actions/project/update-project-title";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { Textarea } from "@/app/components/ui/textarea";
import { Project } from "@prisma/client";
import { AlignLeftIcon, CaptionsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProjectContentProps {
  project: Project;
}

const EditProjectContent = ({ project }: EditProjectContentProps) => {
  const [projectTitle, setProjectTitle] = useState(project.title);
  const [projectDescription, setProjectDescription] = useState(
    project.description,
  );
  const [currentProjectTitle, setCurrentProjectTitle] = useState(project.title);
  const [currentProjectDescription, setCurrentProjectDescription] = useState(
    project.description,
  );
  const [isEditingProjectTitle, setIsEditingProjectTitle] = useState(false);
  const [isEditingProjectDescription, setIsEditingProjectDescription] =
    useState(false);

  //   const [currentCateory, setCurrentCategory] = useState(project.category);
  //   const [startDate, setStartDate] = useState(project.);
  //   const [endDate, setEndDate] = useState(project.endTime);

  //   const [isSavingStartTime, setIsSavingStartTime] = useState(false);
  //   const [isSavingEndTime, setIsSavingEndTime] = useState(false);

  const handleTitleProject = async (newTitle: string) => {
    if (newTitle.trim() && newTitle !== project.title) {
      try {
        updateProjectTitle({ projectId: project.id, title: newTitle });

        setCurrentProjectTitle(newTitle);
        setIsEditingProjectTitle(false);
        toast.success("Nome do Projeto atualizado com sucesso!");
      } catch (error) {
        toast.error(`Ocorreu o seguinte erro: ${error}`);
      }
    }
  };

  const handleDescriptionProject = (newDesc: string) => {
    try {
      updateProjectDescription({ projectId: project.id, description: newDesc });

      setCurrentProjectDescription(newDesc);
      setIsEditingProjectDescription(false);
      toast.success("Descrição do Projeto atualizado com sucesso!");
    } catch (error) {
      toast.error(`Ocorreu o seguinte erro: ${error}`);
    }
  };

  return (
    <>
      <div className="space-y-2 py-3">
        <div className="grid grid-cols-[2.5rem,1fr] items-center">
          <CaptionsIcon size={20} />

          <div className="flex min-h-9 w-full items-center justify-between">
            <h2 className="text-lg font-bold text-muted-foreground">Título</h2>

            {!isEditingProjectTitle && (
              <Button
                variant="outline"
                onClick={() => setIsEditingProjectTitle(true)}
              >
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[2.5rem,1fr] items-center">
          <span className="hidden sm:block"></span>
          {isEditingProjectTitle ? (
            <div className="space-y-3">
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleTitleProject(projectTitle);
                  }
                }}
                className="h-fit !text-base"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditingProjectTitle(false);
                    setProjectTitle(currentProjectTitle);
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={() => {
                    handleTitleProject(projectTitle);
                    setCurrentProjectTitle(projectTitle);
                    setIsEditingProjectTitle(false);
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <span className="h-fit border-none pl-0 !text-base focus:pl-3">
              {projectTitle}
            </span>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 py-3">
        <div className="grid grid-cols-[2.5rem,1fr] items-center">
          <AlignLeftIcon size={20} />

          <div className="flex min-h-9 w-full items-center justify-between">
            <h2 className="text-lg font-bold text-muted-foreground">
              Descrição
            </h2>

            {!isEditingProjectDescription && (
              <Button
                variant="outline"
                onClick={() => setIsEditingProjectDescription(true)}
              >
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[2.5rem,1fr] items-center">
          <span className="hidden sm:block"></span>
          {isEditingProjectDescription ? (
            <div className="space-y-3">
              <Textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleDescriptionProject(projectDescription);
                  }
                }}
                className="h-fit !text-base"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditingProjectDescription(false);
                    setProjectDescription(currentProjectDescription);
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={() => {
                    handleDescriptionProject(projectDescription);
                    setCurrentProjectDescription(projectDescription);
                    setIsEditingProjectDescription(false);
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <span className="h-fit border-none pl-0 !text-base focus:pl-3">
              {projectDescription}
            </span>
          )}
        </div>
      </div>

      {/*<div className="grid items-center sm:grid-cols-[2.5rem,1fr]">
          <span />
          {isEditingDescription ? (
            <div className="space-y-3">
              <Editor
                content={newDescription}
                onChange={(value) => setNewDescription(value)}
                placeholder="Descrição da tarefa"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditingDescription(false);
                    setNewDescription(currentDescription);
                  }}
                >
                  Cancelar
                </Button>

                <Button onClick={() => handleDescriptionTask(newDescription)}>
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingDescription(true)}
              dangerouslySetInnerHTML={{ __html: currentDescription }}
              className="prose prose-headings:text-foreground prose-a:text-foreground hover:prose-a:text-primary min-w-full leading-tight text-foreground"
            />
          )}
        </div>
      </div>

      <Separator />

      <div className="flex items-start gap-2.5 py-3 sm:grid sm:grid-cols-[2.5rem,1fr] sm:items-center sm:gap-0">
        <TagIcon size={20} />
        <div className="flex w-full flex-col justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <h2 className="text-lg font-bold text-muted-foreground">Categoria</h2>

          <Select
            onValueChange={(value) =>
              handleCategoryTask(value as TasksCategory)
            }
            defaultValue={currentCateory}
          >
            <SelectTrigger className="max-w-fit gap-3">
              <SelectValue placeholder={currentCateory} />
            </SelectTrigger>
            <SelectContent align="end">
              {TASK_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="flex items-start gap-2.5 py-3 sm:grid sm:grid-cols-[2.5rem,1fr] sm:items-center sm:gap-0">
        <OptionIcon size={20} />
        <div className="flex flex-col justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-muted-foreground">Status:</h2>

            <TasksTypeBadge task={task} />
          </div>

          <div>
            {task.status === TasksStatus.NOT_STARTED && (
              <div className="flex flex-1 items-center space-x-2 text-foreground">
                <Checkbox
                  className="size-5 rounded-full border-2"
                  id={task.id}
                  disabled={new Date(task.startTime).getTime() > Date.now()}
                  onCheckedChange={() => handleCheckboxChange(task.id)}
                />
                <Label htmlFor={task.id}>Iniciar Tarefa</Label>
              </div>
            )}

            {task.status === TasksStatus.IN_PROGRESS && (
              <div className="flex flex-1 items-center space-x-2 text-foreground">
                <Switch
                  id={task.id}
                  onCheckedChange={() => handleSwitchChange(task.id)}
                />
                <Label htmlFor={task.id}>Finalizar Tarefa</Label>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-5 py-3 sm:space-y-2">
        <div className="flex items-center gap-2.5 sm:grid sm:grid-cols-[2.5rem,1fr] sm:gap-0">
          <CalendarCheckIcon size={20} />

          <h2 className="text-lg font-bold text-muted-foreground">Datas</h2>
        </div>

        <div className="grid items-center sm:grid-cols-[2.5rem,1fr]">
          <span></span>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Data de início:
            </p>

            <div className="flex items-center gap-1.5">
              <DateTimePicker24h date={startDate} onChange={setStartDate} />

              <Button
                size="icon"
                variant="secondary"
                onClick={handleStartTimeTask}
                disabled={isSavingStartTime || !hasDateStartChanged}
              >
                {isSavingStartTime ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <SaveIcon />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid items-center sm:grid-cols-[2.5rem,1fr]">
          <span />
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Data de término:
            </p>

            <div className="flex items-center gap-1.5">
              <DateTimePicker24h date={endDate} onChange={setEndDate} />
              <Button
                size="icon"
                variant="secondary"
                onClick={handleEndTimeTask}
                disabled={isSavingEndTime || !hasDateEndChanged}
              >
                {isSavingEndTime ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <SaveIcon />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default EditProjectContent;
