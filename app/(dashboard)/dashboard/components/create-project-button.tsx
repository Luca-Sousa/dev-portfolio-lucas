"use client";

import { FilePlus2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import { useState } from "react";
import CreateProjectDialogContent from "./create-new-project";

const CreateProjectButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-8 items-center gap-2 font-medium text-secondary">
          <FilePlus2 size={14} />
          Novo Projeto
        </Button>
      </DialogTrigger>

      <CreateProjectDialogContent onSuccess={() => setDialogIsOpen(false)} />
    </Dialog>
  );
};

export default CreateProjectButton;
