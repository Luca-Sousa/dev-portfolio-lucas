"use client";

import { cn } from "@/app/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  IconLoader,
  IconTrash,
  IconUpload,
  IconX,
  IconEye,
  IconReplace,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type FileOrUrl = File | string;

interface FileUploadProps {
  files: FileOrUrl[] | null;
  onChange: (files: FileOrUrl[]) => void;
  onFileReplace?: (oldUrl: string, newFile: File) => void; // Callback para substituição
  originalFiles?: FileOrUrl[] | null; // Arquivos originais para permitir reversão
  singleFile?: boolean;
  maxFileSize?: number; // em MB
  acceptedTypes?: string[];
  showPreview?: boolean;
}

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
        className="relative max-h-[90vh] min-h-[15vh] w-full min-w-[15vw] max-w-[90vw] overflow-hidden rounded-lg bg-card p-10 shadow-2xl duration-200 animate-in zoom-in-95"
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
          className="h-auto max-h-[90vh] min-h-[15vh] w-full min-w-[15vw] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
};

export const FileUpload: React.FC<FileUploadProps> = ({
  files: propFiles,
  onChange,
  onFileReplace,
  originalFiles,
  singleFile = false,
  maxFileSize = 5, // 5MB por padrão
  acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
  showPreview = true,
}) => {
  const [files, setFiles] = useState<FileOrUrl[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    url: string;
  }>({ isOpen: false, url: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

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

    setIsLoading(true);

    try {
      const newUrls = validFiles.map((file) => URL.createObjectURL(file));
      const updatedFiles = singleFile
        ? [validFiles[0]]
        : [...files, ...validFiles];
      const updatedUrls = singleFile
        ? [newUrls[0]]
        : [...previewUrls, ...newUrls];

      setFiles(updatedFiles);
      setPreviewUrls(updatedUrls);
      onChange(updatedFiles);

      // Simula carregamento
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Erro ao processar arquivos:", error);
      setIsLoading(false);
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

  // Nova função para substituir arquivo
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

    setIsLoading(true);

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
        setIsLoading(false);
        setReplacingIndex(null);
      }, 500);
    } catch (error) {
      console.error("Erro ao substituir arquivo:", error);
      setIsLoading(false);
      setReplacingIndex(null);
    }

    // Limpa o input
    event.target.value = "";
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
    maxFiles: singleFile ? 1 : undefined,
    maxSize: maxFileSize * 1024 * 1024,
    multiple: !singleFile,
    noClick: singleFile && files.length > 0,
  });

  const handleClick = () => {
    if (!singleFile || files.length === 0) {
      fileInputRef.current?.click();
    }
  };

  // Se é single file e já tem arquivo, mostra apenas o preview
  if (singleFile && files.length > 0) {
    const file = files[0];
    const previewUrl = previewUrls[0];

    return (
      <div className="w-full">
        {/* Input para substituição - sempre presente */}
        <input
          ref={replaceInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleReplaceFileChange}
          className="hidden"
        />

        <div className="group relative overflow-hidden rounded-lg border-2 border-dashed border-border bg-card">
          {isLoading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="relative h-80 w-full">
              <Image
                src={previewUrl}
                alt={typeof file === "string" ? "Imagem" : file.name}
                fill
                className="object-contain py-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Overlay com ações */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {showPreview && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewModal({ isOpen: true, url: previewUrl })
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors hover:bg-background"
                    title="Visualizar imagem"
                  >
                    <IconEye className="h-5 w-5" />
                  </button>
                )}

                {/* Mostra ícone de trocar se for URL, excluir/reverter se for File */}
                {typeof file === "string" ? (
                  <button
                    type="button"
                    onClick={() => handleReplaceFile(0)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/90 text-white shadow-lg transition-colors hover:bg-blue-600"
                    title="Substituir imagem"
                  >
                    <IconReplace className="h-5 w-5" />
                  </button>
                ) : // Se o arquivo foi modificado (é um File), mostra botão de reverter
                isFileModified(0) ? (
                  <button
                    type="button"
                    onClick={() => handleRevertFile(0)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/90 text-white shadow-lg transition-colors hover:bg-orange-600"
                    title="Reverter para imagem original"
                  >
                    <IconRotateClockwise className="h-5 w-5" />
                  </button>
                ) : (
                  // Se não foi modificado, mostra botão de excluir normal
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(0)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground shadow-lg transition-colors hover:bg-destructive"
                    title="Remover imagem"
                  >
                    <IconTrash className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

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
  }

  // Área de upload
  return (
    <div className="w-full">
      {/* Input para substituição - sempre presente */}
      <input
        ref={replaceInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleReplaceFileChange}
        className="hidden"
      />

      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 transition-all duration-200",
          "border-border bg-card hover:bg-accent/30",
          isDragActive && "border-primary bg-primary/10",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={!singleFile}
          accept={acceptedTypes.join(",")}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-primary/10 p-6">
            <IconUpload className="h-12 w-12 text-primary" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              {isDragActive
                ? "Solte o arquivo aqui"
                : singleFile
                  ? "Selecionar arquivo"
                  : "Adicionar arquivos"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Arraste e solte ou{" "}
              <button
                type="button"
                onClick={handleClick}
                className="text-primary underline transition-colors hover:text-primary/80"
              >
                clique para selecionar
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              {singleFile ? "Máximo 1 arquivo" : "Múltiplos arquivos"} • Até{" "}
              {maxFileSize}MB cada
            </p>
          </div>
        </div>
      </div>

      {/* Lista de arquivos (para modo múltiplo) */}
      {!singleFile && files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              {/* Preview da imagem */}
              <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {isLoading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <IconLoader className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Image
                    src={previewUrls[index]}
                    alt={typeof file === "string" ? "Imagem" : file.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>

              {/* Informações do arquivo */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {typeof file === "string" ? file.split("/").pop() : file.name}
                </p>
                {typeof file !== "string" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2">
                {showPreview && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewModal({ isOpen: true, url: previewUrls[index] })
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
                    title="Visualizar"
                  >
                    <IconEye className="h-4 w-4" />
                  </button>
                )}

                {/* Mostra ícone de trocar se for URL, excluir/reverter se for File */}
                {typeof file === "string" ? (
                  <button
                    type="button"
                    onClick={() => handleReplaceFile(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/90 text-white shadow-sm transition-colors hover:bg-blue-600"
                    title="Substituir"
                  >
                    <IconReplace className="h-4 w-4" />
                  </button>
                ) : // Se o arquivo foi modificado (é um File), mostra botão de reverter
                isFileModified(index) ? (
                  <button
                    type="button"
                    onClick={() => handleRevertFile(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/90 text-white shadow-sm transition-colors hover:bg-orange-600"
                    title="Reverter para original"
                  >
                    <IconRotateClockwise className="h-4 w-4" />
                  </button>
                ) : (
                  // Se não foi modificado, mostra botão de excluir normal
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground shadow-sm transition-colors hover:bg-destructive"
                    title="Remover"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
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

export default FileUpload;
