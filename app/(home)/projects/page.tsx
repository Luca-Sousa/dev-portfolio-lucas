import Footer from "@/app/components/footer";
import Hero from "@/app/components/hero";
import RecentProjets from "@/app/components/recent-projets";
import { getProjectsData } from "@/app/data_access/get-projects-data";

const Projects = async () => {
  const projects = await getProjectsData();

  return (
    <>
      <Hero isPages />
      <RecentProjets isPage projects={projects} />
      <Footer isPages />
    </>
  );
};

export default Projects;
