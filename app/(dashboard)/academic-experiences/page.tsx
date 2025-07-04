import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Separator } from "@/app/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/app/components/ui/sidebar";
import { DataTable } from "../_components/table/data-table";
import { PageNameEnum } from "@/app/lib/utils";
import { academicExperienceTableColumns } from "./components/columns-academic-experiences";
import { getAcademicExperiences } from "@/app/data_access/get-academic-experiences";
import AddAcademicExperienceButton from "./components/add-academic-experience-button";

const AcademicExperienciePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const academicExperiences = await getAcademicExperiences();

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
                <BreadcrumbPage>Experiências Acadêmicas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 p-6">
        <DataTable
          columns={academicExperienceTableColumns}
          data={academicExperiences}
          pageName={PageNameEnum.ACADEMIC_EXPERIENCES}
          actionButtons={<AddAcademicExperienceButton />}
        />
      </div>
    </SidebarInset>
  );
};

export default AcademicExperienciePage;
