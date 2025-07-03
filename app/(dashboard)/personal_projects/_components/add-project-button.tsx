"use client";

import { Button } from "@/app/components/ui/button";
import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import { FilePlus2 } from "lucide-react";
import UpsertProjectForm from "./upsert-project-form";
import { useState } from "react";

const AddProjectButton = () => {
  const [isOpenUpsertProject, setIsOpenUpsertProject] = useState(false);

  return (
    <Dialog open={isOpenUpsertProject} onOpenChange={setIsOpenUpsertProject}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 font-medium">
          <FilePlus2 size={14} />
          Novo Projeto
        </Button>
      </DialogTrigger>

      <UpsertProjectForm
        isOpen={isOpenUpsertProject}
        onSuccess={() => setIsOpenUpsertProject(false)}
      />
    </Dialog>
  );
};

export default AddProjectButton;
