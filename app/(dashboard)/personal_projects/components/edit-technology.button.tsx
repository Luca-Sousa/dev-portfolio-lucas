"use client";

import { Button } from "@/app/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { Technology } from "@prisma/client";
import UpsertTechnologyForm from "./upsert-technology-form";

interface EditTechnologyButtonProps {
  technology: Technology;
}

const EditTechnologyButton = ({ technology }: EditTechnologyButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="dark:hover:shadow-orange/25 group relative overflow-hidden border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm transition-all duration-300 hover:scale-110 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-100 hover:to-amber-100 hover:shadow-lg dark:border-orange-800 dark:from-orange-900/20 dark:to-amber-900/20 dark:hover:border-orange-700 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30"
        onClick={() => setDialogIsOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-orange-500/20" />
        <div className="relative transition-transform group-hover:rotate-12">
          <IconEdit
            size={18}
            className="text-orange-600 transition-colors group-hover:text-orange-700 dark:text-orange-400 dark:group-hover:text-orange-300"
          />
        </div>
      </Button>

      <UpsertTechnologyForm
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={technology}
      />
    </>
  );
};

export default EditTechnologyButton;
