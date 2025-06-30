"use client";

import { updateProjectStatus } from "@/app/(dashboard)/actions/project/update-project-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_OPTIONS } from "@/app/data";
import { ProjectStatus } from "@prisma/client";
import { TagIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProjectStatusProps {
  id: string;
  status: ProjectStatus;
}

const EditProjectStatus = ({ id, status }: EditProjectStatusProps) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleProjectStatus = (newStatus: ProjectStatus) => {
    try {
      updateProjectStatus({ projectId: id, status: newStatus });

      setCurrentStatus(newStatus);
      toast.success("Status do projeto atualizado com sucesso!");
    } catch (error) {
      toast.error(`Ocorreu o seguinte erro: ${error}`);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <TagIcon size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">Status</h2>

          <Select
            onValueChange={(value) =>
              handleProjectStatus(value as ProjectStatus)
            }
            defaultValue={currentStatus}
          >
            <SelectTrigger className="max-w-fit gap-3">
              <SelectValue placeholder={currentStatus} />
            </SelectTrigger>
            <SelectContent align="end">
              {PROJECT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <span className="hidden sm:block"></span>

        <span className="h-fit border-none pl-0 !text-base focus:pl-3">
          {PROJECT_STATUS_LABELS[status]}
        </span>
      </div>
    </div>
  );
};

export default EditProjectStatus;
