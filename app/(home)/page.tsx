import AcademicExperiences from "../components/academic-experiences";
import Footer from "../components/footer";
import Grid from "../components/grid";
import Hero from "../components/hero";
import RecentProjets from "../components/recent-projets";
import { getProjectsData } from "../data_access/get-projects-data";

const Home = async () => {
  const projects = await getProjectsData({}, 4);

  return (
    <>
      <Hero />
      <Grid />
      <RecentProjets projects={projects} />
      <AcademicExperiences />
      {/* <WorkExperiences /> */}
      <Footer />
    </>
  );
};

export default Home;
