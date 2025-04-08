import { IoHome } from "react-icons/io5";
import { GoProjectSymlink } from "react-icons/go";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { MdContacts } from "react-icons/md";
import { FolderKanbanIcon, LayoutDashboardIcon } from "lucide-react";
import { GrTechnology } from "react-icons/gr";
import { ProjectStatus } from "@prisma/client";

export const navItemsHome = [
  { name: "Sobre", link: "/#about", icon: <IoHome size={16} /> },
  {
    name: "Projetos",
    link: "/#projects",
    icon: <GoProjectSymlink size={16} />,
  },
  {
    name: "Exp. Acadêmicas",
    link: "/#academic-experiencies",
    icon: <HiMiniAcademicCap size={16} />,
  },
  { name: "Contato", link: "/#contact", icon: <MdContacts size={16} /> },
];

export const gridItems = [
  {
    id: 1,
    title:
      "Sou um Desenvolvedor web com a missão de criar experiências digitais agradáveis e intuitivas",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "Atualmente sou graduando de Ciência da Computação",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "Minhas Tech Stacks",
    description: "Sempre buscando aperfeiçoamento",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title:
      "Estou sempre me desafiando com novos projetos e buscando feedback na comunidade de programação",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title:
      "Atualmente estou investindo em uma formação Full Stack online, o Full Stack Club, com o Professor expetacular Felipe Rocha",
    description: "Formação Online",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Você quer entrar em contato comigo?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const academic_experiences = [
  {
    title: "Bacharelado em Ciência da Computação",
    type: "Graduação",
    institution: "IFCE-Tianguá",
    date_duration: "Agosto de 2022 - ATUAL",
    description:
      "O curso visa a formação de profissionais em bases científica, técnica, ética e humanista, condizentes com a especificidade da área de Ciência da Computação, aliado à formação prática, através do desenvolvimento de projetos e do domínio de tecnologias computacionais.",
    img: "/logo-ciencia-computacao.jpeg",
    link: "https://ifce.edu.br/tiangua",
    modules: [
      {
        title: "Estrutura de Dados",
        icon: "/icon-structured-data.svg",
        status: "completed",
      },
      {
        title: "Banco de Dados",
        icon: "/icon-database.svg",
        status: "completed",
      },
      {
        title: "Programação orientada a objetos",
        icon: "/icon-poo.svg",
        status: "completed",
      },
      {
        title: "Construção e Análise de Algoritmos",
        icon: "/icon-algorithm.svg",
        status: "completed",
      },
      {
        title: "Design Web",
        icon: "/icon-web-design.svg",
        status: "completed",
      },
      {
        title: "Engenharia de Software",
        icon: "/icon-engineering-software.svg",
        status: "completed",
      },
    ],
  },
  {
    title: "Formação em Desenvolvimento Web",
    type: "EAD noturno",
    institution: "Saper.edu",
    date_duration: "Abril de 2023 - Julho de 2023 (120 Horas)",
    description:
      "O curso tem como objetivo a formação de profissionais em desenvolvimento WEB, utilizando a linguagem Java juntamente com o framework Spring Boot e ReactJS para interface do usuário.",
    img: "/logo-saper.jpeg",
    link: "https://www.linkedin.com/showcase/saper-dot-edu/about/",
    modules: [
      {
        title: "Lógica de programação (JAVA)",
        icon: "/icon-java.svg",
        status: "completed",
      },
      {
        title: "Banco de Dados (Oracle)",
        icon: "/icon-database-oracle.svg",
        status: "completed",
      },
      {
        title: "Backend (Spring Boot)",
        icon: "/icon-spring-boot.svg",
        status: "completed",
      },
      {
        title: "Frontend (React, Typescript e Bootstrap)",
        icon: "/icon-frontend.svg",
        status: "completed",
      },
      {
        title: "Projeto Final",
        icon: "/icon-project.svg",
        status: "completed",
      },
    ],
  },
  {
    title: "Full Stack Club",
    type: "Formação Online",
    institution: "Full Stack Club",
    date_duration: "Setembro de 2024 - ATUAL",
    description:
      "O Full Stack Club, criado por Felipe Rocha, é uma comunidade que oferece formação completa para desenvolvedores que desejam se tornar profissionais Full Stack. A formação inclui mais de 500 aulas gravadas, mentorias ao vivo, desenvolvimento de projetos reais e acesso a uma comunidade ativa no Discord. Além disso, o clube oferece um programa de indicação de vagas, auxiliando na inserção ou progressão no mercado de trabalho.",
    img: "/logo-full-stack-club.jpeg",
    link: "https://lp.fullstackclub.com.br/",
    modules: [
      {
        title: "Formação em Next.js",
        icon: "/icon-next.svg",
        status: "in-progress",
      },
      {
        title: "Formação em React",
        icon: "/icon-react.svg",
        status: "in-progress",
      },
      {
        title: "Formação Full Stack",
        icon: "/icon-full-stack-developer.svg",
        status: "in-progress",
      },
      {
        title: "Formação em React Native",
        icon: "/icon-react-native.svg",
        status: "in-progress",
      },
      {
        title: "Formação em SOLID",
        icon: "/icon-solid.svg",
        status: "not-started",
      },
      {
        title: "Formação em Cybersecurity",
        icon: "/icon-cybersecurity.svg",
        status: "not-started",
      },
    ],
  },
];

export const companies = [
  {
    id: 1,
    name: "cloudinary",
    img: "/cloud.svg",
    nameImg: "/cloudName.svg",
  },
  {
    id: 2,
    name: "appwrite",
    img: "/app.svg",
    nameImg: "/appName.svg",
  },
  {
    id: 3,
    name: "HOSTINGER",
    img: "/host.svg",
    nameImg: "/hostName.svg",
  },
  {
    id: 4,
    name: "stream",
    img: "/s.svg",
    nameImg: "/streamName.svg",
  },
  {
    id: 5,
    name: "docker.",
    img: "/dock.svg",
    nameImg: "/dockerName.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Frontend Engineer Intern",
    desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Mobile App Dev - JSM Tech",
    desc: "Designed and developed mobile app for both iOS & Android platforms using React Native.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Freelance App Dev Project",
    desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Lead Frontend Developer",
    desc: "Developed and maintained user-facing features using modern frontend technologies.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    title: "Github",
    link: "https://github.com/Luca-Sousa",
  },
  {
    id: 2,
    img: "/link.svg",
    title: "Linkedin",
    link: "https://www.linkedin.com/in/lucas-sousa-0b79a72a7/",
  },
  {
    id: 3,
    img: "/wha.svg",
    title: "WhatsApp",
    link: "https://api.whatsapp.com/send?phone=5588994545892",
  },
];

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      isActive: true,
    },
    {
      title: "Projetos",
      url: "/dashboard/projects",
      icon: FolderKanbanIcon,
    },
    {
      title: "Technologias",
      url: "/dashboard/technologies",
      icon: GrTechnology,
    },
  ],
};

export const PROJECT_STATUS_LABELS = {
  IN_UPDATE: "Atualização",
  IN_PRODUCTION: "Finalizado",
  IN_PROGRESS: "Desenvolvimento",
};

export const PROJECT_STATUS_OPTIONS = [
  {
    value: ProjectStatus.IN_UPDATE,
    label: PROJECT_STATUS_LABELS[ProjectStatus.IN_UPDATE],
  },
  {
    value: ProjectStatus.IN_PRODUCTION,
    label: PROJECT_STATUS_LABELS[ProjectStatus.IN_PRODUCTION],
  },
  {
    value: ProjectStatus.IN_PROGRESS,
    label: PROJECT_STATUS_LABELS[ProjectStatus.IN_PROGRESS],
  },
];
