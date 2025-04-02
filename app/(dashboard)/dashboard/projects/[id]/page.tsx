import { SidebarInset, SidebarTrigger } from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/app/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { db } from "@/app/lib/prisma";
import EditProjectContent from "../components/edit-project-content";

const ProjectDashboardPage = async ({ params }: { params: { id: string } }) => {
  const project = await db.project.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!project) throw new Error("Projeto Não Encontrado!");

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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/projects">
                  Projetos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 p-4 pt-0">
        <Card className="flex w-full flex-col">
          <CardHeader className="flex-row items-center justify-between py-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Dados do Projeto</CardTitle>
              <div className="h-1 w-10 rounded-3xl bg-primary"></div>
            </div>
          </CardHeader>

          <CardContent className="flex h-full flex-col overflow-hidden pb-0">
            <EditProjectContent project={project} />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default ProjectDashboardPage;
