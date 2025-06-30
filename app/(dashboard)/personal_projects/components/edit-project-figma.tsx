"use client";

import { updateProjectFigma } from "@/app/(dashboard)/actions/project/update-project-figma";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  IconCopyPlusFilled,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react";
import { PenBoxIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaFigma } from "react-icons/fa6";
import { toast } from "sonner";

interface EditProjectFigmaProps {
  id: string;
  figmaUrl?: string | null;
}

const EditProjectFigma = ({ id, figmaUrl }: EditProjectFigmaProps) => {
  const [projectFigmaUrl, setProjectFigmaUrl] = useState(figmaUrl ?? "");
  const [isEditingFigmaUrl, setIsEditingFigmaUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditFigmaUrl = async (newDeployUrl: string) => {
    if (!newDeployUrl.trim() || newDeployUrl === figmaUrl) return;

    setLoading(true);
    try {
      await updateProjectFigma({
        projectId: id,
        figmaUrl: newDeployUrl,
      });

      setProjectFigmaUrl(newDeployUrl);
      toast.success("URL do Figma atualizada com sucesso!");
      setIsEditingFigmaUrl(false);
    } catch (error) {
      toast.error(`Erro ao atualizar a URL do Figma: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFigmaUrl = async () => {
    if (!figmaUrl) return;

    setLoading(true);
    try {
      await updateProjectFigma({
        projectId: id,
        figmaUrl: null,
      });

      setProjectFigmaUrl("");
      toast.success("URL do Figma removida com sucesso!");
    } catch (error) {
      toast.error(`Erro ao remover a URL do Figma: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <FaFigma size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">
            Link do Figma
          </h2>

          {figmaUrl ? (
            <div className="space-x-1.5">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDeleteFigmaUrl}
                disabled={loading}
              >
                <IconTrash className="size-5" />
              </Button>

              <Button size="icon" variant="ghost" asChild>
                <Link target="_blank" href={figmaUrl}>
                  <IconExternalLink className="size-5" />
                </Link>
              </Button>

              {!isEditingFigmaUrl && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingFigmaUrl(true)}
                >
                  <PenBoxIcon />
                </Button>
              )}
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingFigmaUrl(true)}
              disabled={loading}
            >
              <IconCopyPlusFilled />
            </Button>
          )}
        </div>
      </div>

      {!projectFigmaUrl && !isEditingFigmaUrl && (
        <div className="flex items-center justify-center rounded-md border-2 border-dashed border-neutral-200 p-4 text-neutral-400 dark:border-neutral-800">
          <span className="max-w-56 text-center text-sm">
            O projeto não possui link do Figma
          </span>
        </div>
      )}

      {(figmaUrl || isEditingFigmaUrl) && (
        <div className="grid grid-cols-[2.5rem,1fr] items-center">
          <span className="hidden sm:block"></span>
          {isEditingFigmaUrl ? (
            <div className="space-y-3">
              <Input
                value={projectFigmaUrl}
                onChange={(e) => setProjectFigmaUrl(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    await handleEditFigmaUrl(projectFigmaUrl ?? "");
                  }
                }}
                className="h-fit !text-base"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditingFigmaUrl(false);
                    setProjectFigmaUrl(figmaUrl ?? "");
                  }}
                  disabled={loading}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={() => {
                    handleEditFigmaUrl(projectFigmaUrl ?? "");
                  }}
                  disabled={loading || projectFigmaUrl.trim() === figmaUrl}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          ) : (
            <span
              onClick={() => setIsEditingFigmaUrl(true)}
              className="truncate"
            >
              {projectFigmaUrl}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EditProjectFigma;
