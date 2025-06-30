"use client";

import { Button } from "@/app/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";

interface SortableImagesCardProps {
  imageURL: string;
  index: number;
  onRemove: () => void;
}

const SortableImagesCard = ({
  index,
  imageURL,
  onRemove,
}: SortableImagesCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: imageURL,
    });

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
      <div className="flex flex-1 items-center gap-1.5">
        <div
          {...listeners}
          className="flex flex-1 cursor-grab items-center gap-1.5 active:cursor-grabbing"
        >
          <span className="min-w-5 font-bold text-gray-600">{index + 1}.</span>

          <div className="relative aspect-video w-full max-w-xs rounded-sm ring-1 ring-purple">
            <Image
              src={imageURL}
              alt={`Imagem ${index + 1}`}
              fill
              className="rounded-md object-cover"
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
        >
          <IconTrash size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SortableImagesCard;
