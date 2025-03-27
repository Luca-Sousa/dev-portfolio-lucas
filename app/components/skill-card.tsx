"use client";

import Image from "next/image";

interface SkillCardProps {
  imageURL: string;
  label: string;
  description: string;
}

const SkillCard = ({ imageURL, label, description }: SkillCardProps) => {
  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-black-100 p-3 ring-2 ring-inset ring-purple/30 transition-colors hover:z-50 hover:bg-purple/10">
      <figure className="size-12 overflow-hidden rounded-lg bg-purple/20 p-2 transition-colors group-hover:bg-purple/30">
        <Image src={imageURL} width={32} height={32} alt={label} />
      </figure>

      <div>
        <h3 className="text-lg font-bold text-white">{label}</h3>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
    </div>
  );
};

export default SkillCard;
