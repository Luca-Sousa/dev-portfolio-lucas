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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateProjectTechnologies } from "@/app/(dashboard)/actions/project/update-project-technologies";
import { IconTrash } from "@tabler/icons-react";

interface EditProjectTechnologiesProps {
  id: string;
  technologies: Technology[];
}

const EditProjectTechnologies = ({
  id,
  technologies,
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
    // Restaura todas as tecnologias originais
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
      // Reverte as mudanças em caso de erro
      handleCancel();
    } finally {
      setLoading(false);
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

          <div className="mt-4 flex items-center justify-end space-x-3">
            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>

            <Button onClick={handleEditTechnology} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DndContext>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-3">
          {selectedTechnologies.map((tech) => (
            <SkillCard
              key={tech.id}
              imageURL={tech.iconURL}
              label={tech.name}
              description={tech.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SortableSkillCardProps {
  tech: Technology & { order: number };
  index: number;
  onRemove: () => void;
}

const SortableSkillCard = ({
  tech,
  index,
  onRemove,
}: SortableSkillCardProps) => {
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
      {...attributes}
      className="flex w-full items-center gap-1"
    >
      <div
        {...listeners}
        className="flex flex-1 cursor-grab active:cursor-grabbing"
      >
        <span className="min-w-5 font-bold text-gray-600">{index + 1}.</span>
        <div className="flex-1">
          <SkillCard
            imageURL={tech.iconURL}
            label={tech.name}
            description={tech.description}
          />
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="ml-2"
      >
        <IconTrash size={18} />
      </Button>
    </div>
  );
};

export default EditProjectTechnologies;
