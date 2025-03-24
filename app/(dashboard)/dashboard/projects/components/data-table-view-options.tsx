"use client";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { FaTableColumns } from "react-icons/fa6";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto flex gap-2">
          <FaTableColumns />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id.valueOf() === "thumbnailUrl" && "Thumbnail"}
                {column.id.valueOf() === "title" && "Projeto"}
                {column.id.valueOf() === "description" && "Descrição"}
                {column.id.valueOf() === "startDate" && "Data de Início"}
                {column.id.valueOf() === "status" && "Status"}
                {column.id.valueOf() === "technologies" && "Tecnologias"}
                {column.id.valueOf() === "certificateUrl" && "Certificado"}
                {column.id.valueOf() === "deployUrl" && "Deploy"}
                {column.id.valueOf() === "repositoryUrl" && "Repositório"}
                {column.id.valueOf() === "actions" && "Ações"}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
