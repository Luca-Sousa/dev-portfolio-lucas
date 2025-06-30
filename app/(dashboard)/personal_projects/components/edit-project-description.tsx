"use client";

import { updateProjectDescription } from "@/app/(dashboard)/actions/project/update-project-description";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { AlignLeftIcon, PenBoxIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProjectDescriptionProps {
  id: string;
  description: string;
}

const EditProjectDescription = ({
  id,
  description,
}: EditProjectDescriptionProps) => {
  const [projectDescription, setProjectDescription] = useState(description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDescriptionProject = async (newDescription: string) => {
    if (!newDescription.trim() || newDescription === description) return;

    setLoading(true);
    try {
      await updateProjectDescription({
        projectId: id,
        description: newDescription,
      });

      setProjectDescription(newDescription);
      toast.success("Descrição do Projeto atualizada com sucesso!");
      setIsEditingDescription(false);
    } catch (error) {
      toast.error(`Ocorreu um erro ao atualizar a descrição: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <AlignLeftIcon size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">Descrição</h2>

          {!isEditingDescription && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingDescription(true)}
            >
              <PenBoxIcon />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <span className="hidden sm:block"></span>

        {isEditingDescription ? (
          <div className="space-y-3">
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  await handleDescriptionProject(projectDescription);
                }
              }}
              className="min-h-32 resize-none !text-base"
            />

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditingDescription(false);
                  setProjectDescription(description);
                }}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                onClick={() => handleDescriptionProject(projectDescription)}
                disabled={loading || projectDescription.trim() === description}
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <span onClick={() => setIsEditingDescription(true)}>
            {projectDescription}
          </span>
        )}
      </div>
    </div>
  );
};

export default EditProjectDescription;
