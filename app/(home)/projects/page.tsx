import Footer from "@/app/components/footer";
import Hero from "@/app/components/hero";
import RecentProjets from "@/app/components/recent-projets";
import { getProjects } from "@/app/data_access/get-projects";

const Projects = async () => {
  const projects = await getProjects({});

  return (
    <>
      <Hero isPages />
      <RecentProjets isPage projects={projects} />
      <Footer isPages />
    </>
  );
};

export default Projects;
