"use client";

import { Project } from "@prisma/client";
import EditProjectTitle from "./edit-project-title";
import EditProjectDescription from "./edit-project-description";
import EditProjectStatus from "./edit-project-status";

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
        <EditProjectStatus id={project.id} status={project.status} />
      </div>
    </>
  );
};

export default EditProjectContent;
