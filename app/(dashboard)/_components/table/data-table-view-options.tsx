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
import {
  EyeIcon,
  ColumnsIcon,
  CheckIcon,
  MinusIcon,
  BarChart3Icon,
} from "lucide-react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const visibleColumns = table
    .getAllColumns()
    .filter((column) => column.getIsVisible() && column.getCanHide()).length;
  const totalColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide()).length;

  const visibilityPercentage = Math.round(
    (visibleColumns / totalColumns) * 100,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="group relative gap-2 border-dashed px-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-solid hover:bg-accent/50 hover:shadow-md"
        >
          <div className="relative">
            <ColumnsIcon className="h-4 w-4 transition-transform group-hover:rotate-12" />
            {visibilityPercentage < 100 && (
              <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            )}
          </div>
          <span className="font-medium">Colunas</span>
          <div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {visibleColumns}/{totalColumns}
            </span>
            <div className="ml-1 h-1 w-8 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-500"
                style={{ width: `${visibilityPercentage}%` }}
              />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 border bg-background/95 p-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2"
      >
        <DropdownMenuLabel className="flex items-center gap-3 rounded-lg border-l-4 border-primary/50 bg-gradient-to-r from-primary/10 to-transparent px-2 py-3 text-sm font-semibold">
          <div className="relative">
            <EyeIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-normal text-muted-foreground">
              Customize a visualização da tabela
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-3" />

        {/* Header de estatísticas */}
        <div className="mb-3 flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
          <div className="flex items-center gap-2">
            <BarChart3Icon className="h-4 w-4 text-primary/70" />
            <span className="text-sm font-medium">Visibilidade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {visibilityPercentage}% visível
            </span>
            <div className="flex items-center gap-1">
              {visibleColumns === totalColumns ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <MinusIcon className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
        </div>

        <div className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent max-h-[300px] space-y-1 overflow-y-auto">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => {
              const columnLabels: Record<
                string,
                { label: string; color?: string }
              > = {
                thumbnailUrl: { label: "Thumbnail", color: "text-blue-500" },
                title: { label: "Projeto", color: "text-green-500" },
                description: { label: "Descrição", color: "text-purple-500" },
                startDate: {
                  label: "Data de Início",
                  color: "text-orange-500",
                },
                status: { label: "Status", color: "text-cyan-500" },
                technologies: {
                  label: "Tecnologias",
                  color: "text-yellow-500",
                },
                certificateUrl: {
                  label: "Certificado",
                  color: "text-amber-500",
                },
                deployUrl: { label: "Deploy", color: "text-red-500" },
                repositoryUrl: { label: "Repositório", color: "text-gray-500" },
                actions: { label: "Ações", color: "text-slate-500" },
              };

              const columnInfo = columnLabels[column.id] || {
                label: column.id,
                color: "text-muted-foreground",
              };
              const isVisible = column.getIsVisible();

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={isVisible}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm transition-all duration-200 ${
                    isVisible
                      ? "border-primary/20 bg-primary/5 shadow-sm hover:bg-primary/10"
                      : "hover:border-muted hover:bg-muted/50"
                  } `}
                >
                  <div className="min-w-0 flex-1">
                    <span
                      className={`pl-6 font-medium transition-colors ${isVisible ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {columnInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isVisible ? (
                      <div className="flex items-center gap-1">
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs font-medium text-green-600">
                          Visível
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Oculta
                      </span>
                    )}
                  </div>
                </DropdownMenuCheckboxItem>
              );
            })}
        </div>

        <DropdownMenuSeparator className="my-3" />

        {/* Footer com estatísticas detalhadas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-muted/40 to-muted/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4 text-primary/70" />
              <span className="text-sm font-medium">Resumo</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {visibleColumns} de {totalColumns} colunas
              </div>
              <div className="text-xs text-muted-foreground">
                {totalColumns - visibleColumns} ocultas
              </div>
            </div>
          </div>

          {visibleColumns < totalColumns && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:border-amber-800 dark:bg-amber-900/20">
              💡 Algumas colunas estão ocultas. Ative-as para ver mais detalhes.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
