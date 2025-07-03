"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";

interface Technology {
  id: string;
  name: string;
  iconURL: string;
  description?: string;
}

interface SortableTechSelectorProps {
  selectedTechnologies: string[];
  allTechnologies: Technology[];
  onChange: (technologies: string[]) => void;
}

interface SortableTechItemProps {
  tech: Technology;
  index: number;
  onRemove: () => void;
}

// Componente sortable para as tecnologias
const SortableTechItem: React.FC<SortableTechItemProps> = ({
  tech,
  index,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tech.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex flex-1 cursor-move items-center gap-3"
      >
        <span className="min-w-5 font-bold text-muted-foreground">
          {index + 1}.
        </span>
        <Image
          alt={tech.name}
          src={tech.iconURL}
          width={20}
          height={20}
          className="rounded"
        />
        <span className="flex-1 text-sm font-medium">{tech.name}</span>
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="h-6 w-6 shrink-0 p-0 hover:bg-destructive hover:text-destructive-foreground"
      >
        ×
      </Button>
    </div>
  );
};

// Componente principal do seletor sortable de tecnologias
export const SortableTechSelector: React.FC<SortableTechSelectorProps> = ({
  selectedTechnologies,
  allTechnologies,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  // Configuração dos sensores do dnd-kit com restrições
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínimo de 8px para ativar o drag
      },
    }),
    useSensor(KeyboardSensor),
  );

  // Garantir que selectedTechnologies é sempre um array
  const safeSelectedTechnologies = Array.isArray(selectedTechnologies)
    ? selectedTechnologies
    : [];

  // Obter as tecnologias selecionadas com dados completos
  const selectedTechsWithData = safeSelectedTechnologies
    .map((id) => allTechnologies.find((tech) => tech.id === id))
    .filter(Boolean) as Technology[];

  // Tecnologias disponíveis para seleção
  const availableTechnologies = allTechnologies.filter(
    (tech) => !safeSelectedTechnologies.includes(tech.id),
  );

  const handleDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = safeSelectedTechnologies.findIndex(
      (id) => id === active.id,
    );
    const newIndex = safeSelectedTechnologies.findIndex((id) => id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(safeSelectedTechnologies, oldIndex, newIndex);
      onChange(newOrder);
    }
  };

  const handleAddTechnology = (techId: string) => {
    const newTechnologies = [...safeSelectedTechnologies, techId];
    onChange(newTechnologies);
    setOpen(false);
  };

  const handleRemoveTechnology = (techId: string) => {
    const newTechnologies = safeSelectedTechnologies.filter(
      (id) => id !== techId,
    );
    onChange(newTechnologies);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {safeSelectedTechnologies.length} tecnologia(s) selecionada(s)
        </span>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={availableTechnologies.length === 0}
            >
              + Adicionar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandList>
                <CommandEmpty>Nenhuma tecnologia disponível</CommandEmpty>
                <CommandGroup>
                  {availableTechnologies.map((tech) => (
                    <CommandItem
                      key={tech.id}
                      value={tech.id}
                      onSelect={() => handleAddTechnology(tech.id)}
                      className="flex items-center gap-2"
                    >
                      <Image
                        alt={tech.name}
                        src={tech.iconURL}
                        width={16}
                        height={16}
                        className="rounded"
                      />
                      {tech.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedTechsWithData.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={safeSelectedTechnologies}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {selectedTechsWithData.map((tech, index) => (
                <SortableTechItem
                  key={tech.id}
                  tech={tech}
                  index={index}
                  onRemove={() => handleRemoveTechnology(tech.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {safeSelectedTechnologies.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma tecnologia selecionada</p>
          <p className="text-xs">
            Clique em &quot;Adicionar&quot; para começar
          </p>
        </div>
      )}
    </div>
  );
};

export default SortableTechSelector;
