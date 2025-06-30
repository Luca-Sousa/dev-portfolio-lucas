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
import FormNewFormationContent from "./components/FormNewFormationContent";

const FormNewFormation = async () => {
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
                <BreadcrumbLink href="/dashboard/academic-experiences">
                  Formações
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Nova Formação</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <Card className="m-4 mt-0 space-y-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            Formulário de Nova Formação
          </CardTitle>
          <div className="h-1 w-10 rounded-3xl bg-primary"></div>
        </CardHeader>

        <CardContent className="flex w-full items-center justify-center">
          <FormNewFormationContent />
        </CardContent>
      </Card>
    </SidebarInset>
  );
};

export default FormNewFormation;
