import { ProjectStatus, Technology } from "@prisma/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  certificateUrl: string | null;
  certificateDesc: string | null;
  thumbnailUrl: string;
  imagesUrl: string[];
  repositoryUrl: string;
  deployUrl: string | null;
  figmaUrl: string | null;
  status: ProjectStatus;
  technologies: Technology[];
}
