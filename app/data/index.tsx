import { IoHome } from "react-icons/io5";
import { GoProjectSymlink } from "react-icons/go";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { MdContacts } from "react-icons/md";

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

export const projects = [
  {
    id: 1,
    title: "3D Solar System Planets to Explore",
    des: "Explore the wonders of our solar system with this captivating 3D simulation of the planets using Three.js.",
    img: "/p1.svg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "https://github.com/adrianhajdin?tab=repositories",
  },
  {
    id: 2,
    title: "Yoom - Video Conferencing App",
    des: "Simplify your video conferencing experience with Yoom. Seamlessly connect with colleagues and friends.",
    img: "/p2.svg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "https://github.com/adrianhajdin/zoom-clone",
  },
  {
    id: 3,
    title: "AI Image SaaS - Canva Application",
    des: "A REAL Software-as-a-Service app with AI features and a payments and credits system using the latest tech stack.",
    img: "/p3.svg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "https://github.com/adrianhajdin/ai_saas_app",
  },
  {
    id: 4,
    title: "Animated Apple Iphone 3D Website",
    des: "Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects..",
    img: "/p4.svg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "https://github.com/adrianhajdin/iphone",
  },
];

export const academic_experiences = [
  {
    title: "Bacharelado em Ciência da Computação",
    subTitle: "Graduação | Agosto de 2022 - ATUAL",
    description:
      "O curso visa a formação de profissionais em bases científica, técnica, ética e humanista, condizentes com a especificidade da área de Ciência da Computação, aliado à formação prática, através do desenvolvimento de projetos e do domínio de tecnologias computacionais.",
    img: "/logo-ciencia-computacao.jpeg",
    link: "https://ifce.edu.br/tiangua",
  },
  {
    title: "Formação em Desenvolvimento Web",
    subTitle: "EAD noturno | Abril de 2023 - Julho de 2023 (120 Horas)",
    description:
      "O curso tem como objetivo a formação de profissionais em desenvolvimento WEB, utilizando Java e ReactJS.",
    img: "/logo-saper.jpeg",
    link: "https://www.linkedin.com/showcase/saper-dot-edu/about/",
  },
  {
    title: "Full Stack Club",
    subTitle: "Formação Online | Setembro de 2024 - ATUAL",
    description:
      "O Full Stack Club, criado por Felipe Rocha, é uma comunidade que oferece formação completa para desenvolvedores que desejam se tornar profissionais Full Stack. A formação inclui mais de 500 aulas gravadas, mentorias ao vivo, desenvolvimento de projetos reais e acesso a uma comunidade ativa no Discord. Além disso, o clube oferece um programa de indicação de vagas, auxiliando na inserção ou progressão no mercado de trabalho.",
    img: "/logo-full-stack-club.jpeg",
    link: "https://lp.fullstackclub.com.br/",
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
];
