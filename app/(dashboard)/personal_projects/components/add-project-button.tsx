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
        <Button className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:via-primary hover:to-primary hover:shadow-xl dark:shadow-primary/25">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center gap-2 font-semibold">
            <div className="rounded-full bg-white/20 p-1 transition-transform group-hover:rotate-180">
              <FilePlus2 size={14} />
            </div>
            Novo Projeto
          </div>
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
