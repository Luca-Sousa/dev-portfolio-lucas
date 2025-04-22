import { academic_experiences } from "../../data";
import SingleCardAcademicExperiences from "./single-card-academic-experiences";

const AcademicExperiences = () => {
  return (
    <section id="academic-experiencies" className="space-y-20 py-20">
      <h1 className="heading">
        Minhas <span className="text-purple">Experiências Acadêmicas</span>
      </h1>

      <div className="grid items-center gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {academic_experiences.map((experience, index) => (
          <SingleCardAcademicExperiences key={index} experience={experience} />
        ))}
      </div>
    </section>
  );
};

export default AcademicExperiences;
