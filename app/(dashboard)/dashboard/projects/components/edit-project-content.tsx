"use client";

import EditProjectTitle from "./edit-project-title";
import EditProjectDescription from "./edit-project-description";
import EditProjectStatus from "./edit-project-status";
import EditProjectStartDate from "./edit-project-startDate";
import EditProjectRepository from "./edit-project-repository";
import EditProjectDeploy from "./edit-project-deploy";
import EditProjectFigma from "./edit-project-figma";
import EditProjectTechnologies from "./edit-project-technologies";
import { Project } from "@/app/types";
import { Technology } from "@prisma/client";
import EditProjectImageThumbnail from "./edit-project-Image-Thumbnail";
import EditProjectImageCertificate from "./edit-project-Image-Certificate";

interface EditProjectContentProps {
  project: Project;
  technologies: Technology[];
}

const EditProjectContent = ({
  project,
  technologies,
}: EditProjectContentProps) => {
  return (
    <div className="grid w-full grid-cols-3 gap-4 py-3">
      {/* Primeira Coluna */}
      <div className="flex flex-col gap-4">
        <EditProjectTitle id={project.id} title={project.title} />
        <EditProjectDescription
          id={project.id}
          description={project.description}
        />
        <EditProjectImageThumbnail
          id={project.id}
          thumbnailUrl={project.thumbnailUrl}
        />
      </div>

      {/* Segunda Coluna */}
      <div className="flex flex-col gap-4">
        <EditProjectStatus id={project.id} status={project.status} />
        <EditProjectStartDate id={project.id} startDate={project.startDate} />
        <EditProjectTechnologies
          id={project.id}
          technologies={project.technologies}
          allTechnologies={technologies}
        />
      </div>

      {/* Terceira Coluna */}
      <div className="flex flex-col gap-4">
        <EditProjectRepository
          id={project.id}
          repositoryUrl={project.repositoryUrl}
        />
        <EditProjectDeploy id={project.id} deployUrl={project.deployUrl} />
        <EditProjectFigma id={project.id} figmaUrl={project.figmaUrl} />
        <EditProjectImageCertificate
          id={project.id}
          certificateUrl={project.certificateUrl}
        />
      </div>
    </div>
  );
};

export default EditProjectContent;
