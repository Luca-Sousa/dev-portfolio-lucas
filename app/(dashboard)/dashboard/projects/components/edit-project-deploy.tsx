"use client";

import { updateProjectDeploy } from "@/app/(dashboard)/actions/project/update-project-deploy";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  IconCopyPlusFilled,
  IconExternalLink,
  IconFolderSymlink,
  IconTrash,
} from "@tabler/icons-react";
import { PenBoxIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface EditProjectDeployProps {
  id: string;
  deployUrl?: string | null;
}

const EditProjectDeploy = ({ id, deployUrl }: EditProjectDeployProps) => {
  const [projectDeployUrl, setProjectDeployUrl] = useState(deployUrl ?? "");
  const [isEditingDeployUrl, setIsEditingDeployUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditDeployUrl = async (newDeployUrl: string) => {
    if (!newDeployUrl.trim() || newDeployUrl === deployUrl) return;

    setLoading(true);
    try {
      await updateProjectDeploy({
        projectId: id,
        deployUrl: newDeployUrl,
      });

      setProjectDeployUrl(newDeployUrl);
      toast.success("URL do Deploy atualizada com sucesso!");
      setIsEditingDeployUrl(false);
    } catch (error) {
      toast.error(`Erro ao atualizar a URL do deploy: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeployUrl = async () => {
    if (!deployUrl) return;

    setLoading(true);
    try {
      await updateProjectDeploy({
        projectId: id,
        deployUrl: null,
      });

      setProjectDeployUrl("");
      toast.success("URL do Deploy removida com sucesso!");
    } catch (error) {
      toast.error(`Erro ao remover a URL do deploy: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <IconFolderSymlink size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">
            Link do Deploy
          </h2>

          {deployUrl ? (
            <div className="space-x-1.5">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDeleteDeployUrl}
                disabled={loading}
              >
                <IconTrash className="size-5" />
              </Button>

              <Button size="icon" variant="ghost" asChild>
                <Link target="_blank" href={deployUrl}>
                  <IconExternalLink className="size-5" />
                </Link>
              </Button>

              {!isEditingDeployUrl && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingDeployUrl(true)}
                >
                  <PenBoxIcon />
                </Button>
              )}
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingDeployUrl(true)}
              disabled={loading}
            >
              <IconCopyPlusFilled />
            </Button>
          )}
        </div>
      </div>

      {!projectDeployUrl && !isEditingDeployUrl && (
        <div className="flex items-center justify-center rounded-md border-2 border-dashed border-neutral-200 p-4 text-neutral-400 dark:border-neutral-800">
          <span className="max-w-56 text-center text-sm">
            O projeto não possui link de Deploy
          </span>
        </div>
      )}

      {(deployUrl || isEditingDeployUrl) && (
        <div className="grid grid-cols-[2.5rem,1fr] items-center">
          <span className="hidden sm:block"></span>
          {isEditingDeployUrl ? (
            <div className="space-y-3">
              <Input
                value={projectDeployUrl}
                onChange={(e) => setProjectDeployUrl(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    await handleEditDeployUrl(projectDeployUrl ?? "");
                  }
                }}
                className="h-fit !text-base"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditingDeployUrl(false);
                    setProjectDeployUrl(deployUrl ?? "");
                  }}
                  disabled={loading}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={() => {
                    handleEditDeployUrl(projectDeployUrl ?? "");
                  }}
                  disabled={loading || projectDeployUrl.trim() === deployUrl}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          ) : (
            <span
              onClick={() => setIsEditingDeployUrl(true)}
              className="truncate"
            >
              {projectDeployUrl}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EditProjectDeploy;
