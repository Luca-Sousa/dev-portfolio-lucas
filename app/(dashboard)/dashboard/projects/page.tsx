import Link from "next/link";
import ModalCreateNewTechnology from "../components/create-new-technology-modal";
import { Button } from "@/app/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { db } from "@/app/lib/prisma";
import Image from "next/image";

const DashboardProjectsPage = async () => {
  const technologies = await db.technology.findMany();

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-700 bg-neutral-900 p-2 md:p-10">
        <div className="flex h-20 w-full items-center justify-between gap-2 rounded-lg bg-neutral-800 px-6">
          <span className="text-2xl font-bold">Projetos</span>

          <div className="flex items-center gap-6">
            <Link href="/dashboard/projects/create-new-project">
              <Button className="flex h-8 items-center gap-2 font-medium text-secondary">
                <FilePlus2 size={14} />
                Novo Projeto
              </Button>
            </Link>

            <ModalCreateNewTechnology />
          </div>
        </div>

        <div className="flex flex-1 gap-2">
          <div className="h-full w-full rounded-lg bg-neutral-800">
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className="flex h-20 w-full items-center justify-between gap-2 rounded-lg bg-neutral-800 px-6"
              >
                <span>Nome da Tecnologia: {tech.name}</span>
                <div className="relative size-full">
                  <Image
                    src={tech.iconURL}
                    alt="icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{tech.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProjectsPage;
