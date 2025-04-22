import {
  IconCircleCheck,
  IconProgressCheck,
  IconProgressX,
} from "@tabler/icons-react";
import { tv } from "tailwind-variants";

const statusVariant = tv({
  base: "flex items-center gap-1 text-xs font-medium",
  variants: {
    status: {
      completed: "text-emerald-500",
      "in-progress": "text-amber-500",
      "not-started": "text-orange-500",
    },
  },
});

const iconStrokeColor = {
  completed: "stroke-emerald-500",
  "in-progress": "stroke-amber-500",
  "not-started": "stroke-orange-500",
} as const;

const iconMap = {
  completed: IconCircleCheck,
  "in-progress": IconProgressCheck,
  "not-started": IconProgressX,
};

const statusLabel = {
  completed: "Módulo Concluído",
  "in-progress": "Módulo em Andamento",
  "not-started": "Módulo não Iniciado",
};

type StatusType = keyof typeof iconMap;

const StatusInfoAcademicExperiences = ({
  status,
  size,
  icon,
}: {
  status: StatusType;
  size: number;
  icon?: boolean;
}) => {
  const IconComponent = iconMap[status];

  return (
    <span className={statusVariant({ status })}>
      <IconComponent
        title={statusLabel[status]}
        size={size}
        className={iconStrokeColor[status]}
      />
      {!icon && statusLabel[status]}
    </span>
  );
};

export default StatusInfoAcademicExperiences;
