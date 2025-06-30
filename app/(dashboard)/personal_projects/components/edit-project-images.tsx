"use client";

import { Button } from "@/app/components/ui/button";
import { CaptionsIcon, PenBoxIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  IconCancel,
  IconCopyPlusFilled,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import Image from "next/image";
import { updateProjectImages } from "@/app/(dashboard)/actions/project/update-project-images";
import FileUpload from "@/app/components/ui/file-upload";
import { handleFileUpload } from "@/app/utils/create-file";
import { deleteFileFromBucket } from "@/app/utils/delete-file";
import SortableImagesCard from "./sortable-images-card";

interface EditProjectImagesProps {
  id: string;
  images: string[];
}

const EditProjectImages = ({ id, images }: EditProjectImagesProps) => {
  const [iconFiles, setIconFiles] = useState<File[]>([]);

  const [selectedImages, setSelectedImages] = useState<string[]>(images);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddImage, setIsAddImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedImages.findIndex((img) => img === active.id);
    const newIndex = selectedImages.findIndex((img) => img === over.id);

    setSelectedImages((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleRemoveImage = (url: string) => {
    setSelectedImages((prev) => prev.filter((img) => img !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  const handleCancel = () => {
    setSelectedImages(images);
    setRemovedImages([]);
    setIsEditing(false);
    setIsAddImage(false);
    setIconFiles([]);
  };

  const handleEditImage = async () => {
    setLoading(true);

    try {
      let updatedImages = [...selectedImages];

      if (removedImages.length > 0) {
        const deletePromises = removedImages.map((url) => {
          const fileKey = url.split("/").pop();
          if (fileKey) {
            return deleteFileFromBucket(fileKey);
          }
          return Promise.resolve(false);
        });

        const deleteResults = await Promise.all(deletePromises);
        const allDeleted = deleteResults.every(Boolean);

        if (!allDeleted) {
          throw new Error("Erro ao deletar uma ou mais imagens da nuvem.");
        }
      }

      if (iconFiles.length > 0) {
        const uploadPromises = iconFiles.map((file) =>
          handleFileUpload(file, "imagesUrl"),
        );

        const uploadedImageUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedImageUrls.filter(Boolean) as string[];

        if (validUrls.length === 0) {
          throw new Error("Falha ao fazer upload das imagens.");
        }

        updatedImages = [...updatedImages, ...validUrls];
        setSelectedImages(updatedImages);
      }

      await updateProjectImages({
        projectId: id,
        images: updatedImages.filter((url) => !removedImages.includes(url)),
      });

      toast.success("Imagens atualizadas com sucesso!");
      setIsAddImage(false);
      setIsEditing(false);
      setRemovedImages([]);
      setIconFiles([]);
    } catch (error) {
      toast.error("Erro ao atualizar as imagens: " + error);
      handleCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <CaptionsIcon size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">Imagens</h2>

          <div className="space-x-1.5">
            {!isAddImage && (
              <Button
                size="icon"
                variant="ghost"
                disabled={loading}
                onClick={() => setIsAddImage(true)}
              >
                <IconCopyPlusFilled />
              </Button>
            )}

            {!isEditing && images.length > 0 && !isAddImage && (
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

      {isAddImage && (
        <div className="!my-4 h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
          <FileUpload
            onChange={(files) => {
              if (files.length > 0) {
                setIconFiles(files);
              }
            }}
          />
        </div>
      )}

      {!isAddImage &&
        (isEditing ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedImages}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {selectedImages.map((url, index) => (
                  <SortableImagesCard
                    key={url}
                    index={index}
                    imageURL={url}
                    onRemove={() => handleRemoveImage(url)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid gap-3">
            {selectedImages.map((url, index) => (
              <div key={url} className="flex items-center gap-3">
                <span className="min-w-5 font-bold text-gray-600">
                  {index + 1}.
                </span>

                <div className="relative aspect-video size-full rounded-sm ring-1 ring-purple">
                  <Image
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

      {selectedImages.length <= 0 && !isEditing && !isAddImage && (
        <div className="flex items-center justify-center rounded-md border-2 border-dashed border-neutral-200 p-4 text-sm text-neutral-400 dark:border-neutral-800">
          O projeto não possui Imagens
        </div>
      )}

      {removedImages.length > 0 && (
        <div className="!mt-3 flex items-center justify-end text-sm font-medium text-neutral-400">
          Quantidade de Imagens Removidas: {removedImages.length}
        </div>
      )}

      {(isEditing || isAddImage) && (
        <div className="flex items-center justify-end space-x-3">
          <Button variant="ghost" onClick={handleCancel} disabled={loading}>
            <IconCancel />
            Cancelar
          </Button>

          <Button onClick={handleEditImage} disabled={loading}>
            <IconDeviceFloppy />
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditProjectImages;
