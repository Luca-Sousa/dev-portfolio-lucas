import { cn } from "@/app/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconLoader, IconTrash, IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import GridPattern from "../grid-pattern";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

type FileOrUrl = File | string;

interface FileUploadProps {
  files: FileOrUrl[] | null;
  onChange: (files: FileOrUrl[]) => void;
  singleFile?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files: propFiles,
  onChange,
  singleFile,
}) => {
  const [files, setFiles] = useState<FileOrUrl[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Atualiza previews e estado interno ao receber novas props
  useEffect(() => {
    // Certifica que propFiles é array e converte se necessário
    const initialFiles = Array.isArray(propFiles)
      ? propFiles
      : propFiles
        ? [propFiles]
        : [];
    setFiles(initialFiles);

    // Gera URLs de preview para cada arquivo
    const urls = initialFiles.map((file) =>
      typeof file === "string" ? file : URL.createObjectURL(file),
    );
    setPreviewUrls(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propFiles]);

  const handleFileChange = (newFiles: File[]) => {
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    const updatedFiles = singleFile
      ? [newFiles[0]]
      : [...files.filter((file) => typeof file === "string"), ...newFiles];
    const updatedUrls = singleFile
      ? [newUrls[0]]
      : [
          ...previewUrls.filter((_, i) => typeof files[i] === "string"),
          ...newUrls,
        ];

    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    onChange(updatedFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: !singleFile,
    noClick: singleFile && files.length > 0,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  const handleDeleteFile = (idx: number) => {
    // Revoke URL object if it's a File
    if (files[idx] instanceof File) {
      URL.revokeObjectURL(previewUrls[idx]);
    }

    // Update state
    const updatedFiles = files.filter((_, i) => i !== idx);
    const updatedUrls = previewUrls.filter((_, i) => i !== idx);
    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    onChange(updatedFiles);
  };

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            Carregar arquivo
          </p>
          <p className="relative z-20 mt-2 max-w-[16rem] text-center font-sans text-sm font-normal text-neutral-400 dark:text-neutral-400">
            Arraste ou solte seus arquivos aqui ou clique para fazer upload
          </p>
          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {files.length > 0 && !singleFile && (
              <div className="ml-auto flex justify-end text-sm font-medium text-neutral-500">
                {files.length} arquivo(s)
              </div>
            )}
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={`file-${idx}`}
                  layoutId={idx === 0 ? "file-upload" : `file-upload-${idx}`}
                  className={cn(
                    "relative z-40 mx-auto mt-4 flex w-full items-center gap-3 overflow-hidden rounded-md bg-white p-4 dark:bg-neutral-900 md:h-24",
                    "shadow-sm",
                  )}
                >
                  <motion.div className="relative flex size-16 items-center justify-center text-neutral-600 dark:text-white">
                    {!previewUrls[idx] ? (
                      <IconLoader
                        size={32}
                        className="animate-spin text-neutral-500 transition-all"
                      />
                    ) : (
                      <Image
                        src={previewUrls[idx]}
                        alt="Imagem de Previsualização"
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </motion.div>

                  <div className="flex flex-1 flex-col items-start justify-start">
                    <div className="flex w-full items-center justify-between gap-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="max-w-44 truncate text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        {typeof file === "string"
                          ? file.split("/").pop()
                          : file.name}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="w-fit shrink-0 rounded-lg px-1.5 py-1 text-sm text-neutral-600 shadow-input dark:bg-neutral-800 dark:text-white"
                      >
                        {typeof file === "string"
                          ? "Arquivo existente"
                          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                      </motion.p>
                    </div>

                    <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 dark:text-neutral-400 md:flex-row md:items-center">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-md bg-gray-100 px-1 py-0.5 text-sm dark:bg-neutral-800"
                      >
                        {typeof file === "string" ? "URL" : file.type}
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="flex flex-col text-xs"
                      >
                        <span>modificado</span>
                        {typeof file === "string"
                          ? "-"
                          : new Date(file.lastModified).toLocaleDateString()}
                      </motion.p>
                    </div>
                  </div>

                  {typeof file !== "string" && (
                    <motion.button
                      type="button"
                      className="h-full w-10 rounded-md transition-colors hover:bg-neutral-700"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteFile(idx);
                      }}
                    >
                      <IconTrash className="mx-auto size-5 text-neutral-600 dark:text-neutral-400" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            {files.length === 0 && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-neutral-600"
                  >
                    Solte Aqui
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {files.length === 0 && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUpload;
