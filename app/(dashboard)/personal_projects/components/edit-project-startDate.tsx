"use client";

import { updateProjectStartDate } from "@/app/(dashboard)/actions/project/update-project-startDate";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { cn } from "@/app/lib/utils";
import { IconCalendarEvent } from "@tabler/icons-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProjectStartDateProps {
  id: string;
  startDate: Date;
}

const EditProjectStartDate = ({ id, startDate }: EditProjectStartDateProps) => {
  const [currentStartDate, setCurrentStartDate] = useState<Date>(startDate);

  const handleProjectStartDate = (newStatus: Date) => {
    try {
      updateProjectStartDate({ projectId: id, startDate: newStatus });

      setCurrentStartDate(newStatus);
      toast.success("Data de início do projeto atualizada com sucesso!");
    } catch (error) {
      toast.error(`Ocorreu o seguinte erro: ${error}`);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <IconCalendarEvent size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">
            Data de Início
          </h2>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-normal",
                  !currentStartDate && "text-muted-foreground",
                )}
                aria-label="Selecionar data de início do projeto"
              >
                <CalendarIcon />
                {format(currentStartDate, "PPP", {
                  locale: ptBR,
                })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentStartDate}
                onSelect={(date) => {
                  if (date) handleProjectStartDate(date);
                }}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <span className="hidden sm:block"></span>

        <span className="h-fit border-none pl-0 !text-base focus:pl-3">
          {format(currentStartDate, "PPP", {
            locale: ptBR,
          })}
        </span>
      </div>
    </div>
  );
};

export default EditProjectStartDate;
