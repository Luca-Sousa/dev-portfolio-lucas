import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
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
import { redirect } from "next/navigation";
import { projectsTableColumns } from "../_components/table/columns-projects";
import { getProjects } from "@/app/data_access/get-projects";
import { DataTable } from "../_components/table/data-table";
import { PageNameEnum } from "@/app/lib/utils";
import CreateNewTechnology from "./components/create-new-technology";
import AddProjectButton from "./components/add-project-button";

const Projects = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const projects = await getProjects({
    data: {},
  });

  const projectsData = projects.map((project) => ({
    ...project,
    certificateUrl: project.certificateUrl as string,
    certificateDesc: project.certificateDesc as string,
    deployUrl: project.deployUrl as string,
    figmaUrl: project.figmaUrl as string,
    thumbnailUrl: project.thumbnailUrl as string,
  }));

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
                <BreadcrumbPage>Projetos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 p-6">
        <DataTable
          columns={projectsTableColumns}
          data={projectsData}
          pageName={PageNameEnum.PERSONAL_PROJECTS}
          actionButtons={
            <>
              <CreateNewTechnology />
              <AddProjectButton />
            </>
          }
        />
      </div>
    </SidebarInset>
  );
};

export default Projects;
