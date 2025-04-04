"use client";

import { Button } from "@/app/components/ui/button";
import { AlignLeftIcon, PenBoxIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  IconCancel,
  IconCertificate,
  IconCopyPlusFilled,
  IconDeviceFloppy,
  IconLoaderQuarter,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import FileUpload from "@/app/components/ui/file-upload";
import { deleteFileFromBucket } from "@/app/utils/delete-file";
import { handleFileUpload } from "@/app/utils/create-file";
import { updateProjectCertificate } from "@/app/(dashboard)/actions/project/update-project-certificate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { updateProjectCertDescrip } from "@/app/(dashboard)/actions/project/update-project-cert-description";

interface EditProjectImageCertificateProps {
  id: string;
  certificateUrl: string | null;
  certDescrip: string | null;
}

const EditProjectImageCertificate = ({
  id,
  certificateUrl,
  certDescrip,
}: EditProjectImageCertificateProps) => {
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [projectCertificate, setProjectCertificate] = useState<string | null>(
    certificateUrl,
  );
  const [projectCertDescrip, setProjectCertifDescrip] = useState(certDescrip);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCertDescrip, setIsEditingCertDescrip] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditCertificate = async () => {
    if (!iconFile) return;

    setLoading(true);

    try {
      const uploadedCertificateUrl = await handleFileUpload(
        iconFile,
        "certificateUrl",
      );

      if (!uploadedCertificateUrl) {
        throw new Error("Falha ao fazer upload do certificado.");
      }

      if (projectCertificate) {
        const fileKey = projectCertificate.split("/").pop();
        if (fileKey) {
          await deleteFileFromBucket(fileKey);
        }
      }

      await updateProjectCertificate({
        projectId: id,
        certificateUrl: uploadedCertificateUrl,
      });

      setProjectCertificate(uploadedCertificateUrl);
      toast.success("Certificado atualizado com sucesso!");
      setIsEditing(false);
      setIconFile(null);
    } catch (error) {
      toast.error(`Erro ao atualizar certificado: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!projectCertificate) return;

    setLoading(true);

    try {
      const fileKey = projectCertificate.split("/").pop();
      if (fileKey) {
        await deleteFileFromBucket(fileKey);
      }

      await updateProjectCertificate({
        projectId: id,
        certificateUrl: null,
      });

      await updateProjectCertDescrip({
        projectId: id,
        certDescrip: null,
      });

      setProjectCertificate(null);
      setProjectCertifDescrip(null);
      toast.success("Certificado removido com sucesso!");
    } catch (error) {
      toast.error(`Erro ao remover certificado: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCertDescripProject = async (newCertDescrip: string) => {
    if (
      !newCertDescrip.trim() ||
      newCertDescrip === certDescrip ||
      !projectCertificate
    )
      return;

    setLoading(true);
    try {
      await updateProjectCertDescrip({
        projectId: id,
        certDescrip: newCertDescrip,
      });

      setProjectCertifDescrip(newCertDescrip);
      toast.success("Descrição do Projeto atualizada com sucesso!");
      setIsEditingCertDescrip(false);
    } catch (error) {
      toast.error(`Ocorreu um erro ao atualizar a descrição: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <IconCertificate size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">
            Certificado
          </h2>

          <div className="space-x-1.5">
            {projectCertificate && !isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" disabled={loading}>
                    {loading ? (
                      <span className="animate-spin">
                        <IconLoaderQuarter />
                      </span>
                    ) : (
                      <IconTrash />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deletar Certificado</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deseja excluir o certificado? Essa ação não pode ser
                      desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCertificate}>
                      Deletar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {!isEditing && !projectCertificate && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                <IconCopyPlusFilled />
              </Button>
            )}

            {!isEditing && projectCertificate && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <PenBoxIcon />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <FileUpload
          onChange={(files) => {
            if (files.length > 0) {
              setIconFile(files[0]);
            }
          }}
          singleFile
        />
      ) : (
        projectCertificate && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={projectCertificate}
              alt="Imagem do Certificado"
              fill
              className="object-cover"
            />
          </div>
        )
      )}

      {isEditing && (
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(false)}
            disabled={loading}
          >
            <IconCancel />
            Cancelar
          </Button>

          <Button
            onClick={handleEditCertificate}
            disabled={loading || !iconFile}
          >
            <div className="flex gap-1.5">
              {loading ? (
                <>
                  <span className="animate-spin">
                    <IconLoaderQuarter />
                  </span>
                  Salvando...
                </>
              ) : (
                <>
                  <IconDeviceFloppy />
                  Salvar
                </>
              )}
            </div>
          </Button>
        </div>
      )}

      {(projectCertificate || projectCertDescrip) && (
        <div className="!mt-3 space-y-2">
          <div className="grid grid-cols-[2.5rem,1fr] items-center">
            <AlignLeftIcon size={20} />

            <div className="flex w-full items-center justify-between">
              <h2 className="text-lg font-bold text-muted-foreground">
                Descrição
              </h2>

              <div className="space-x-1.5">
                {!isEditingCertDescrip && !projectCertDescrip && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingCertDescrip(true)}
                    disabled={loading}
                  >
                    <IconCopyPlusFilled />
                  </Button>
                )}

                {!isEditingCertDescrip && projectCertDescrip && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingCertDescrip(true)}
                  >
                    <PenBoxIcon />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[2.5rem,1fr] items-center">
            <span className="hidden sm:block"></span>

            {isEditingCertDescrip ? (
              <div className="space-y-3">
                <Textarea
                  value={projectCertDescrip || ""}
                  onChange={(e) => setProjectCertifDescrip(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (projectCertDescrip !== null) {
                        await handleCertDescripProject(projectCertDescrip);
                      }
                    }
                  }}
                  className="min-h-32 resize-none !text-base"
                />

                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditingCertDescrip(false);
                      setProjectCertifDescrip(certDescrip);
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>

                  <Button
                    onClick={() =>
                      handleCertDescripProject(projectCertDescrip || "")
                    }
                    disabled={
                      loading ||
                      (projectCertDescrip?.trim() || "") === certDescrip
                    }
                  >
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            ) : (
              <span onClick={() => setIsEditingCertDescrip(true)}>
                {projectCertDescrip}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProjectImageCertificate;
