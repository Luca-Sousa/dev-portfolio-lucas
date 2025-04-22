export const dynamic = "force-dynamic";

import AcademicExperiences from "./components/academic-experiences";
import Footer from "../components/footer";
import Grid from "../components/grid";
import Hero from "../components/hero";
import RecentProjets from "../components/recent-projets";
import { getProjects } from "../data_access/get-projects";

const Home = async () => {
  const projects = await getProjects({
    data: {},
    limit: 4,
  });

  return (
    <>
      <Hero />
      <Grid />
      <RecentProjets projects={projects} />
      <AcademicExperiences />
      <Footer />
    </>
  );
};

export default Home;
