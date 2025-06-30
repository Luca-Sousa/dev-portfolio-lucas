import MagicLink from "@/app/components/magic-link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/app/components/ui/sidebar";
import { PlusCircleIcon } from "lucide-react";

const AcademicExperienciePage = async () => {
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

      <div className="flex flex-1 p-4 pt-0">
        <Card className="flex w-full flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                Experiências Acadêmicas
              </CardTitle>
              <div className="h-1 w-10 rounded-3xl bg-primary"></div>
            </div>

            <MagicLink
              icon={<PlusCircleIcon />}
              href="/academic-experiences/form-new-formation"
              position="left"
              title="Nova Formação"
            />
          </CardHeader>

          <CardContent className="flex h-full flex-col overflow-hidden pb-0 pt-4">
            {/* <DataTable columns={academicTableColumns} data={projectsData} /> */}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default AcademicExperienciePage;
