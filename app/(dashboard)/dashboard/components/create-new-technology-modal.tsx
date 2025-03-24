"use client";

import { CirclePlusIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import {
  CreateTechnologySchema,
  createTechnologySchema,
} from "../../actions/technology/create-technology/schema";
import { FileUpload } from "@/app/components/ui/file-upload";
import { createTechnology } from "../../actions/technology/create-technology";
import { toast } from "sonner";
import { Input } from "@/app/components/ui/input";
import { deleteFileFromBucket } from "@/app/utils/delete-file";

const ModalCreateNewTechnology = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(createTechnologySchema),
    defaultValues: {
      name: "",
      iconURL: "",
    },
  });

  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name;
      const fileContent = file.type;

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileName,
          fileContent: fileContent,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Falha ao obter a URL pré-assinada");
      }

      const { signedUrl, fileKey } = await uploadResponse.json();

      const fileUploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileContent,
        },
        body: file,
      });

      if (!fileUploadResponse.ok) {
        throw new Error("Falha no upload do arquivo");
      }

      const customUrl = `https://pub-14cdb793b4b54085abc21edea67d935a.r2.dev/${fileKey}`;
      setUploadedFileUrl(customUrl);
      return customUrl;
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      throw new Error("Erro ao fazer upload do arquivo");
    }
  };

  const handleCreateTechnology = async (data: CreateTechnologySchema) => {
    try {
      if (!uploadedFileUrl) {
        throw new Error("Nenhum arquivo carregado");
      }

      await createTechnology({
        name: data.name,
        iconURL: uploadedFileUrl,
      });

      setUploadedFileUrl("");
      setDialogIsOpen(false);
      toast.success("Tecnologia criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar a tecnologia! " + error);
    }
  };

  const handleDeleteFile = async (fileKey: string, onSuccess?: () => void) => {
    try {
      await deleteFileFromBucket(fileKey);

      setUploadedFileUrl("");
      form.setValue("iconURL", "");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao deletar o arquivo:", error);
    }
  };

  return (
    <Dialog
      open={dialogIsOpen}
      onOpenChange={(open) => {
        if (uploadedFileUrl) {
          const fileKey = uploadedFileUrl.split("/").pop() || "";
          handleDeleteFile(fileKey);
        }

        setDialogIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 font-medium">
          <CirclePlusIcon size={16} />
          Nova Tecnologia
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            Criar nova Tecnologia
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateTechnology)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da tecnologia..." {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconURL"
              render={({}) => (
                <FormItem>
                  <FormLabel>Ícone da Tecnologia</FormLabel>
                  <FormControl>
                    <div className="h-fit rounded-lg border-2 border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                      <FileUpload
                        onChange={async (files) => {
                          if (files.length > 0) {
                            const file = files[0];
                            const fileUrl = await handleFileUpload(file);
                            form.setValue("iconURL", fileUrl);
                          }
                        }}
                        singleFile
                        uploadedFileUrl={form.getValues("iconURL")}
                        handleDeleteFile={handleDeleteFile}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="reset"
                  variant="secondary"
                  className="gap-1.5"
                  disabled={form.formState.isSubmitting}
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="animate-spin" size={16} />
                ) : (
                  <SaveIcon size={16} />
                )}
                Salvar Tecnologia
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateNewTechnology;
