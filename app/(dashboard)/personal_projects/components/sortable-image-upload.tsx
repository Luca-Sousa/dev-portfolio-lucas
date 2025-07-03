"use client";

import { cn } from "@/app/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  IconLoader,
  IconTrash,
  IconPhoto,
  IconX,
  IconEye,
  IconGripVertical,
  IconReplace,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  DndContext,
  closestCorners,
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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

type FileOrUrl = File | string;

interface SortableImageUploadProps {
  files: FileOrUrl[] | null;
  onChange: (files: FileOrUrl[]) => void;
  onFileReplace?: (oldUrl: string, newFile: File) => void; // Callback para substituição
  originalFiles?: FileOrUrl[] | null; // Arquivos originais para permitir reversão
  maxFiles?: number;
  maxFileSize?: number; // em MB
  acceptedTypes?: string[];
  showPreview?: boolean;
}

interface SortableImageItemProps {
  file: FileOrUrl;
  index: number;
  previewUrl: string;
  onDelete: (index: number) => void;
  onReplace?: (index: number) => void;
  onRevert?: (index: number) => void;
  onPreview?: (url: string) => void;
  isModified?: boolean;
  isLoading?: boolean;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({
  file,
  index,
  previewUrl,
  onDelete,
  onReplace,
  onRevert,
  onPreview,
  isModified = false,
  isLoading = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `image-${index}`,
    data: { index, file },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border border-border bg-card transition-all duration-200",
        "hover:border-primary/40 hover:bg-accent/50",
        isDragging && "opacity-70",
      )}
    >
      {/* Handle de arrastar */}
      <div
        {...attributes}
        {...listeners}
        className="flex w-full cursor-move items-center gap-4 rounded p-4 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        title="Arrastar para reordenar"
      >
        <IconGripVertical className="size-4" />

        {/* Preview da imagem */}
        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <IconLoader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Image
              src={previewUrl}
              alt={typeof file === "string" ? "Imagem" : file.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>

        {/* Informações da imagem */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="max-w-64 truncate text-sm font-medium text-foreground">
              {typeof file === "string" ? `Imagem ${index + 1}` : file.name}
            </p>
            <div className="flex items-center gap-1">
              {/* Indicador de posição */}
              <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                #{index + 1}
              </span>
            </div>
          </div>
          {typeof file !== "string" && (
            <p className="mt-1 text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(previewUrl);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
              title="Visualizar imagem"
            >
              <IconEye className="h-4 w-4" />
            </button>
          )}

          {/* Mostra ícone de trocar se for URL, excluir/reverter se for File */}
          {typeof file === "string" ? (
            onReplace && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReplace(index);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/90 text-white shadow-sm transition-colors hover:bg-blue-600"
                title="Substituir imagem"
              >
                <IconReplace className="h-4 w-4" />
              </button>
            )
          ) : // Se o arquivo foi modificado (é um File), mostra botão de reverter
          isModified && onRevert ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRevert(index);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/90 text-white shadow-sm transition-colors hover:bg-orange-600"
              title="Reverter para original"
            >
              <IconRotateClockwise className="h-4 w-4" />
            </button>
          ) : (
            // Se não foi modificado, mostra botão de excluir normal
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground shadow-sm transition-colors hover:bg-destructive"
              title="Remover imagem"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ImagePreviewModal: React.FC<{
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}> = ({ isOpen, imageUrl, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200 animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-background shadow-2xl duration-200 animate-in zoom-in-95"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-background"
          title="Fechar preview"
        >
          <IconX className="h-5 w-5" />
        </button>
        <Image
          src={imageUrl}
          alt="Preview da imagem"
          width={1200}
          height={800}
          className="h-auto max-h-[90vh] w-full max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
};

export const SortableImageUpload: React.FC<SortableImageUploadProps> = ({
  files: propFiles,
  onChange,
  onFileReplace,
  originalFiles,
  maxFiles = 10,
  maxFileSize = 5, // 5MB por padrão
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  showPreview = true,
}) => {
  const [files, setFiles] = useState<FileOrUrl[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    url: string;
  }>({ isOpen: false, url: "" });
  const [loadingFiles, setLoadingFiles] = useState<Set<number>>(new Set());
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Configuração dos sensores do dnd-kit com restrições
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínimo de 8px para ativar o drag
      },
    }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    const initialFiles = Array.isArray(propFiles)
      ? propFiles
      : propFiles
        ? [propFiles]
        : [];
    setFiles(initialFiles);
    const urls = initialFiles.map((file) =>
      typeof file === "string" ? file : URL.createObjectURL(file),
    );
    setPreviewUrls(urls);
  }, [propFiles]);

  // Validação de arquivos
  const validateFiles = (newFiles: File[]): File[] => {
    return newFiles.filter((file) => {
      // Verifica tipo
      if (!acceptedTypes.includes(file.type)) {
        return false;
      }

      // Verifica tamanho
      if (file.size > maxFileSize * 1024 * 1024) {
        return false;
      }

      return true;
    });
  };

  const handleFileChange = async (newFiles: File[]) => {
    const validFiles = validateFiles(newFiles);

    if (validFiles.length === 0) return;

    // Verifica limite de arquivos
    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      return;
    }

    // Adiciona arquivos com loading state
    const newLoadingSet = new Set(loadingFiles);
    validFiles.forEach((_, index) => {
      newLoadingSet.add(files.length + index);
    });
    setLoadingFiles(newLoadingSet);

    try {
      const newUrls = validFiles.map((file) => URL.createObjectURL(file));
      const updatedFiles = [...files, ...validFiles];
      const updatedUrls = [...previewUrls, ...newUrls];

      setFiles(updatedFiles);
      setPreviewUrls(updatedUrls);
      onChange(updatedFiles);

      // Simula carregamento (remova se não necessário)
      setTimeout(() => {
        setLoadingFiles(new Set());
      }, 1000);
    } catch (error) {
      console.error("Erro ao processar arquivos:", error);
      setLoadingFiles(new Set());
    }
  };

  const handleDeleteFile = (index: number) => {
    // Revoga URL do objeto se for File
    if (files[index] instanceof File) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    onChange(updatedFiles);
  };

  // Função para substituir arquivo
  const handleReplaceFile = (index: number) => {
    setReplacingIndex(index);

    // Pequeno delay para garantir que o DOM esteja pronto
    setTimeout(() => {
      if (replaceInputRef.current) {
        replaceInputRef.current.click();
      }
    }, 10);
  };

  // Função para processar a substituição
  const handleReplaceFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length === 0 || replacingIndex === null) {
      return;
    }

    const validFiles = validateFiles(newFiles);
    if (validFiles.length === 0) {
      return;
    }

    const newFile = validFiles[0];
    const oldFile = files[replacingIndex];

    // Adiciona loading state
    const newLoadingSet = new Set(loadingFiles);
    newLoadingSet.add(replacingIndex);
    setLoadingFiles(newLoadingSet);

    try {
      // Se há callback para substituição, chama ele
      if (onFileReplace && typeof oldFile === "string") {
        onFileReplace(oldFile, newFile);
      }

      // Revoga URL antiga se for File
      if (oldFile instanceof File) {
        URL.revokeObjectURL(previewUrls[replacingIndex]);
      }

      // Cria nova URL para o arquivo
      const newUrl = URL.createObjectURL(newFile);

      // Atualiza arrays
      const updatedFiles = [...files];
      const updatedUrls = [...previewUrls];
      updatedFiles[replacingIndex] = newFile;
      updatedUrls[replacingIndex] = newUrl;

      setFiles(updatedFiles);
      setPreviewUrls(updatedUrls);
      onChange(updatedFiles);

      // Simula carregamento
      setTimeout(() => {
        const finalLoadingSet = new Set(loadingFiles);
        finalLoadingSet.delete(replacingIndex);
        setLoadingFiles(finalLoadingSet);
        setReplacingIndex(null);
      }, 500);
    } catch (error) {
      console.error("Erro ao substituir arquivo:", error);
      const finalLoadingSet = new Set(loadingFiles);
      finalLoadingSet.delete(replacingIndex);
      setLoadingFiles(finalLoadingSet);
      setReplacingIndex(null);
    }

    // Limpa o input
    event.target.value = "";
  };

  // Função para reverter à imagem original
  const handleRevertFile = (index: number) => {
    if (!originalFiles || !originalFiles[index]) return;

    const originalFile = originalFiles[index];

    // Revoga URL atual se for File
    if (files[index] instanceof File) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    // Atualiza arrays com o arquivo original
    const updatedFiles = [...files];
    const updatedUrls = [...previewUrls];
    updatedFiles[index] = originalFile;
    updatedUrls[index] =
      typeof originalFile === "string"
        ? originalFile
        : URL.createObjectURL(originalFile);

    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    onChange(updatedFiles);
  };

  // Verifica se o arquivo foi modificado comparado ao original
  const isFileModified = (index: number): boolean => {
    if (!originalFiles || !originalFiles[index]) return false;

    const currentFile = files[index];
    const originalFile = originalFiles[index];

    // Se ambos são strings (URLs), compara as URLs
    if (typeof currentFile === "string" && typeof originalFile === "string") {
      return currentFile !== originalFile;
    }

    // Se um é File e outro é string, foi modificado
    if (typeof currentFile !== typeof originalFile) {
      return true;
    }

    // Se ambos são Files, compara os nomes e tamanhos
    if (currentFile instanceof File && originalFile instanceof File) {
      return (
        currentFile.name !== originalFile.name ||
        currentFile.size !== originalFile.size
      );
    }

    return false;
  };

  // Handler do drag end do dnd-kit
  const handleDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Extrai os índices dos IDs
    const activeIndex = parseInt(active.id.toString().replace("image-", ""));
    const overIndex = parseInt(over.id.toString().replace("image-", ""));

    // Validação dos índices
    if (isNaN(activeIndex) || isNaN(overIndex) || activeIndex === overIndex)
      return;
    if (activeIndex < 0 || activeIndex >= files.length) return;
    if (overIndex < 0 || overIndex >= files.length) return;

    // Reordena os arrays
    const newFiles = arrayMove(files, activeIndex, overIndex);
    const newUrls = arrayMove(previewUrls, activeIndex, overIndex);

    setFiles(newFiles);
    setPreviewUrls(newUrls);
    onChange(newFiles);
  };

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: handleFileChange,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxFiles: maxFiles - files.length,
    maxSize: maxFileSize * 1024 * 1024,
    multiple: true,
    noClick: true,
  });

  const handleClick = () => {
    if (files.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Input para substituição - sempre presente */}
      <input
        ref={replaceInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleReplaceFileChange}
        className="hidden"
      />

      {/* Área de Upload */}
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-6 transition-all duration-200",
          "border-border bg-card hover:bg-accent/30",
          isDragActive && "border-primary bg-primary/10",
          files.length >= maxFiles && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <IconPhoto className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {isDragActive ? "Solte as imagens aqui" : "Adicionar imagens"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Arraste e solte ou{" "}
              <button
                type="button"
                onClick={handleClick}
                className="text-primary underline transition-colors hover:text-primary/80"
                disabled={files.length >= maxFiles}
              >
                clique para selecionar
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo {maxFiles} imagens • Até {maxFileSize}MB cada
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Imagens (Vertical) */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Imagens ({files.length}/{maxFiles})
            </h4>
            <p className="text-xs text-muted-foreground">
              Arraste para reordenar
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={files.map((_, index) => `image-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {files.map((file, index) => (
                  <SortableImageItem
                    key={`${typeof file === "string" ? file : file.name}-${index}`}
                    file={file}
                    index={index}
                    previewUrl={previewUrls[index]}
                    onDelete={handleDeleteFile}
                    onReplace={handleReplaceFile}
                    onRevert={handleRevertFile}
                    onPreview={
                      showPreview
                        ? (url) => setPreviewModal({ isOpen: true, url })
                        : undefined
                    }
                    isModified={isFileModified(index)}
                    isLoading={loadingFiles.has(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Modal de Preview */}
      {showPreview && (
        <ImagePreviewModal
          isOpen={previewModal.isOpen}
          imageUrl={previewModal.url}
          onClose={() => setPreviewModal({ isOpen: false, url: "" })}
        />
      )}
    </div>
  );
};

export default SortableImageUpload;
