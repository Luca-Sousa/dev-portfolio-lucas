"use client";

import { deleteProject } from "@/app/(dashboard)/actions/project/delete-project";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Loader2Icon, StepForwardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteProjectDialogContentProps {
  productId: string;
  // thumbnailUrl: string;
  // imagesUrl: string[];
  // certificateUrl?: string;
}

const DeleteProjectDialogContent = ({
  productId,
}: DeleteProjectDialogContentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinueClick = async () => {
    setIsSubmitting(true);

    try {
      //   const deleteUploads = [
      //     edgestore.publicImages.delete({ url: thumbnailUrl }),
      //     certificateUrl
      //       ? edgestore.publicFiles.delete({ url: certificateUrl })
      //       : null,
      //     ...imagesUrl.map((image) =>
      //       edgestore.publicImages.delete({ url: image }),
      //     ),
      //   ];
      // Esperar todos os deletes serem confirmados
      //   await Promise.all(deleteUploads.filter(Boolean));

      await deleteProject({ id: productId });

      toast.success("Projeto excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir Projeto!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Excluindo este projeto irá excluir todos os dados relacionados. Deseja
          continuar?
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel className="gap-1.5" disabled={isSubmitting}>
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          className="gap-1.5 bg-destructive/60 hover:bg-destructive/45"
          onClick={handleContinueClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2Icon className="animate-spin" size={16} />
          ) : (
            <StepForwardIcon size={16} />
          )}
          Continuar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteProjectDialogContent;
