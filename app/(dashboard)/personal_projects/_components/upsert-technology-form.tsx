"use client";

import { Loader2Icon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Form, FormControl } from "@/app/components/ui/form";
import { FileUpload } from "@/app/(dashboard)/_components/file-upload";
import { toast } from "sonner";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import CustomFormField, {
  FormFieldType,
} from "@/app/components/form/custom-form-field";
import { useAction } from "next-safe-action/hooks";
import { upsertTechnology } from "@/app/_actions/technology/technology.actions";
import { z } from "zod";
import { useEffect } from "react";
import { Technology } from "@prisma/client";

const upsertTechnologySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  description: z.string().trim().min(1, {
    message: "A descrição é obrigatória.",
  }),
  iconURL: z.array(
    z.union([
      z.instanceof(File, { message: "Entrada não instância de arquivo" }),
      z.string().url({ message: "URL inválido" }),
    ]),
    { message: "O ícone é obrigatório." },
  ),
});

type UpsertTechnologySchema = z.infer<typeof upsertTechnologySchema>;

interface UpsertTechnologyFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  defaultValues?: Technology;
}

const UpsertTechnologyForm = ({
  isOpen,
  setIsOpen,
  defaultValues,
}: UpsertTechnologyFormProps) => {
  const isupdate = Boolean(defaultValues?.id);

  const form = useForm({
    resolver: zodResolver(upsertTechnologySchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      iconURL: defaultValues?.iconURL
        ? Array.isArray(defaultValues.iconURL)
          ? defaultValues.iconURL
          : [defaultValues.iconURL]
        : undefined,
    },
  });

  useEffect(() => {
    if (isOpen && defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        iconURL: defaultValues?.iconURL
          ? Array.isArray(defaultValues.iconURL)
            ? defaultValues.iconURL
            : [defaultValues.iconURL]
          : undefined,
      });
    } else if (!isOpen) {
      form.reset({
        name: "",
        description: "",
        iconURL: undefined,
      });
    }
  }, [isOpen, defaultValues, form]);

  const upsertTechnologyAction = useAction(upsertTechnology, {
    onSuccess: () => {
      form.reset();
      setIsOpen(false);
      toast.success(
        isupdate
          ? "Tecnologia atualizada com sucesso!"
          : "Tecnologia criada com sucesso!",
      );
      // onSuccess?.();
    },
    onError: ({ error }) => {
      console.error("Erro ao criar a tecnologia:", error);
      toast.error("Erro ao salvar a tecnologia! " + error);
    },
  });

  const uploadToR2 = async (file: File) => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileContent: file.type,
      }),
    });
    if (!res.ok) throw new Error("Falha ao obter URL pré-assinada");
    const { signedUrl, fileKey } = await res.json();

    await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    return `https://pub-cc396dbf1dd44f8dad20a09f8a694ebd.r2.dev/${fileKey}`;
  };

  const handleUpsertTechnology = async (values: UpsertTechnologySchema) => {
    let iconUrlString = "";

    if (values.iconURL && values.iconURL.length > 0) {
      const fileOrUrl = values.iconURL[0];
      if (typeof fileOrUrl === "string") {
        iconUrlString = fileOrUrl;
      } else if (fileOrUrl instanceof File) {
        iconUrlString = await uploadToR2(fileOrUrl);
      }
    }

    upsertTechnologyAction.execute({
      ...values,
      id: defaultValues?.id,
      iconURL: iconUrlString || "",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild></DialogTrigger>

      <DialogContent>
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
                className={`${isupdate ? "w-full flex-col px-1" : "flex-row"} mb-6 mr-3 flex gap-5 pl-1`}
              >
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="name"
                  label="Nome"
                  placeholder="Nome da tecnologia..."
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="description"
                  label="Descrição"
                  placeholder="Nome da Descrição..."
                />
              </div>

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="iconURL"
                label="Ícone da Tecnologia"
                optional
                formItemsClassName="px-1"
                renderSkeleton={(field) => (
                  <FormControl>
                    <FileUpload
                      files={field.value}
                      onChange={field.onChange}
                      singleFile
                    />
                  </FormControl>
                )}
              />
            </ScrollArea>

            <DialogFooter>
              <Button
                type="submit"
                className="flex w-full items-center gap-2"
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

export default UpsertTechnologyForm;
