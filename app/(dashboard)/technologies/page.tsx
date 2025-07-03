import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/app/components/ui/sidebar";
import { db } from "@/app/lib/prisma";
import CreateNewTechnology from "../personal_projects/components/create-new-technology";
import EditTechnologyButton from "../personal_projects/components/edit-technology.button";
import { Code } from "lucide-react";
import Image from "next/image";

const TechnologiesPage = async () => {
  const technologies = await db.technology.findMany();

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Portfólio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tecnologias</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header com estatísticas */}
        <div className="grid gap-6">
          {/* Título e estatísticas */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                Stack Tecnológico
              </h1>
              <p className="text-muted-foreground">
                Gerencie e organize suas tecnologias por categorias
              </p>
            </div>
            <CreateNewTechnology />
          </div>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{technologies.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Total de Tecnologias
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de tecnologias */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {technologies.map((tech) => (
            <Card
              key={tech.id}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 shadow-lg ring-1 ring-ring/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  {/* Ícone da tecnologia */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm transition-transform group-hover:scale-110">
                    <Image
                      src={tech.iconURL}
                      alt={tech.name}
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {tech.name}
                      </h3>
                      <EditTechnologyButton technology={tech} />
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {tech.description || "Tecnologia para desenvolvimento"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarInset>
  );
};

export default TechnologiesPage;
