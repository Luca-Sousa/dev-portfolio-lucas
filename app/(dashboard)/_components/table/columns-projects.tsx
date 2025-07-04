"use client";

import { Button } from "@/app/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/app/types/index";
import {
  FaArrowRotateRight,
  FaFileCode,
  FaGithub,
  FaRocket,
  FaStar,
} from "react-icons/fa6";
import EditProjectButton from "../../personal_projects/components/edit-project-button";

export const projectsTableColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "#",
    id: "index",
    cell: ({ row }) => (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-sm font-bold text-primary shadow-sm">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Projeto",
    cell: ({ row: { original: project } }) => {
      return (
        <div className="group flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </p>
            <p className="text-xs text-muted-foreground">Projeto</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row: { original: project } }) => {
      return (
        <div className="group max-w-xs lg:max-w-sm">
          <div className="rounded-lg border border-muted/30 bg-gradient-to-r from-background to-muted/20 p-3 shadow-sm transition-all duration-200 hover:border-muted/50 hover:shadow-md">
            <div
              dangerouslySetInnerHTML={{ __html: project.description }}
              className="prose-sm prose-headings:text-xs prose-headings:!font-normal prose-a:pointer-events-none line-clamp-2 text-sm text-muted-foreground"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Data de Início",
    cell: ({ row: { original: project } }) => {
      const date = new Date(project.startDate);
      const formattedDate = date.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      const dayMonth = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      });

      return (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-red-50 shadow-sm dark:from-orange-900/20 dark:to-red-900/20">
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {dayMonth.split(" ")[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {formattedDate}
            </p>
            <p className="text-xs text-muted-foreground">Início do projeto</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row: { original: project } }) => {
      return (
        <div>
          {project.status === "IN_PRODUCTION" && (
            <Badge className="group flex w-fit items-center justify-center gap-2 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 font-semibold text-green-700 shadow-sm transition-all duration-200 hover:from-green-100 hover:to-emerald-100 hover:shadow-md dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30">
              <FaStar className="h-3 w-3 transition-transform group-hover:scale-110" />
              Finalizado
            </Badge>
          )}
          {project.status === "IN_UPDATE" && (
            <Badge className="group flex w-fit items-center justify-center gap-2 border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:from-blue-100 hover:to-cyan-100 hover:shadow-md dark:border-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20 dark:text-blue-400 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30">
              <FaArrowRotateRight className="h-3 w-3 animate-spin transition-transform group-hover:scale-110" />
              Atualização
            </Badge>
          )}
          {project.status === "IN_PROGRESS" && (
            <Badge className="group flex w-fit items-center justify-center gap-2 border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 font-semibold text-amber-700 shadow-sm transition-all duration-200 hover:from-amber-100 hover:to-yellow-100 hover:shadow-md dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-400 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30">
              <FaFileCode className="h-3 w-3 transition-transform group-hover:scale-110" />
              Desenvolvimento
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "technologies",
    header: "Tecnologias",
    cell: ({ row: { original: project } }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 overflow-hidden rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 p-2 shadow-sm">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <div
                key={tech.id}
                className="relative flex h-8 w-8 items-center justify-center rounded-md bg-background shadow-sm transition-transform hover:scale-110"
                style={{ zIndex: project.technologies.length - index }}
                title={tech.name}
              >
                <Image
                  alt={tech.name}
                  src={tech.iconURL}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
              </div>
            ))}
            {project.technologies.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                +{project.technologies.length - 3}
              </div>
            )}
          </div>
          {project.technologies.length > 0 && (
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-muted-foreground">
                {project.technologies.length}{" "}
                {project.technologies.length === 1
                  ? "tecnologia"
                  : "tecnologias"}
              </p>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "deployUrl",
    header: "Deploy",
    cell: ({ row: { original: project } }) => {
      if (!project.deployUrl) {
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
              <span className="text-xs text-muted-foreground">—</span>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Indisponível
            </span>
          </div>
        );
      }

      return (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="group h-8 gap-2 text-xs hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-900/10 dark:hover:text-green-400"
        >
          <Link target="_blank" href={project.deployUrl}>
            <FaRocket className="h-3 w-3 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">Deploy</span>
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "repositoryUrl",
    header: "Repositório",
    cell: ({ row: { original: project } }) => {
      if (!project.repositoryUrl) {
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
              <span className="text-xs text-muted-foreground">—</span>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Privado
            </span>
          </div>
        );
      }

      return (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="group h-8 gap-2 text-xs hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-800 dark:hover:bg-blue-900/10 dark:hover:text-blue-300"
        >
          <Link target="_blank" href={project.repositoryUrl}>
            <FaGithub className="h-3 w-3 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: "Ações",
    cell: ({ row: { original: project } }) => {
      return (
        <div className="flex justify-center">
          <EditProjectButton project={project} />
        </div>
      );
    },
  },
];
