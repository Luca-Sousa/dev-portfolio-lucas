import {
  IconCircleCheck,
  IconProgressCheck,
  IconProgressX,
} from "@tabler/icons-react";

const StatusInfoAcademicExperiences = ({
  status,
  size,
  icon,
}: {
  status: string;
  size: number;
  icon?: boolean;
}) => {
  return (
    <>
      {status === "completed" && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
          <IconCircleCheck
            title="Módulo Concluído"
            size={size}
            className="stroke-emerald-500"
          />
          {!icon && "Módulo Concluído"}
        </span>
      )}
      {status === "in-progress" && (
        <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
          <IconProgressCheck
            title="Módulo em Andamento"
            size={size}
            className="stroke-amber-500"
          />
          {!icon && "Módulo em Andamento"}
        </span>
      )}
      {status === "not-started" && (
        <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
          <IconProgressX
            title="Módulo Não Iniciado"
            size={size}
            className="stroke-orange-500"
          />
          {!icon && "Módulo não Iniciado"}
        </span>
      )}
    </>
  );
};

export default StatusInfoAcademicExperiences;
