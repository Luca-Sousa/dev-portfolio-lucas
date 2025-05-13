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
    certificate: "",
    declaration: "",
    description:
      "O curso visa a formação de profissionais em bases científica, técnica, ética e humanista, condizentes com a especificidade da área de Ciência da Computação, aliado à formação prática, através do desenvolvimento de projetos e do domínio de tecnologias computacionais.",
    img: "/logo-ciencia-computacao.jpeg",
    link: "https://ifce.edu.br/tiangua",
    modules: [
      {
        title: "Estrutura de Dados",
        icon: "/icon-structured-data.svg",
        status: "completed",
        program_content: [
          {
            title: "Conceitos básicos de estruturas de dados.",
            description:
              "Introdução às estruturas de dados e sua importância na organização eficiente de informações.",
            certUrl: "",
          },
          {
            title: "Listas, pilhas e filas.",
            description:
              "Implementação e aplicações de listas encadeadas, pilhas (LIFO) e filas (FIFO).",
            certUrl: "",
          },
          {
            title: "Árvores e grafos.",
            description:
              "Estruturas hierárquicas (árvores binárias, AVL) e redes complexas (grafos).",
            certUrl: "",
          },
          {
            title: "Algoritmos de ordenação e busca.",
            description:
              "Métodos como QuickSort, MergeSort, busca binária e suas complexidades.",
            certUrl: "",
          },
          {
            title: "Complexidade de algoritmos.",
            description:
              "Análise assintótica (Big-O) para avaliar eficiência de algoritmos.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Banco de Dados",
        icon: "/icon-database.svg",
        status: "completed",
        program_content: [
          {
            title: "Modelagem de dados.",
            description:
              "Projeto de bancos de dados relacionais usando modelos ER e normalização.",
            certUrl: "",
          },
          {
            title: "Linguagem SQL.",
            description:
              "Comandos DDL, DML e consultas avançadas (JOINs, subconsultas).",
            certUrl: "",
          },
          {
            title: "Sistemas de gerenciamento de banco de dados (SGBD).",
            description:
              "Funcionamento de SGBDs como MySQL, PostgreSQL e Oracle.",
            certUrl: "",
          },
          {
            title: "Transações e controle de concorrência.",
            description: "Propriedades ACID e mecanismos como locks e MVCC.",
            certUrl: "",
          },
          {
            title: "Otimização de consultas.",
            description:
              "Uso de índices, planejamento de execução e técnicas de tuning.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Programação orientada a objetos",
        icon: "/icon-poo.svg",
        status: "completed",
        program_content: [
          {
            title: "Conceitos de POO.",
            description:
              "Abstração, encapsulamento, herança e polimorfismo na prática.",
            certUrl: "",
          },
          {
            title: "Classes e objetos.",
            description:
              "Definição de classes, instanciação e métodos em linguagens como Java.",
            certUrl: "",
          },
          {
            title: "Encapsulamento, herança e polimorfismo.",
            description:
              "Aplicação dos pilares da POO para código modular e reutilizável.",
            certUrl: "",
          },
          {
            title: "Interfaces e abstração.",
            description: "Contratos entre classes e redução de acoplamento.",
            certUrl: "",
          },
          {
            title: "Design patterns.",
            description:
              "Padrões como Singleton, Factory e Observer para soluções escaláveis.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Construção e Análise de Algoritmos",
        icon: "/icon-algorithm.svg",
        status: "completed",
        program_content: [
          {
            title: "Análise de algoritmos.",
            description: "Técnicas para medir eficiência temporal e espacial.",
            certUrl: "",
          },
          {
            title: "Estruturas de controle.",
            description:
              "Uso de condicionais e loops para construção de lógica.",
            certUrl: "",
          },
          {
            title: "Recursão.",
            description: "Implementação e otimização de funções recursivas.",
            certUrl: "",
          },
          {
            title: "Algoritmos de busca e ordenação.",
            description:
              "Comparativo entre algoritmos como Bubble Sort e Binary Search.",
            certUrl: "",
          },
          {
            title: "Complexidade computacional.",
            description: "Classes P, NP e problemas intratáveis.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Design Web",
        icon: "/icon-web-design.svg",
        status: "completed",
        program_content: [
          {
            title: "Princípios de design de interfaces.",
            description:
              "Heurísticas de Nielsen e experiência do usuário (UX).",
            certUrl: "",
          },
          {
            title: "Usabilidade e acessibilidade.",
            description: "WCAG e técnicas para inclusão digital.",
            certUrl: "",
          },
          {
            title: "Ferramentas de prototipagem.",
            description: "Uso de Figma ou Adobe XD para criação de wireframes.",
            certUrl: "",
          },
          {
            title: "Desenvolvimento responsivo.",
            description: "Design adaptativo para mobile, tablet e desktop.",
            certUrl: "",
          },
          {
            title: "Testes de usabilidade.",
            description: "Métodos como A/B testing e card sorting.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Engenharia de Software",
        icon: "/icon-engineering-software.svg",
        status: "completed",
        program_content: [
          {
            title: "Metodologias ágeis.",
            description:
              "Scrum, Kanban e frameworks ágeis para gestão de projetos.",
            certUrl: "",
          },
          {
            title: "Ciclo de vida do desenvolvimento de software.",
            description:
              "Etapas do SDLC: requisitos, design, implementação e manutenção.",
            certUrl: "",
          },
          {
            title: "Análise e levantamento de requisitos.",
            description:
              "Técnicas como entrevistas e casos de uso para capturar necessidades.",
            certUrl: "",
          },
          {
            title: "Testes de software.",
            description:
              "Tipos de testes (unitários, integração) e ferramentas (JUnit, Selenium).",
            certUrl: "",
          },
          {
            title: "Gerenciamento de projetos de software.",
            description: "Ferramentas como Jira e métricas de produtividade.",
            certUrl: "",
          },
        ],
      },
    ],
  },
  {
    title: "Formação em Desenvolvimento Web",
    type: "EAD noturno",
    institution: "Saper.edu",
    date_duration: "Abril de 2023 - Julho de 2023 (120 Horas)",
    certificate: "",
    declaration: "/declaracao_saper_edu_formacao_web_lucas.pdf",
    description:
      "O curso tem como objetivo a formação de profissionais em desenvolvimento WEB, utilizando a linguagem Java juntamente com o framework Spring Boot e ReactJS para interface do usuário.",
    img: "/logo-saper.jpeg",
    link: "https://www.linkedin.com/showcase/saper-dot-edu/about/",
    modules: [
      {
        title: "Lógica de programação (Java)",
        icon: "/icon-java.svg",
        status: "completed",
        program_content: [
          {
            title: "Conceitos básicos de lógica de programação.",
            description:
              "Variáveis, operadores e estruturas de controle em Java.",
            certUrl: "",
          },
          {
            title: "Estruturas condicionais e de repetição.",
            description:
              "Uso de if/else, switch e loops (for, while) para fluxo de programa.",
            certUrl: "",
          },
          {
            title: "Estruturas de dados (arrays, listas, etc.).",
            description: "Armazenamento e manipulação de coleções de dados.",
            certUrl: "",
          },
          {
            title: "Funções e métodos.",
            description: "Modularização de código com funções e parâmetros.",
            certUrl: "",
          },
          {
            title: "Orientação a objetos.",
            description: "Implementação de classes, objetos e herança em Java.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Banco de Dados (Oracle)",
        icon: "/icon-database-oracle.svg",
        status: "completed",
        program_content: [
          {
            title: "Introdução ao SQL e PL/SQL.",
            description:
              "Comandos básicos e procedimentos armazenados no Oracle.",
            certUrl: "",
          },
          {
            title: "Criação e manipulação de tabelas.",
            description: "DDL (CREATE, ALTER) e DML (INSERT, UPDATE, DELETE).",
            certUrl: "",
          },
          {
            title: "Consultas complexas com joins e subconsultas.",
            description: "Combinação de tabelas e consultas aninhadas.",
            certUrl: "",
          },
          {
            title: "Procedures, functions e triggers.",
            description: "Automação de tarefas com PL/SQL.",
            certUrl: "",
          },
          {
            title: "Gerenciamento de transações e segurança.",
            description: "Controle de concorrência e roles/permissões.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Backend (Spring Boot)",
        icon: "/icon-spring-boot.svg",
        status: "completed",
        program_content: [
          {
            title: "Introdução ao Spring Boot.",
            description: "Configuração de projetos e injeção de dependências.",
            certUrl: "",
          },
          {
            title: "Criação de APIs RESTful.",
            description: "Desenvolvimento de endpoints com Spring MVC.",
            certUrl: "",
          },
          {
            title: "Integração com banco de dados (JPA/Hibernate).",
            description: "Mapeamento objeto-relacional (ORM) e repositórios.",
            certUrl: "",
          },
          {
            title: "Segurança com Spring Security.",
            description: "Autenticação (JWT/OAuth2) e autorização.",
            certUrl: "",
          },
          {
            title: "Testes unitários e de integração.",
            description: "Uso de JUnit e Mockito para validação.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Frontend (React, Typescript e Bootstrap)",
        icon: "/icon-frontend.svg",
        status: "completed",
        program_content: [
          {
            title: "Introdução ao React e Typescript.",
            description: "Componentes, props e tipagem estática.",
            certUrl: "",
          },
          {
            title: "Componentes funcionais e de classe.",
            description: "Diferenças e uso de hooks (useState, useEffect).",
            certUrl: "",
          },
          {
            title: "Gerenciamento de estado com Redux.",
            description: "Centralização de estado global em aplicações React.",
            certUrl: "",
          },
          {
            title: "Estilização com Bootstrap.",
            description:
              "Grid system, componentes pré-estilizados e responsividade.",
            certUrl: "",
          },
          {
            title: "Integração com APIs RESTful.",
            description: "Consumo de APIs usando Axios ou Fetch API.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Projeto Final",
        icon: "/icon-project.svg",
        status: "completed",
        program_content: [
          {
            title:
              "Desenvolvimento de um sistema de gerenciamento de tarefas utilizando as tecnologias aprendidas durante o curso.",
            description:
              "Aplicação full-stack com CRUD, autenticação e deploy.",
            certUrl: "",
          },
          {
            title:
              "Implementação de funcionalidades como autenticação de usuários, criação e edição de tarefas, e visualização de tarefas concluídas.",
            description: "Fluxo completo do usuário com validações e feedback.",
            certUrl: "",
          },
          {
            title:
              "Utilização do banco de dados Oracle para armazenamento das informações do sistema.",
            description: "Modelagem do banco e queries otimizadas.",
            certUrl: "",
          },
          {
            title:
              "Desdobramento do projeto em etapas, com entregas parciais para avaliação e feedback.",
            description: "Metodologia ágil com sprints e revisões.",
            certUrl: "",
          },
        ],
      },
    ],
  },
  {
    title: "Full Stack Club",
    type: "Formação Online",
    institution: "Full Stack Club",
    date_duration: "Setembro de 2024 - ATUAL",
    certificate: "",
    declaration: "",
    description:
      "O Full Stack Club, criado por Felipe Rocha, é uma comunidade que oferece formação completa para desenvolvedores que desejam se tornar profissionais Full Stack. A formação inclui mais de 500 aulas gravadas, mentorias ao vivo, desenvolvimento de projetos reais e acesso a uma comunidade ativa no Discord. Além disso, o clube oferece um programa de indicação de vagas, auxiliando na inserção ou progressão no mercado de trabalho.",
    img: "/logo-full-stack-club.jpeg",
    link: "https://lp.fullstackclub.com.br/",
    modules: [
      {
        title: "Formação em Next.js",
        icon: "/icon-next.svg",
        status: "completed",
        program_content: [
          {
            title: "CSR, SSR, SSG & ISR",
            description:
              "Módulo dedicado aos quatro principais métodos de renderização do Next.js, com foco em suas diferenças, características técnicas e casos de uso.",
            certUrl: "/certificado-fn-csr-ssr-ssg-&-isr.pdf",
          },
          {
            title: "Server Components, Client Components & Hydration",
            description:
              "Conteúdo voltado à separação entre componentes de servidor e cliente, funcionamento do processo de hidratação e implicações no desempenho da aplicação.",
            certUrl: "/certificado-fn-server-&-client-components.pdf",
          },
          {
            title: "Introdução ao Next.js",
            description:
              "Visão geral sobre o Next.js, cobrindo sua estrutura básica, convenções principais e integração com o React.",
            certUrl: "",
          },
          {
            title: "Data Fetching & Caching",
            description:
              "Explicação sobre as abordagens de busca de dados no Next.js, com ênfase em estratégias de cache, revalidação e pré-renderização.",
            certUrl: "/certificado-fn-data-fetching-&-caching.pdf",
          },
          {
            title: "Server Actions & Formulários",
            description:
              "Cobertura do uso de Server Actions para manipulação de dados no backend e implementação de formulários com validação e controle de estados.",
            certUrl: "/certificado-fn-server-actions-&-forms.pdf",
          },
          {
            title: "Gráficos, Streaming & Suspense",
            description:
              "Exploração de recursos visuais com gráficos, técnicas de carregamento parcial via streaming e uso de suspense para controle de estados assíncronos.",
            certUrl: "/certificado-fn-gráficos-streaming-&-suspense.pdf",
          },
          {
            title: "Build & Deploy de Projetos Next.js",
            description:
              "Processos de build e publicação de aplicações Next.js, incluindo configuração de ambientes, otimizações e práticas recomendadas para deploy.",
            certUrl: "",
          },
          {
            title: "Novidades do Next.js 15",
            description:
              "Resumo das principais novidades introduzidas na versão 15 do Next.js, com foco em melhorias, novos recursos e mudanças na API.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Formação em React",
        icon: "/icon-react.svg",
        status: "in-progress",
        program_content: [
          {
            title: "Fundamentos do Node.js",
            description: "JavaScript no servidor com módulos e NPM.",
            certUrl: "/certificado-fundamentos-do-node.js.pdf",
          },
          {
            title: "Módulos no Node.js",
            description: "Sistema CommonJS e ES Modules.",
            certUrl: "/certificado-módulos-no-node.js.pdf",
          },
          {
            title: "Node.js Assíncrono",
            description: "Callbacks, Promises e async/await.",
            certUrl: "/certificado-node.js-assíncrono.pdf",
          },
          {
            title: "Fundamentos do React",
            description: "JSX, componentes e virtual DOM.",
            certUrl: "/certificado-fundamentos-do-react.pdf",
          },
          {
            title: "Componentização & Estilização",
            description: "Reutilização de componentes e formas de estilização.",
            certUrl: "/certificado-componentizacao-e-estilizacao.pdf",
          },
          {
            title: "APIs & Protocolo HTTP/HTTPs",
            description: "Uso de APIs com HTTP/HTTPS no ReactJS.",
            certUrl: "/certificado-apis-&-protocolo-http-https.pdf",
          },
          {
            title: "React Hooks",
            description:
              "Gerenciamento de estados e efeitos em componentes funcionais.",
            certUrl: "/certificado-react-hooks.pdf",
          },
        ],
      },
      {
        title: "Formação Full Stack",
        icon: "/icon-full-stack-developer.svg",
        status: "in-progress",
        program_content: [
          {
            title: "Introdução ao Desenvolvimento Full Stack",
            description: "Papéis do frontend, backend e DevOps.",
            certUrl: "",
          },
          {
            title: "Configuração do Ambiente de Desenvolvimento",
            description: "Ferramentas como Docker e VSCode.",
            certUrl: "",
          },
          {
            title: "Desenvolvimento de APIs RESTful",
            description: "Design de endpoints e boas práticas.",
            certUrl: "",
          },
          {
            title: "Banco de Dados (SQL e NoSQL)",
            description: "Comparativo entre MySQL, MongoDB, etc.",
            certUrl: "",
          },
          {
            title: "Autenticação e Autorização",
            description: "JWT, OAuth2 e controle de permissões.",
            certUrl: "",
          },
          {
            title: "Deploy de Aplicações Full Stack",
            description: "Estratégias para cloud (AWS, Vercel, Heroku).",
            certUrl: "",
          },
          {
            title: "Integração Contínua e Entrega Contínua (CI/CD)",
            description: "Automação com GitHub Actions ou GitLab CI.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Formação em React Native",
        icon: "/icon-react-native.svg",
        status: "not-started",
        program_content: [
          {
            title: "Introdução ao React Native",
            description:
              "Diferenças para React web e configuração do ambiente.",
            certUrl: "",
          },
          {
            title: "Configuração do Ambiente de Desenvolvimento",
            description: "Android Studio, Xcode e emuladores.",
            certUrl: "",
          },
          {
            title: "Componentes Básicos e Avançados",
            description: "View, Text, FlatList e componentes nativos.",
            certUrl: "",
          },
          {
            title: "Navegação entre Telas",
            description: "Bibliotecas como React Navigation.",
            certUrl: "",
          },
          {
            title: "Gerenciamento de Estado com Redux",
            description: "Padrões para apps móveis complexos.",
            certUrl: "",
          },
          {
            title: "Integração com APIs Externas",
            description: "Chamadas HTTP e tratamento de erros.",
            certUrl: "",
          },
          {
            title: "Publicação na App Store e Google Play",
            description: "Processo de submissão e guidelines.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Formação em SOLID",
        icon: "/icon-solid.svg",
        status: "not-started",
        program_content: [
          {
            title: "Introdução aos Princípios SOLID",
            description: "Objetivos e benefícios para código limpo.",
            certUrl: "",
          },
          {
            title: "Single Responsibility Principle (SRP)",
            description: "Uma classe, uma responsabilidade.",
            certUrl: "",
          },
          {
            title: "Open/Closed Principle (OCP)",
            description: "Extensibilidade sem modificar código existente.",
            certUrl: "",
          },
          {
            title: "Liskov Substitution Principle (LSP)",
            description:
              "Subclasses devem substituir classes base sem quebrar o sistema.",
            certUrl: "",
          },
          {
            title: "Interface Segregation Principle (ISP)",
            description: "Interfaces específicas vs. genéricas.",
            certUrl: "",
          },
          {
            title: "Dependency Inversion Principle (DIP)",
            description: "Depender de abstrações, não de implementações.",
            certUrl: "",
          },
          {
            title: "Aplicação dos Princípios em Projetos Reais",
            description: "Refatoração de código para atender ao SOLID.",
            certUrl: "",
          },
        ],
      },
      {
        title: "Formação em Cybersecurity",
        icon: "/icon-cybersecurity.svg",
        status: "not-started",
        program_content: [
          {
            title: "Princípios de Segurança em Aplicações Web",
            description: "OWASP Top 10 e mitigação de riscos.",
            certUrl: "",
          },
          {
            title: "Autenticação e Controle de Acesso",
            description: "MFA, RBAC e prevenção de ataques (brute force).",
            certUrl: "",
          },
          {
            title: "Criptografia e Proteção de Dados",
            description: "Algoritmos (AES, RSA) e GDPR.",
            certUrl: "",
          },
          {
            title: "Segurança em Redes e Protocolos",
            description: "HTTPS, TLS e prevenção de MITM.",
            certUrl: "",
          },
          {
            title: "Testes de Penetração e Avaliação de Vulnerabilidades",
            description: "Ferramentas como Burp Suite e Nmap.",
            certUrl: "",
          },
          {
            title: "Compliance e Normas de Segurança",
            description: "ISO 27001 e LGPD.",
            certUrl: "",
          },
        ],
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
