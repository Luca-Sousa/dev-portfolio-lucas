import { ProjectStatus } from "@prisma/client";
import { Badge } from "./ui/badge";
import { FaFileCode, FaStar, FaArrowRotateRight } from "react-icons/fa6";

interface BadgeStatusProps {
  status: ProjectStatus;
}

const BadgeStatus = ({ status }: BadgeStatusProps) => {
  return (
    <Badge className="w-fit shrink-0 space-x-1.5 bg-black-200 px-1.5 py-1 text-xs font-semibold ring-2 ring-purple/40 hover:bg-black-300 hover:ring-purple/60">
      {status === ProjectStatus.IN_PROGRESS && (
        <div className="flex animate-bounce items-center justify-center">
          <FaFileCode className="text-purple" />
        </div>
      )}

      {status === ProjectStatus.IN_PRODUCTION && (
        <div className="flex animate-pulse items-center justify-center">
          <FaStar className="text-purple" />
        </div>
      )}

      {status === ProjectStatus.IN_UPDATE && (
        <div className="flex animate-spin items-center justify-center">
          <FaArrowRotateRight className="text-purple" />
        </div>
      )}

      {status === "IN_PRODUCTION" && <span>Finalizado</span>}
      {status === "IN_UPDATE" && <span>Atualização</span>}
      {status === "IN_PROGRESS" && <span>Desenvolvimento</span>}
    </Badge>
  );
};

export default BadgeStatus;
