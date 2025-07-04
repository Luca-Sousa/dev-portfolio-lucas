import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileOrUrl = z.array(
  z.union([
    z.instanceof(File, { message: "Entrada não instância de arquivo" }),
    z.string().url({ message: "URL inválido" }),
  ]),
);

export enum PageNameEnum {
  PERSONAL_PROJECTS = "Projetos",
  ACADEMIC_EXPERIENCES = "Experiências Acadêmicas",
  TECHNOLOGIES = "Tecnologias",
}
