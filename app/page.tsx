import AcademicExperiences from "./components/academic-experiences";
import Footer from "./components/footer";
import Grid from "./components/grid";
import Hero from "./components/hero";
import RecentProjets from "./components/recent-projets";
import { FloatingNav } from "./components/ui/floating-navbar";
import { navItems } from "./data";

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <RecentProjets />
        <AcademicExperiences />
        {/* <WorkExperiences /> */}
        <Footer />
      </div>
    </main>
  );
};

export default Home;
