"use client";

import { Project } from "@prisma/client";
import EditProjectTitle from "./edit-project-title";
import EditProjectDescription from "./edit-project-description";

interface EditProjectContentProps {
  project: Project;
}

const EditProjectContent = ({ project }: EditProjectContentProps) => {
  return (
    <>
      <div className="max-w-2xl space-y-5 py-3">
        <EditProjectTitle id={project.id} title={project.title} />
        <EditProjectDescription
          id={project.id}
          description={project.description}
        />
      </div>
    </>
  );
};

export default EditProjectContent;
