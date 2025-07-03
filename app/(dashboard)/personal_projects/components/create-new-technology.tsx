"use client";

import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useIsMobile } from "@/app/hooks/use-mobile";
import UpsertTechnologyDialog from "./upsert-technology-form";

const CreateNewTechnology = () => {
  const isMobile = useIsMobile();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size={isMobile ? "icon" : "default"}
        className="dark:shadow-emerald/25 group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 hover:shadow-xl"
        onClick={() => setDialogIsOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-center gap-2 font-semibold">
          <div className="rounded-full bg-white/20 p-0.5 transition-transform group-hover:rotate-90">
            <CirclePlusIcon size={16} />
          </div>
          {isMobile ? "" : "Nova Tecnologia"}
        </div>
      </Button>

      <UpsertTechnologyDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default CreateNewTechnology;
