"use client";

import Image from "next/image";
import EditTechnologyButton from "../(dashboard)/dashboard/components/edit-technology.button";
import { useEffect, useState } from "react";
import { Technology } from "@prisma/client";
import { getTechnology } from "../data_access/get-technology";
import { cn } from "../lib/utils";

interface SkillCardProps {
  id?: string;
  imageURL: string;
  label: string;
  description: string;
  isEditing?: boolean;
  className?: string;
}

const SkillCard = ({
  id,
  imageURL,
  label,
  description,
  isEditing,
  className,
}: SkillCardProps) => {
  const [technology, setTechnology] = useState<Technology>();

  useEffect(() => {
    const fetchTechnology = async () => {
      if (id) {
        try {
          const technology = await getTechnology({ id });
          setTechnology(technology || undefined);
        } catch (error) {
          console.error("Failed to fetch technology:", error);
        }
      }
    };

    fetchTechnology();
  }, [id]);

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-2xl bg-black-100 p-3 ring-2 ring-inset ring-purple/30 transition-colors hover:z-50 hover:bg-purple/10",
        className,
      )}
    >
      <figure className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-purple/20 transition-colors group-hover:bg-purple/40">
        <Image src={imageURL} width={32} height={32} alt={label} />
      </figure>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-white">{label}</h3>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>

      {isEditing && technology && (
        <EditTechnologyButton technology={technology} />
      )}
    </div>
  );
};

export default SkillCard;
