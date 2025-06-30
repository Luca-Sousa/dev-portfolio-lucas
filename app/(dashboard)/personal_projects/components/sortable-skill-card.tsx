"use client";

import SkillCard from "@/app/components/skill-card";
import { Button } from "@/app/components/ui/button";
import { Technology } from "@prisma/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash } from "@tabler/icons-react";

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
        className="flex flex-1 cursor-grab items-center gap-1.5 active:cursor-grabbing"
      >
        <span className="min-w-5 font-bold text-gray-600">{index + 1}.</span>

        <SkillCard
          imageURL={tech.iconURL}
          label={tech.name}
          description={tech.description}
          className="flex-1"
        />
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
      >
        <IconTrash size={18} />
      </Button>
    </div>
  );
};

export default SortableSkillCard;
