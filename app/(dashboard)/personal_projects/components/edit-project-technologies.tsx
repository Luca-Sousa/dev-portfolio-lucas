"use client";

import SkillCard from "@/app/components/skill-card";
import { Button } from "@/app/components/ui/button";
import { Technology } from "@prisma/client";
import { CaptionsIcon, PenBoxIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { updateProjectTechnologies } from "@/app/(dashboard)/actions/project/update-project-technologies";
import {
  IconCancel,
  IconCopyPlusFilled,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import SortableSkillCard from "./sortable-skill-card";
import Image from "next/image";

interface EditProjectTechnologiesProps {
  id: string;
  technologies: Technology[];
  allTechnologies: Technology[];
}

const EditProjectTechnologies = ({
  id,
  technologies,
  allTechnologies,
}: EditProjectTechnologiesProps) => {
  const [selectedTechnologies, setSelectedTechnologies] = useState<
    (Technology & { order: number })[]
  >(
    technologies.map((tech, index) => ({
      ...tech,
      order: index,
    })),
  );
  const [removedTechnologies, setRemovedTechnologies] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSelectedTechnologies((prev) => {
      const oldIndex = prev.findIndex((tech) => tech.id === active.id);
      const newIndex = prev.findIndex((tech) => tech.id === over.id);
      return arrayMove(prev, oldIndex, newIndex).map((tech, index) => ({
        ...tech,
        order: index,
      }));
    });
  };

  const handleRemoveTechnology = (techId: string) => {
    setSelectedTechnologies((prev) =>
      prev.filter((tech) => tech.id !== techId),
    );
    setRemovedTechnologies((prev) => [...prev, techId]);
  };

  const handleCancel = () => {
    setSelectedTechnologies(
      technologies.map((tech, index) => ({
        ...tech,
        order: index,
      })),
    );
    setRemovedTechnologies([]);
    setIsEditing(false);
  };

  const handleEditTechnology = async () => {
    setLoading(true);

    try {
      await updateProjectTechnologies({
        projectId: id,
        technologies: selectedTechnologies.map(({ id, order }) => ({
          id,
          order,
        })),
        technologiesToRemove: removedTechnologies,
      });

      toast.success("Tecnologias atualizadas com sucesso!");
      setRemovedTechnologies([]);
      setIsEditing(false);
    } catch (error) {
      toast.error(`Erro ao atualizar tecnologias: ${error}`);
      handleCancel();
    } finally {
      setLoading(false);
    }
  };

  const availableTechnologies = allTechnologies.filter(
    (tech) => !selectedTechnologies.some((selected) => selected.id === tech.id),
  );

  const handleAddTechnology = (techId: string) => {
    const techToAdd = allTechnologies.find((tech) => tech.id === techId);
    if (techToAdd) {
      setSelectedTechnologies((prev) => [
        ...prev,
        { ...techToAdd, order: prev.length },
      ]);
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-4 ring-1 ring-ring">
      <div className="grid grid-cols-[2.5rem,1fr] items-center">
        <CaptionsIcon size={20} />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold text-muted-foreground">
            Tecnologias
          </h2>

          <div className="flex items-center space-x-1.5">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                >
                  <IconCopyPlusFilled />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="end">
                <Command>
                  <CommandList>
                    <CommandEmpty>Nenhuma tecnologia disponível</CommandEmpty>
                    <CommandGroup>
                      {availableTechnologies.map((tech) => (
                        <CommandItem
                          key={tech.id}
                          value={tech.id}
                          onSelect={() => {
                            handleAddTechnology(tech.id);
                            setOpen(false);
                          }}
                        >
                          <Image
                            alt="Imagem da tecnologia"
                            src={tech.iconURL}
                            width={16}
                            height={16}
                          />
                          {tech.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {!isEditing && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <PenBoxIcon />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedTechnologies}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {selectedTechnologies.map((tech, index) => (
                <SortableSkillCard
                  key={tech.id}
                  tech={tech}
                  index={index}
                  onRemove={() => handleRemoveTechnology(tech.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid gap-3">
          {selectedTechnologies.map((tech, index) => (
            <div key={tech.id} className="flex items-center gap-1.5">
              <span className="min-w-5 font-bold text-gray-600">
                {index + 1}.
              </span>

              <SkillCard
                imageURL={tech.iconURL}
                label={tech.name}
                description={tech.description}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="flex items-center justify-end space-x-3">
          <Button variant="ghost" onClick={handleCancel} disabled={loading}>
            <IconCancel />
            Cancelar
          </Button>

          <Button onClick={handleEditTechnology} disabled={loading}>
            <IconDeviceFloppy />
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditProjectTechnologies;
