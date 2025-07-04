"use client";

import { Button } from "@/app/components/ui/button";
import { Trash2 } from "lucide-react";
import { AcademicExperience } from "@prisma/client";
import { deleteAcademicExperience } from "@/app/_actions/academic-experience/academic-experience.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

const DeleteAcademicExperienceButton = ({
  academicExperience,
}: {
  academicExperience: AcademicExperience;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAcademicExperience({
        id: academicExperience.id,
      });

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }

      toast.success("Experiência acadêmica excluída com sucesso!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao excluir experiência acadêmica");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group relative overflow-hidden border-red-200 bg-gradient-to-br from-red-50 to-rose-50 shadow-sm transition-all duration-300 hover:scale-110 hover:border-red-300 hover:bg-gradient-to-br hover:from-red-100 hover:to-rose-100 hover:shadow-lg dark:border-red-800 dark:from-red-900/20 dark:to-rose-900/20 dark:hover:border-red-700 dark:hover:from-red-900/30 dark:hover:to-rose-900/30"
          disabled={isDeleting}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative transition-transform group-hover:scale-110">
            <Trash2
              size={14}
              className="text-red-600 transition-colors group-hover:text-red-700 dark:text-red-400 dark:group-hover:text-red-300"
            />
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a experiência acadêmica &quot;
            {academicExperience.title}&quot;? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAcademicExperienceButton;
