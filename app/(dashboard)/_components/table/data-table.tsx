"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import React from "react";

import { ArrowLeftIcon, ArrowRightIcon, SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import CreateNewTechnology from "../../personal_projects/components/create-new-technology";
import { DataTableViewOptions } from "./data-table-view-options";
import AddProjectButton from "../../personal_projects/components/add-project-button";
import "./css/data-table.styles.css";
import { IconFileLambda } from "@tabler/icons-react";
import { PageNameEnum } from "@/app/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageName: PageNameEnum;
  actionButtons?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageName,
  actionButtons,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-8 overflow-hidden">
      {/* Header sofisticado com gradiente sutil */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IconFileLambda className="h-5 w-5" />
              </div>
              <div>
                <h2 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold tracking-tight">
                  Gerenciar{" "}
                  {pageName === PageNameEnum.PERSONAL_PROJECTS
                    ? "Projetos"
                    : pageName === PageNameEnum.ACADEMIC_EXPERIENCES
                      ? "Experiências Acadêmicas"
                      : "Tecnologias"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Organize, visualize e gerencie todos os seus{" "}
                  {pageName === PageNameEnum.PERSONAL_PROJECTS
                    ? "projetos"
                    : pageName === PageNameEnum.ACADEMIC_EXPERIENCES
                      ? "experiências acadêmicas"
                      : "tecnologias"}{" "}
                  em um só lugar
                </p>
              </div>
            </div>
          </div>

          {/* Estatísticas em cards menores */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg border bg-card/50 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Total de{" "}
                  {pageName === PageNameEnum.PERSONAL_PROJECTS
                    ? "Projetos"
                    : pageName === PageNameEnum.ACADEMIC_EXPERIENCES
                      ? "Experiências Acadêmicas"
                      : "Tecnologias"}
                </span>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {data.length}
                </Badge>
              </div>
            </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <div className="rounded-lg border bg-card/50 px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Selecionados
                  </span>
                  <Badge variant="default" className="text-xs font-semibold">
                    {table.getFilteredSelectedRowModel().rows.length}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controles de filtro e ações */}
      <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
        <CardHeader className="bg-muted/30 px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="group relative max-w-md flex-1">
              {/* Ícone de busca animado */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                <SearchIcon className="search-icon h-4 w-4 text-muted-foreground transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-primary" />
              </div>

              {/* Input personalizado */}
              <Input
                placeholder={`Buscar ${pageName === PageNameEnum.PERSONAL_PROJECTS ? "projetos" : pageName === PageNameEnum.ACADEMIC_EXPERIENCES ? "experiências acadêmicas" : "tecnologias"}...`}
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="search-input h-11 w-full rounded-xl border-2 border-muted/40 pl-11 pr-12 text-sm font-medium backdrop-blur-sm transition-all duration-300 placeholder:font-normal placeholder:text-muted-foreground hover:border-muted/60 hover:shadow-sm focus:border-primary/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10 focus:ring-0 focus:ring-offset-0"
              />

              {/* Indicador de filtro ativo */}
              {(table.getColumn("title")?.getFilterValue() as string) && (
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                  <div className="result-counter flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    <div className="pulse-indicator h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{table.getFilteredRowModel().rows.length}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.getColumn("title")?.setFilterValue("")}
                    className="group/clear h-7 w-7 rounded-lg p-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <XIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/clear:rotate-90" />
                  </Button>
                </div>
              )}
            </div>

            {/* Ações com melhor espaçamento */}
            <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
              {actionButtons ? (
                actionButtons
              ) : (
                <>
                  <CreateNewTechnology />
                  <AddProjectButton />
                </>
              )}
              <DataTableViewOptions table={table} />
            </div>
          </div>
        </CardHeader>

        {/* Tabela Responsiva */}
        <CardContent className="p-0">
          <div className="data-table-container">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b bg-muted/50 hover:bg-muted/50"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap px-4 font-semibold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`data-table-row group transition-all duration-300 hover:bg-muted/50 hover:shadow-sm ${index % 2 === 0 ? "bg-background" : "bg-muted/20"} ${row.getIsSelected() ? "border-l-4 border-l-primary bg-primary/5 shadow-sm" : ""} duration-300 animate-in fade-in`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="data-table-cell px-4 py-4 transition-colors group-hover:text-foreground"
                        >
                          <div
                            className="duration-300 animate-in slide-in-from-left-2"
                            style={{ animationDelay: `${index * 25}ms` }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="duration-500 animate-in fade-in">
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-3">
                          <SearchIcon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Nenhum{" "}
                            {pageName === PageNameEnum.PERSONAL_PROJECTS
                              ? "projeto"
                              : pageName === PageNameEnum.ACADEMIC_EXPERIENCES
                                ? "experiência acadêmica"
                                : "tecnologia"}{" "}
                            encontrado
                          </p>
                          <p className="text-xs">
                            Tente ajustar os filtros ou crie um novo{" "}
                            {pageName === PageNameEnum.PERSONAL_PROJECTS
                              ? "projeto"
                              : pageName === PageNameEnum.ACADEMIC_EXPERIENCES
                                ? "experiência acadêmica"
                                : "tecnologia"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer com paginação premium */}
      <div className="rounded-xl border bg-gradient-to-r from-background to-muted/20 px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Estatísticas detalhadas */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Exibindo{" "}
                <span className="font-bold text-foreground">
                  {table.getRowModel().rows.length}
                </span>{" "}
                de{" "}
                <span className="font-bold text-foreground">
                  {table.getFilteredRowModel().rows.length}
                </span>{" "}
                resultado(s)
              </p>
            </div>

            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-50 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                {table.getFilteredSelectedRowModel().rows.length} selecionado(s)
              </Badge>
            )}

            {(table.getColumn("title")?.getFilterValue() as string) && (
              <Badge variant="outline" className="text-xs font-semibold">
                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                Filtro ativo
              </Badge>
            )}
          </div>

          {/* Controles de navegação aprimorados */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-muted-foreground">Página</span>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 font-bold text-primary"
              >
                {table.getState().pagination.pageIndex + 1}
              </Badge>
              <span className="text-muted-foreground">de</span>
              <Badge variant="outline" className="font-bold">
                {table.getPageCount()}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="group h-9 gap-2 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="group h-9 gap-2 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
