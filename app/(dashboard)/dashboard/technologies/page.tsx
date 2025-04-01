import SkillCard from "@/app/components/skill-card";
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
import { db } from "@/app/lib/prisma";
import CreateNewTechnology from "../components/create-new-technology";

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
                <BreadcrumbPage>Technologias</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 p-4 pt-0">
        <Card className="flex w-full flex-col">
          <CardHeader className="flex-row items-center justify-between py-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Tecnologias</CardTitle>
              <div className="h-1 w-10 rounded-3xl bg-primary"></div>
            </div>

            <CreateNewTechnology />
          </CardHeader>

          <CardContent className="flex h-full flex-col overflow-hidden pb-0 pt-4">
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-3">
              {technologies.map((tech) => (
                <SkillCard
                  id={tech.id}
                  key={tech.id}
                  imageURL={tech.iconURL}
                  label={tech.name}
                  description={tech.description}
                  isEditing
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default TechnologiesPage;
