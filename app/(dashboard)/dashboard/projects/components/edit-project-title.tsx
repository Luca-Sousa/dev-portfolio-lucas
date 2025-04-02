"use client";

import { updateProjectTitle } from "@/app/(dashboard)/actions/project/update-project-title";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { CaptionsIcon, PenBoxIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProjectTitleProps {
  id: string;
  title: string;
}

const EditProjectTitle = ({ id, title }: EditProjectTitleProps) => {
  const [projectTitle, setProjectTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProjectTitle = async (newTitle: string) => {
    if (!newTitle.trim() || newTitle === title) return;

    setLoading(true);
    try {
      await updateProjectTitle({ projectId: id, title: newTitle });

      setProjectTitle(newTitle);
      toast.success("Nome do Projeto atualizado com sucesso!");
      setIsEditingTitle(false);
    } catch (error) {
      toast.error(`Ocorreu um erro ao atualizar o título: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <CaptionsIcon size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">Título</h2>

          {!isEditingTitle && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingTitle(true)}
              className="size-8"
            >
              <PenBoxIcon />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <span className="hidden sm:block"></span>
        {isEditingTitle ? (
          <div className="space-y-3">
            <Input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  await handleProjectTitle(projectTitle);
                }
              }}
              className="h-fit !text-base"
            />

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditingTitle(false);
                  setProjectTitle(title);
                }}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                onClick={() => handleProjectTitle(projectTitle)}
                disabled={loading || projectTitle.trim() === title}
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <span onClick={() => setIsEditingTitle(true)}>{projectTitle}</span>
        )}
      </div>
    </div>
  );
};

export default EditProjectTitle;
