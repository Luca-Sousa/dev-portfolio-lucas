"use client";

import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useIsMobile } from "@/app/hooks/use-mobile";
import UpsertTechnologyDialog from "./upsert-technology-dialog";

const CreateNewTechnology = () => {
  const isMobile = useIsMobile();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size={isMobile ? "icon" : "default"}
        className="flex items-center gap-2 font-medium"
        onClick={() => setDialogIsOpen(true)}
      >
        <CirclePlusIcon size={16} />
        {isMobile ? "" : "Nova Tecnologia"}
      </Button>

      <UpsertTechnologyDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default CreateNewTechnology;
