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
        <Button variant="ghost" size="icon">
          <EditIcon size={14} />
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
