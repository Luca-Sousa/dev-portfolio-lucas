import Footer from "@/app/components/footer";
import Hero from "@/app/components/hero";
import RecentProjets from "@/app/components/recent-projets";

const Projects = () => {
  return (
    <>
      <Hero isPages />
      <RecentProjets isPage />
      <Footer isPages />
    </>
  );
};

export default Projects;
