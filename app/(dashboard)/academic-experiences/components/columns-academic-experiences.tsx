"use client";

import { Button } from "@/app/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { AcademicExperienceWithModules } from "@/app/types/academic-experience";
import EditAcademicExperienceButton from "./edit-academic-experience-button";
import DeleteAcademicExperienceButton from "./delete-academic-experience-button";

export const academicExperienceTableColumns: ColumnDef<AcademicExperienceWithModules>[] =
  [
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
      header: "Formação",
      cell: ({ row: { original: experience } }) => {
        return (
          <div className="group flex max-w-xs items-center gap-3 truncate">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm transition-all duration-200 group-hover:shadow-md dark:from-emerald-900/20 dark:to-green-900/20">
              <Image
                src={experience.imageUrl}
                alt={experience.institution}
                width={24}
                height={24}
                className="rounded-sm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <span className="hidden text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {experience.institution.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {experience.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {experience.institution}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row: { original: experience } }) => {
        const getTypeColor = (type: string) => {
          const typeLower = type.toLowerCase();
          if (
            typeLower.includes("graduação") ||
            typeLower.includes("bacharelado")
          ) {
            return "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400";
          }
          if (
            typeLower.includes("pós") ||
            typeLower.includes("mestrado") ||
            typeLower.includes("doutorado")
          ) {
            return "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 dark:border-purple-800 dark:from-purple-900/20 dark:to-violet-900/20 dark:text-purple-400";
          }
          if (
            typeLower.includes("curso") ||
            typeLower.includes("certificação")
          ) {
            return "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-green-900/20 dark:text-emerald-400";
          }
          return "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 dark:border-orange-800 dark:from-orange-900/20 dark:to-amber-900/20 dark:text-orange-400";
        };

        return (
          <Badge
            className={`group flex w-fit items-center justify-center gap-2 px-3 py-1.5 font-semibold shadow-sm transition-all duration-200 hover:shadow-md ${getTypeColor(experience.type)}`}
          >
            <FileText className="h-3 w-3 transition-transform group-hover:scale-110" />
            {experience.type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dateDuration",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Período
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row: { original: experience } }) => {
        return (
          <p className="max-w-32 text-sm font-semibold text-foreground">
            {experience.dateDuration}
          </p>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row: { original: experience } }) => {
        return (
          <div className="group max-w-xs">
            <div className="rounded-lg border border-muted/30 bg-gradient-to-r from-background to-muted/20 p-3 shadow-sm transition-all duration-200 hover:border-muted/50 hover:shadow-md">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {experience.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "institutionUrl",
      header: "Instituição",
      cell: ({ row: { original: experience } }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group gap-2 text-xs hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-800 dark:hover:bg-blue-900/10 dark:hover:text-blue-400"
          >
            <Link target="_blank" href={experience.institutionUrl}>
              <ExternalLink className="h-3 w-3 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Site</span>
            </Link>
          </Button>
        );
      },
    },
    {
      accessorKey: "certificateUrl",
      header: "Certificado",
      cell: ({ row: { original: experience } }) => {
        if (!experience.certificateUrl) {
          return (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
                <span className="text-xs text-muted-foreground">—</span>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Não disponível
              </span>
            </div>
          );
        }

        return (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group gap-2 text-xs hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-900/10 dark:hover:text-green-400"
          >
            <Link target="_blank" href={experience.certificateUrl}>
              <FileText className="h-3 w-3 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Ver</span>
            </Link>
          </Button>
        );
      },
    },
    {
      accessorKey: "actions",
      id: "actions",
      header: "Ações",
      cell: ({ row: { original: experience } }) => {
        return (
          <div className="flex justify-center gap-2">
            <EditAcademicExperienceButton academicExperience={experience} />
            <DeleteAcademicExperienceButton academicExperience={experience} />
          </div>
        );
      },
    },
  ];
