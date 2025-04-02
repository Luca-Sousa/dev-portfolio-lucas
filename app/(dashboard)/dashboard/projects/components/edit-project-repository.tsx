"use client";

import { updateProjectRepository } from "@/app/(dashboard)/actions/project/update-project-repository";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { IconExternalLink, IconFolders } from "@tabler/icons-react";
import { PenBoxIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface EditProjectRepositoryProps {
  id: string;
  repositoryUrl: string;
}

const EditProjectRepository = ({
  id,
  repositoryUrl,
}: EditProjectRepositoryProps) => {
  const [projectRepositoryUrl, setProjectRepositoryUrl] =
    useState(repositoryUrl);
  const [isEditingRepositoryUrl, setIsEditingRepositoryUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProjectRepository = async (newRepositoryUrl: string) => {
    if (!newRepositoryUrl.trim() || newRepositoryUrl === repositoryUrl) return;

    setLoading(true);
    try {
      await updateProjectRepository({
        projectId: id,
        repositoryUrl: newRepositoryUrl,
      });

      setProjectRepositoryUrl(newRepositoryUrl);
      toast.success("Url do Repositório do Projeto atualizada com sucesso!");
      setIsEditingRepositoryUrl(false);
    } catch (error) {
      toast.error(
        `Ocorreu um erro ao atualizar a url do repositório: ${error}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <IconFolders size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">
            Link do Repositório
          </h2>

          <div className="space-x-1.5">
            <Button size="icon" variant="ghost" className="size-8" asChild>
              <Link target="_blank" href={repositoryUrl}>
                <IconExternalLink className="size-5" />
              </Link>
            </Button>

            {!isEditingRepositoryUrl && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditingRepositoryUrl(true)}
                className="size-8"
              >
                <PenBoxIcon />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <span className="hidden sm:block"></span>
        {isEditingRepositoryUrl ? (
          <div className="space-y-3">
            <Input
              value={projectRepositoryUrl}
              onChange={(e) => setProjectRepositoryUrl(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  await handleProjectRepository(projectRepositoryUrl);
                }
              }}
              className="h-fit !text-base"
            />

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditingRepositoryUrl(false);
                  setProjectRepositoryUrl(repositoryUrl);
                }}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                onClick={() => handleProjectRepository(projectRepositoryUrl)}
                disabled={
                  loading || projectRepositoryUrl.trim() === repositoryUrl
                }
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <span onClick={() => setIsEditingRepositoryUrl(true)}>
            {projectRepositoryUrl}
          </span>
        )}
      </div>
    </div>
  );
};

export default EditProjectRepository;
