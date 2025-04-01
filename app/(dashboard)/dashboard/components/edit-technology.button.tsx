"use client";

import { Button } from "@/app/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import UpsertTechnologyDialog from "./upsert-technology-dialog";
import { Technology } from "@prisma/client";

interface EditTechnologyButtonProps {
  technology: Technology;
}

const EditTechnologyButton = ({ technology }: EditTechnologyButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="relative hover:!z-[80] hover:bg-primary hover:transition-colors"
        onClick={() => setDialogIsOpen(true)}
      >
        <IconEdit size={32} />
      </Button>

      <UpsertTechnologyDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={technology}
      />
    </>
  );
};

export default EditTechnologyButton;
