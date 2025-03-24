"use client";

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ClipboardCopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useState } from "react";
import { Project } from "@/app/types/index";
import {
  FaArrowRotateRight,
  FaFileCode,
  FaGithub,
  FaRocket,
  FaStar,
} from "react-icons/fa6";
import DeleteProjectDialogContent from "./components/delete-dialog-content";

export const projectsTableColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="data-[state=checked]:text-black"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="data-[state=checked]:text-black"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "thumbnailUrl",
    header: "",
    cell: ({ row: { original: project } }) => {
      return (
        <div className="relative size-12 overflow-hidden rounded-md">
          <Image
            alt="Imagem do projeto"
            src={project.thumbnailUrl}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Projeto",
    cell: ({ row: { original: project } }) => {
      return (
        <div className="line-clamp-1 max-w-40 truncate text-sm">
          {project.title}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row: { original: project } }) => {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: project.description }}
          className="prose-sm prose-headings:text-xs prose-headings:!font-normal prose-a:pointer-events-none line-clamp-1 max-w-56 truncate text-sm"
        />
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Data de Início",
    cell: ({ row: { original: project } }) =>
      new Date(project.startDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
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
            <Badge className="flex w-fit items-center justify-center gap-1 bg-green-500 font-bold text-secondary hover:bg-green-400">
              <FaStar />
              Finalizado
            </Badge>
          )}
          {project.status === "IN_UPDATE" && (
            <Badge className="flex w-fit items-center justify-center gap-1 bg-slate-500 font-bold text-secondary hover:bg-gray-400">
              <FaArrowRotateRight />
              Atualização
            </Badge>
          )}
          {project.status === "IN_PROGRESS" && (
            <Badge className="flex w-fit items-center justify-center gap-1 bg-yellow-500 font-bold text-secondary hover:bg-yellow-400">
              <FaFileCode />
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
        <div className="flex items-center gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {project.technologies.map((tech) => (
            <Image
              key={tech.id}
              alt={tech.name}
              src={tech.iconURL}
              width={18}
              height={18}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "deployUrl",
    header: "Deploy",
    cell: ({ row: { original: project } }) => {
      return (
        <Button variant={"ghost"} asChild>
          <Link target="_blank" href={project.deployUrl}>
            <FaRocket className="size-5" />
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "repositoryUrl",
    header: "Repositório",
    cell: ({ row: { original: project } }) => {
      return (
        <Button variant={"ghost"} asChild>
          <Link target="_blank" href={project.repositoryUrl}>
            <FaGithub className="size-5" />
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

      const copyID = () => {
        navigator.clipboard.writeText(project.id);
        toast.success("ID do projeto, copiado com sucesso!");
      };

      return (
        <AlertDialog>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontalIcon size={16} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-center">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="space-y-1">
                  <DropdownMenuItem
                    onClick={copyID}
                    className="cursor-pointer gap-1.5"
                  >
                    <ClipboardCopyIcon size={14} />
                    Copiar ID
                  </DropdownMenuItem>

                  <DialogTrigger asChild>
                    <DropdownMenuItem className="cursor-pointer gap-1.5">
                      <EditIcon size={14} />
                      Editar
                    </DropdownMenuItem>
                  </DialogTrigger>
                </div>

                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="cursor-pointer gap-1.5 bg-destructive/60 focus:bg-destructive/45">
                    <Trash2Icon size={14} />
                    Deletar
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DeleteProjectDialogContent
              productId={project.id}
              //   thumbnailUrl={project.thumbnailUrl}
              //   imagesUrl={project.imagesUrl}
              //   certificateUrl={project.certificateUrl}
            />
          </Dialog>
        </AlertDialog>
      );
    },
  },
];
