"use client";

import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import { Project } from "@/app/types";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import UpsertProjectForm from "./upsert-project-form";
import { Button } from "@/app/components/ui/button";

const EditProjectButton = ({ project }: { project: Project }) => {
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group relative overflow-hidden border-muted-foreground/20 bg-gradient-to-br from-muted/30 to-muted/10 shadow-sm transition-all duration-300 hover:scale-110 hover:border-primary/30 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:shadow-lg dark:hover:shadow-primary/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative transition-transform group-hover:rotate-12">
            <EditIcon
              size={14}
              className="text-muted-foreground transition-colors group-hover:text-primary"
            />
          </div>
        </Button>
      </DialogTrigger>

      <UpsertProjectForm
        isOpen={editDialogOpen}
        onSuccess={() => setEditDialogOpen(false)}
        project={project}
      />
    </Dialog>
  );
};

export default EditProjectButton;
