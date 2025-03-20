import AcademicExperiences from "../components/academic-experiences";
import Footer from "../components/footer";
import Grid from "../components/grid";
import Hero from "../components/hero";
import RecentProjets from "../components/recent-projets";

const Home = () => {
  return (
    <>
      <Hero />
      <Grid />
      <RecentProjets />
      <AcademicExperiences />
      {/* <WorkExperiences /> */}
      <Footer />
    </>
  );
};

export default Home;
