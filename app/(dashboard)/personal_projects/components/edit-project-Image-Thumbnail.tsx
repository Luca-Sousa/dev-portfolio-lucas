"use client";

import { Button } from "@/app/components/ui/button";
import { CaptionsIcon, PenBoxIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { IconCancel, IconDeviceFloppy } from "@tabler/icons-react";
import Image from "next/image";
import FileUpload from "@/app/components/ui/file-upload";
import { deleteFileFromBucket } from "@/app/utils/delete-file";
import { handleFileUpload } from "@/app/utils/create-file";
import { updateProjectThumbnail } from "@/app/(dashboard)/actions/project/update-project-thumbnail";

interface EditProjectImageThumbnailProps {
  id: string;
  thumbnailUrl: string;
}

const EditProjectImageThumbnail = ({
  id,
  thumbnailUrl,
}: EditProjectImageThumbnailProps) => {
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [projectThumbnail, setProjectThumbnail] =
    useState<string>(thumbnailUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditThumbnail = async () => {
    if (!iconFile) return;

    setLoading(true);

    try {
      if (thumbnailUrl && isEditing) {
        const fileKey = projectThumbnail.split("/").pop();
        if (fileKey) {
          await deleteFileFromBucket(fileKey);
        }
      }

      const uploadedThumbnailUrl = await handleFileUpload(
        iconFile,
        "thumbnailUrl",
      );

      if (uploadedThumbnailUrl) {
        setProjectThumbnail(uploadedThumbnailUrl);
      } else {
        throw new Error("Failed to upload thumbnail.");
      }

      await updateProjectThumbnail({
        projectId: id,
        thumbnailUrl: uploadedThumbnailUrl,
      });

      toast.success("Thumbnail atualizada com sucesso!");
      setIsEditing(false);
      setIconFile(null);
    } catch (error) {
      toast.error(`Erro ao atualizar thumbnail: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <CaptionsIcon size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">Thumbnail</h2>

          {!isEditing && (
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

      {isEditing ? (
        <FileUpload
          onChange={(files) => {
            if (files.length > 0) {
              const file = files[0];
              setIconFile(file);
            }
          }}
          singleFile
        />
      ) : (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={projectThumbnail}
            alt="Imagem da Thumbnail do Projeto"
            fill
            className="object-cover"
          />
        </div>
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

          <Button onClick={handleEditThumbnail} disabled={loading || !iconFile}>
            <IconDeviceFloppy />
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditProjectImageThumbnail;
