"use client";

import { Loader2Icon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  UpsertTechnologySchema,
  upsertTechnologySchema,
} from "../../actions/technology/upsert-technology/schema";
import { FileUpload } from "@/app/components/ui/file-upload";
import { upsertTechnology } from "../../actions/technology/upsert-technology";
import { toast } from "sonner";
import { Input } from "@/app/components/ui/input";
import { handleFileUpload } from "@/app/utils/create-file";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import Image from "next/image";
import { IconReplaceFilled } from "@tabler/icons-react";
import { deleteFileFromBucket } from "@/app/utils/delete-file";

interface UpsertTechnologyDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  defaultValues?: UpsertTechnologySchema;
}

const UpsertTechnologyDialog = ({
  isOpen,
  setIsOpen,
  defaultValues,
}: UpsertTechnologyDialogProps) => {
  const [IconFile, setIconFile] = useState<File | null>(null);
  const isupdate = Boolean(defaultValues?.id);
  const [isUpdatingIcon, setIsUpdatingIcon] = useState(false);
  const [technologyName, setTechnologyName] = useState<string>(
    defaultValues?.name ?? "",
  );
  const [technologyDescription, setTechnologyDescription] = useState<string>(
    defaultValues?.description ?? "",
  );
  const [technologyIconurl, setTechnologyIconurl] = useState<string>(
    typeof defaultValues?.iconURL === "string" ? defaultValues.iconURL : "",
  );

  useEffect(() => {
    if (defaultValues) {
      setTechnologyName(defaultValues.name);
      setTechnologyDescription(defaultValues.description);
      setTechnologyIconurl(
        typeof defaultValues.iconURL === "string" ? defaultValues.iconURL : "",
      );
    }
  }, [defaultValues]);

  const form = useForm({
    resolver: zodResolver(upsertTechnologySchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      iconURL: undefined,
    },
  });

  const handleUpsertTechnology = async (data: UpsertTechnologySchema) => {
    try {
      if (isUpdatingIcon && typeof defaultValues?.iconURL === "string") {
        const fileKey = defaultValues.iconURL.split("/").pop();
        if (fileKey) {
          await deleteFileFromBucket(fileKey);
        }
      }

      const uploadedIconUrl = IconFile
        ? await handleFileUpload(IconFile, "iconURL")
        : data.iconURL;

      const technologyData: UpsertTechnologySchema = {
        ...data,
        iconURL: uploadedIconUrl ?? "",
      };

      await upsertTechnology(technologyData);

      setTechnologyName(technologyData.name);
      setTechnologyDescription(technologyData.description);
      setTechnologyIconurl(
        typeof technologyData.iconURL === "string"
          ? technologyData.iconURL
          : "",
      );
      form.reset();
      setIsOpen(false);
      toast.success(
        isupdate
          ? "Tecnologia atualizada com sucesso!"
          : "Tecnologia criada com sucesso!",
      );
    } catch (error) {
      toast.error("Erro ao salvar a tecnologia! " + error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          if (isUpdatingIcon) setIsUpdatingIcon(false);
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild></DialogTrigger>

      <DialogContent
        className={`${isupdate && !isUpdatingIcon ? "max-w-lg" : "max-w-2xl"} flex max-h-[70%] flex-col`}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {isupdate ? "Editar" : "Criar nova"} Tecnologia
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpsertTechnology)}
            className="flex h-full flex-col space-y-6 overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div
                className={`${isupdate && !isUpdatingIcon ? "w-full flex-col px-1" : "flex-row"} mb-6 mr-3 flex gap-5 pl-1`}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="basis-1/2">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome da tecnologia..."
                          value={technologyName}
                          onChange={(e) => {
                            setTechnologyName(e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="basis-1/2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descrição da tecnologia..."
                          value={technologyDescription}
                          onChange={(e) => {
                            setTechnologyDescription(e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="iconURL"
                render={({ field }) => (
                  <FormItem className="px-1">
                    <FormLabel>Ícone da Tecnologia</FormLabel>
                    <FormControl>
                      <div
                        className={`${
                          !isupdate &&
                          "mr-3 h-fit w-full rounded-lg border-2 border-dashed border-neutral-200 bg-white pl-1 dark:border-neutral-800 dark:bg-black"
                        }`}
                      >
                        {isupdate && !isUpdatingIcon ? (
                          <div className="flex w-full items-center justify-between">
                            <Image
                              src={technologyIconurl || (field.value as string)}
                              alt="Imagem da Tecnologia"
                              width={64}
                              height={64}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsUpdatingIcon(true)}
                            >
                              <IconReplaceFilled />
                              Trocar Ícone
                            </Button>
                          </div>
                        ) : (
                          <FileUpload
                            onChange={(files) => {
                              if (files.length > 0) {
                                const file = files[0];
                                setIconFile(file);
                                form.setValue("iconURL", file);
                              }
                            }}
                            singleFile
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>

            <DialogFooter className="p-1 pt-0">
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
                {isupdate ? "Atualizar" : "Salvar"} Tecnologia
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTechnologyDialog;
