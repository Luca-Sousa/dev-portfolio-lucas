"use client";

import { cn } from "@/app/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  IconLoader,
  IconTrash,
  IconX,
  IconEye,
  IconReplace,
  IconRotateClockwise,
  IconDownload,
  IconFileTypePdf,
  IconRefresh,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

type PdfOrUrl = File | string;

interface PdfUploadProps {
  file: PdfOrUrl | null;
  onChange: (file: PdfOrUrl | null) => void;
  onFileReplace?: (oldUrl: string, newFile: File) => void;
  originalFile?: PdfOrUrl | null;
  maxFileSize?: number; // em MB
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
}

// Modal para preview de PDF
const PdfPreviewModal: React.FC<{
  isOpen: boolean;
  pdfUrl: string;
  fileName?: string;
  onClose: () => void;
}> = ({ isOpen, pdfUrl, fileName = "documento.pdf", onClose }) => {
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLoadError(false);
      setRetryCount(0);
    }
  }, [isOpen, pdfUrl]);

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

  const handleRetry = () => {
    setLoadError(false);
    setRetryCount((prev) => prev + 1);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200 animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-lg bg-card shadow-2xl duration-200 animate-in zoom-in-95"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <IconFileTypePdf className="h-6 w-6 text-red-500" />
            <div>
              <h2 className="font-semibold text-foreground">{fileName}</h2>
              <p className="text-sm text-muted-foreground">
                Visualização de PDF
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
              title="Baixar PDF"
            >
              <IconDownload className="h-4 w-4" />
              Baixar
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-foreground transition-colors hover:bg-muted"
              title="Fechar"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-muted/10">
          {loadError ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <IconAlertCircle className="h-16 w-16 text-red-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  Não foi possível exibir o PDF
                </h3>
                <p className="text-sm text-muted-foreground">
                  O arquivo pode estar corrompido ou em um formato não
                  suportado.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm transition-colors hover:bg-muted/80"
                >
                  <IconRefresh className="h-4 w-4" />
                  Tentar novamente
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <IconDownload className="h-4 w-4" />
                  Baixar PDF
                </button>
              </div>
            </div>
          ) : (
            <iframe
              key={`pdf-${retryCount}`}
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              className="h-full w-full border-0"
              title={fileName}
              onError={() => setLoadError(true)}
              onLoad={() => setLoadError(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const PdfUpload: React.FC<PdfUploadProps> = ({
  file,
  onChange,
  onFileReplace,
  originalFile,
  maxFileSize = 10,
  className,
  disabled = false,
  placeholder = "Selecionar PDF",
  description = "Certificados, declarações e documentos",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    url: "",
    fileName: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Gera URL de preview quando o arquivo muda
  useEffect(() => {
    if (file) {
      if (typeof file === "string") {
        setPreviewUrl(file);
      } else {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    } else {
      setPreviewUrl("");
    }
  }, [file]);

  // Limpa URLs quando componente é desmontado
  useEffect(() => {
    return () => {
      if (previewUrl && typeof file !== "string") {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, file]);

  const validateFile = (file: File): boolean => {
    // Verifica tipo
    if (file.type !== "application/pdf") {
      console.error("Arquivo não é PDF:", file.type);
      return false;
    }

    // Verifica tamanho
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxFileSize) {
      console.error(
        `Arquivo muito grande: ${sizeInMB.toFixed(2)}MB (máximo: ${maxFileSize}MB)`,
      );
      return false;
    }

    return true;
  };

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    if (!validateFile(file)) return;

    setIsLoading(true);

    try {
      // Simula delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 500));
      onChange(file);
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplace = () => {
    if (disabled) return;
    replaceInputRef.current?.click();
  };

  const handleReplaceFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newFile = files[0];
    if (!validateFile(newFile)) return;

    setIsLoading(true);

    try {
      // Se há callback para substituição e arquivo atual é URL
      if (onFileReplace && typeof file === "string") {
        onFileReplace(file, newFile);
      }

      // Simula delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 500));
      onChange(newFile);
    } catch (error) {
      console.error("Erro ao substituir arquivo:", error);
    } finally {
      setIsLoading(false);
    }

    // Limpa o input
    event.target.value = "";
  };

  const handleRemove = () => {
    if (disabled) return;
    onChange(null);
  };

  const handleRevert = () => {
    if (disabled || !originalFile) return;
    onChange(originalFile);
  };

  const handlePreview = () => {
    if (!previewUrl) return;

    const fileName =
      typeof file === "string"
        ? file.split("/").pop() || "documento.pdf"
        : file?.name || "documento.pdf";

    setPreviewModal({
      isOpen: true,
      url: previewUrl,
      fileName,
    });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, url: "", fileName: "" });
  };

  // Verifica se o arquivo foi modificado
  const isFileModified = (): boolean => {
    if (!originalFile || !file) return false;
    if (typeof file === "string" && typeof originalFile === "string") {
      return file !== originalFile;
    }
    return typeof file !== "string"; // Se é File, foi modificado
  };

  const getFileSize = (): string => {
    if (!file || typeof file === "string") return "";
    return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileName = (): string => {
    if (!file) return "";
    return typeof file === "string"
      ? file.split("/").pop() || "documento.pdf"
      : file.name;
  };

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: handleFileChange,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: maxFileSize * 1024 * 1024,
    disabled: disabled || file !== null,
    noClick: file !== null,
  });

  // Se já tem arquivo, mostra o preview
  if (file) {
    return (
      <div className={cn("w-full", className)}>
        {/* Input para substituição */}
        <input
          ref={replaceInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleReplaceFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="group relative overflow-hidden rounded-lg border-2 border-dashed border-border bg-card transition-all duration-200 hover:border-primary/50">
          {isLoading ? (
            <div className="flex items-center justify-center gap-4 p-8">
              <IconLoader className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Processando PDF...
                </p>
                <p className="text-xs text-muted-foreground">
                  Aguarde enquanto processamos seu arquivo
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-6">
              {/* Ícone e Status */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:border-red-800/30 dark:from-red-950/20 dark:to-orange-950/20">
                    <IconFileTypePdf className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                    <IconCheck className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Informações do arquivo */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="max-w-96 truncate font-semibold text-foreground">
                    {getFileName()}
                  </h3>
                  {isFileModified() && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                      <IconAlertCircle className="h-3 w-3" />
                      Modificado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>PDF</span>
                  {getFileSize() && (
                    <>
                      <span>•</span>
                      <span>{getFileSize()}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Upload concluído
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Clique em &quot;Visualizar&quot; para ver o conteúdo do
                  documento
                </p>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:scale-105 hover:bg-primary/20"
                  title="Visualizar PDF"
                  disabled={disabled}
                >
                  <IconEye className="h-4 w-4" />
                </button>

                {/* Botão de ação baseado no estado */}
                {typeof file === "string" ? (
                  <button
                    type="button"
                    onClick={handleReplace}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 transition-all hover:scale-105 hover:bg-blue-500/20"
                    title="Substituir PDF"
                    disabled={disabled}
                  >
                    <IconReplace className="h-4 w-4" />
                  </button>
                ) : isFileModified() ? (
                  <button
                    type="button"
                    onClick={handleRevert}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 transition-all hover:scale-105 hover:bg-orange-500/20"
                    title="Reverter para PDF original"
                    disabled={disabled}
                  >
                    <IconRotateClockwise className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-all hover:scale-105 hover:bg-destructive/20"
                    title="Remover PDF"
                    disabled={disabled}
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Preview */}
        <PdfPreviewModal
          isOpen={previewModal.isOpen}
          pdfUrl={previewModal.url}
          fileName={previewModal.fileName}
          onClose={closePreview}
        />
      </div>
    );
  }

  // Área de upload
  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 transition-all duration-200",
          "border-border bg-card hover:bg-accent/30",
          isDragActive && "border-primary bg-primary/10",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-red-500/10 p-6">
            <IconFileTypePdf className="h-12 w-12 text-red-500" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              {isDragActive ? "Solte o PDF aqui" : placeholder}
            </h3>
            <p className="text-sm text-muted-foreground">
              Arraste e solte ou{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary underline transition-colors hover:text-primary/80"
                disabled={disabled}
              >
                clique para selecionar
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              {description} • Apenas PDF • Até {maxFileSize}MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;
export { PdfUpload };
export type { PdfUploadProps };
