import { ProjectStatus, Technology } from "@prisma/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  certificateUrl: string;
  certificateDesc: string;
  thumbnailUrl: string;
  imagesUrl: string[];
  repositoryUrl: string;
  deployUrl: string;
  status: ProjectStatus;
  technologies: Technology[];
}
