import type { GeneralArea, Modality } from "./domain";

/**
 * Base mock inspirada em ofertas reais de plataformas internacionais (nomes
 * reais; valores exibíveis aproximados para o protótipo; confira sites oficiais).
 */
export type CourseLevel = "Iniciante" | "Intermediário" | "Avançado";

export type InternationalCourse = {
  id: string;
  name: string;
  shortDescription: string;
  institution: string;
  platform: string;
  modality: Modality;
  area: GeneralArea;
  subArea: string;
  /** Valor aproximado em BRL para o filtro do assistente. */
  priceBrl: number;
  priceDisplay: string;
  about: string;
  duration: string;
  level: CourseLevel;
  prerequisites: string[];
  /** Página de matrícula / detalhes oficiais (abre em nova aba). */
  registrationUrl: string;
  /** Se true, exibe aviso "Internacional" na ficha. */
  isInternational: boolean;
  /** Rótulo curto: ex. "EUA", "Brasil" (apoiar badge/ícone). */
  originCountry: string;
  /** Palavras-chave para busca livre (case-insensitive). */
  tags: string[];
};

const COURSE_CATALOG_RAW: Array<
  Omit<
    InternationalCourse,
    | "shortDescription"
    | "registrationUrl"
    | "isInternational"
    | "originCountry"
    | "tags"
    | "area"
    | "subArea"
  > & {
    area: string;
    subArea: string;
  }
> = [
  {
    id: "coursera-google-ux",
    name: "Google UX Design (certificado profissional)",
    institution: "Google",
    platform: "Coursera",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Design de Interfaces",
    priceBrl: 0,
    priceDisplay: "Assinatura Coursera (cerca de US$ 49,00/mês) · bolsa comum",
    about:
      "Trilha completa de pesquisa com usuário, arquitetura de informação, wireframes, prototipagem Figma, testes de usabilidade e portfólio. Ideal para quem busca a primeira oportunidade em UX e produto digitais.",
    duration: "6 meses (estimado, ~15 h/semana)",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento prévio exigido",
      "Inglês básico a intermediário (legendas e leitura de materiais)",
    ],
  },
  {
    id: "udemy-figma-2024",
    name: "UI/UX: Figma & Web Design (do zero a interfaces completas)",
    institution: "Udemy",
    platform: "Udemy",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Design de Interfaces",
    priceBrl: 90,
    priceDisplay: "Promoção típica US$ 15–20 (≈ R$ 90) · preço pleno varia",
    about:
      "Criação de design systems, componentes, auto-layout, prototipos navegáveis e handoff. Inclui exercícios práticos de interfaces mobile e web responsivo.",
    duration: "40+ horas de vídeo (autodidata)",
    level: "Iniciante",
    prerequisites: [
      "Familiaridade com computador e navegador",
      "Não é necessário conhecimento prévio em Figma",
    ],
  },
  {
    id: "edx-harvard-cs50",
    name: "CS50: Introduction to Computer Science",
    institution: "Harvard University",
    platform: "edX",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Programação",
    priceBrl: 0,
    priceDisplay: "100% Gratuito (avaliação) · certificado pago à parte",
    about:
      "Fundamentos de ciência da computação com C, Python, SQL e conceitos de algoritmos, abstração e desempenho. Um dos cursos de entrada mais conhecidos do mundo, com projetos e desafios práticos.",
    duration: "12 semanas (sugerido, flexível)",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento prévio de programação exigido",
      "Boa leitura em inglês (conteúdo e avaliação)",
    ],
  },
  {
    id: "coursera-ibm-datascience",
    name: "IBM Data Science (certificado profissional)",
    institution: "IBM",
    platform: "Coursera",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Programação",
    priceBrl: 350,
    priceDisplay: "~US$ 49,00/mês (Coursera Plus ou por curso)",
    about:
      "Python, limpeza e visualização de dados, bancos SQL, análise exploratória, machine learning introdutório e storytelling com dados em projetos reais.",
    duration: "11 meses (sugerido) · acelerável",
    level: "Iniciante",
    prerequisites: [
      "Matemática básica (funções, porcentagem)",
      "Inglês para materiais técnicos",
    ],
  },
  {
    id: "udemy-terraform-aws",
    name: "Terraform e AWS: infraestrutura como código (IaC)",
    institution: "Udemy",
    platform: "Udemy",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Infraestrutura/Redes",
    priceBrl: 120,
    priceDisplay: "Padrão R$ 120–250 em promo",
    about:
      "Provisionamento de redes, contas, IAM, VPC, balanceadores e módulos Terraform com práticas de versionamento. Útil para quem inicia em DevOps em cloud.",
    duration: "25 horas",
    level: "Intermediário",
    prerequisites: [
      "Conceitos básicos de Redes (IP, DNS, portas)",
      "Conta de cloud (AWS) para laboratórios (pode ter custo simbólico)",
    ],
  },
  {
    id: "coursera-duke-java",
    name: "Java Programming and Software Engineering Fundamentals",
    institution: "Duke University",
    platform: "Coursera",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Programação",
    priceBrl: 0,
    priceDisplay: "Modelo de assinatura / auditoria com limitações",
    about:
      "Estruturas de controle, orientação a objetos, algoritmos, depuração e manipulação de arquivos e dados com Java em projetos sugeridos do zero.",
    duration: "5 meses (estimado)",
    level: "Iniciante",
    prerequisites: [
      "Lógica básica",
      "Nenhum conhecimento prévio em Java",
    ],
  },
  {
    id: "meta-front-end",
    name: "Meta Front-End Developer (certificado profissional)",
    institution: "Meta",
    platform: "Coursera",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Programação",
    priceBrl: 250,
    priceDisplay: "Cerca de US$ 49,00/mês (assinatura plataforma)",
    about:
      "HTML, CSS, JavaScript, React, controle de versão, testes e noções de UX para se preparar para o mercado de desenvolvimento front-end.",
    duration: "7 meses (sugerido)",
    level: "Iniciante",
    prerequisites: [
      "Familiaridade com o uso de computador e internet",
      "Inglês para materiais técnicos",
    ],
  },
  {
    id: "mit-cloud-linux",
    name: "Linux e redes para administradores (Introdução)",
    institution: "MIT (via edX e parceiros)",
    platform: "edX",
    modality: "Híbrido",
    area: "Tecnologia",
    subArea: "Infraestrutura/Redes",
    priceBrl: 600,
    priceDisplay: "Curso pago (≈ R$ 600–1.200) + laboratórios",
    about:
      "Sistemas operacionais Unix/Linux, serviços, permissões, scripts shell e arquitetura básica de rede em carga de exercícios orientados. Modalidade híbrida com encontros opcionais em hubs parceiros.",
    duration: "4 meses (semipresencial flexível)",
    level: "Intermediário",
    prerequisites: [
      "Familiaridade com linha de comando básica",
      "Lógica de programação básica ajuda, mas não é obrigatória",
    ],
  },
  {
    id: "stanford-ml-2024",
    name: "Machine Learning (revisado CS229 · material aberto)",
    institution: "Stanford University",
    platform: "Stanford Online",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Programação",
    priceBrl: 0,
    priceDisplay: "Acesso a materiais em parte gratuito; certificados variam",
    about:
      "Regressão, classificação, redução de dimensionalidade, modelos e validação, de forma matematicamente sólida. Focado em alunos que desejam base em aprendizado de máquina.",
    duration: "10–12 semanas (ritmo de graduação)",
    level: "Avançado",
    prerequisites: [
      "Cálculo e álgebra linear básica",
      "Probabilidade básica",
      "Nível avançado de inglês acadêmico",
    ],
  },
  {
    id: "harvard-extension-ux",
    name: "User Experience and Interface Design (extensão)",
    institution: "Harvard Extension School",
    platform: "Harvard Extension",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Design de Interfaces",
    priceBrl: 3500,
    priceDisplay: "Cerca de US$ 3.000+ por crédito (ver site oficial em USD)",
    about:
      "Métodos de design centrado no usuário, entrevistas, jornada, acessibilidade, prototipagem e avaliação heurística, com carga e avaliação universitária de extensão.",
    duration: "1 semestre (≈4 meses)",
    level: "Intermediário",
    prerequisites: [
      "Inglês avançado (comunicação acadêmica)",
      "Experiência prévia com design ou produto (recomendado)",
    ],
  },
  {
    id: "coursera-michigan-python",
    name: "Python for Everybody (Especialização)",
    institution: "University of Michigan",
    platform: "Coursera",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Programação",
    priceBrl: 0,
    priceDisplay: "Gratuito para auditar; certificação paga",
    about:
      "Variáveis, estruturas de dados, acesso a web e bancos de dados com Python. Excelente ponto de partida para automação, dados e aplicações web básicas.",
    duration: "8 meses (1 curso/mês) · flexível",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento prévio de programação",
    ],
  },
  {
    id: "edx-ibm-cyber",
    name: "Introduction to Cybersecurity Tools & Cyber Attacks",
    institution: "IBM",
    platform: "edX",
    modality: "Online",
    area: "Tecnologia",
    subArea: "Infraestrutura/Redes",
    priceBrl: 0,
    priceDisplay: "Trilha gratuita com opção de certificado pago",
    about:
      "Panorama de ameaças, mitigação, criptografia básica, operações e cultura de segurança, preparando para cursos e certificações posteriores.",
    duration: "4 semanas",
    level: "Iniciante",
    prerequisites: [
      "Familiaridade com computadores e SO",
    ],
  },
  {
    id: "udemy-photoshop-ux",
    name: "Photoshop e UI: assets para design de interfaces",
    institution: "Udemy",
    platform: "Udemy",
    modality: "Presencial",
    area: "Tecnologia",
    subArea: "Design de Interfaces",
    priceBrl: 80,
    priceDisplay: "R$ 80,00 a R$ 150,00 (ofertas frequentes) · some turmas presenciais",
    about:
      "Criação de mockups, exportação de assets e integração com Figma. Oferta presencial com laboratórios e orientação de um instrutor (dependendo da unidade e parceiro).",
    duration: "32 horas (presencial intensivo fim de semana)",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento exigido em design gráfico",
    ],
  },
  {
    id: "coursera-jhu-covid",
    name: "Science Matters: vamos falar de saúde pública (introdução)",
    institution: "Johns Hopkins University",
    platform: "Coursera",
    modality: "Online",
    area: "Saúde",
    subArea: "Gestão em saúde",
    priceBrl: 0,
    priceDisplay: "100% Gratuito (módulo introdutório) · certificados se aplicável",
    about:
      "Epidemiologia acessível, leitura de estudos, comunicação científica e noções de política de saúde, adequado a interessados em carreiras na área e na gestão pública de saúde.",
    duration: "4 semanas",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento clínico exigido",
    ],
  },
  {
    id: "edx-harvard-healthcare",
    name: "Improving Global Health: Focusing on Quality and Safety",
    institution: "Harvard University",
    platform: "edX",
    modality: "Online",
    area: "Saúde",
    subArea: "Gestão em saúde",
    priceBrl: 0,
    priceDisplay: "Acesso grátis · certificado premium opcional (USD)",
    about:
      "Qualidade e segurança do paciente, processos, indicadores e liderança clínica em contextos reais, para profissionais e gestores de saúde.",
    duration: "5 semanas",
    level: "Intermediário",
    prerequisites: [
      "Vivência em ambiente de saúde (recomendado)",
    ],
  },
  {
    id: "coursera-umich-nurs",
    name: "In the Clinic: a Nursing Primer (simulação introdutória)",
    institution: "University of Michigan",
    platform: "Coursera",
    modality: "Online",
    area: "Saúde",
    subArea: "Enfermagem e cuidados",
    priceBrl: 150,
    priceDisplay: "Cerca de US$ 30–49/mês em plano Coursera",
    about:
      "Postura, comunicação, rotinas de passagem, cultura de segurança e primeiros cuidados em contexto de enfermagem em cenários de simulação audiovisual.",
    duration: "4 semanas",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento clínico prévio obrigatório",
    ],
  },
  {
    id: "usp-medicina-intro",
    name: "Corpo humano e cuidado: anatomia acessível (aberta)",
    institution: "USP (MOOCs)",
    platform: "USP / Coursera",
    modality: "Híbrido",
    area: "Saúde",
    subArea: "Enfermagem e cuidados",
    priceBrl: 0,
    priceDisplay: "100% Gratuito",
    about:
      "Sistemas do corpo humano, primeiros cuidados e sinais vitais, com aulas híbridas (online + encontros de demonstração no campus, quando ofertado).",
    duration: "6 semanas",
    level: "Iniciante",
    prerequisites: [
      "Matemática básica (medições simples)",
    ],
  },
  {
    id: "coursera-yale-wellness",
    name: "The Science of Well-Being",
    institution: "Yale University",
    platform: "Coursera",
    modality: "Online",
    area: "Saúde",
    subArea: "Bem-estar e qualidade de vida",
    priceBrl: 0,
    priceDisplay: "100% Gratuito (muito popular) · certificado pago",
    about:
      "Evidências de felicidade, vieses cognitivos, hábitos e exercícios práticos (gratidão, sono, social) para o bem-estar, com forte base científica.",
    duration: "10 semanas (≈1–2 h/semana)",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento prévio exigido",
    ],
  },
  {
    id: "udemy-meditation",
    name: "Mindfulness e manejo do estresse na rotina de estudo",
    institution: "Udemy",
    platform: "Udemy",
    modality: "Online",
    area: "Saúde",
    subArea: "Bem-estar e qualidade de vida",
    priceBrl: 45,
    priceDisplay: "Padrão R$ 40–100 em promo",
    about:
      "Técnicas de atenção plena, respiração, organização e foco para alunos, com exercícios curtos reutilizáveis no dia a dia acadêmico.",
    duration: "8 horas",
    level: "Iniciante",
    prerequisites: [
      "Nenhum",
    ],
  },
  {
    id: "coursera-ucla-public-speaking",
    name: "Dynamic Public Speaking (especialização)",
    institution: "University of Washington",
    platform: "Coursera",
    modality: "Online",
    area: "Humanas",
    subArea: "Educação e comunicação",
    priceBrl: 0,
    priceDisplay: "Modelo de assinatura; bolsa de necessidade (varia região)",
    about:
      "Estrutura de fala, linguagem corporal, storytelling e voz, com gravação e devolutivas para apresentar com segurança em aulas e feiras de ciência.",
    duration: "4–6 meses (flexível)",
    level: "Iniciante",
    prerequisites: [
      "Inglês para avaliação (a maioria dos materiais)",
    ],
  },
  {
    id: "coursera-psych",
    name: "Introduction to Psychology (Yale / Coursera)",
    institution: "Yale University",
    platform: "Coursera",
    modality: "Online",
    area: "Humanas",
    subArea: "Psicologia e comportamento",
    priceBrl: 0,
    priceDisplay: "100% Gratuito (ou certificado a parte)",
    about:
      "Percepção, aprendizagem, emoção, saúde mental, julgamento e decisão, com aulas e leituras clássicas acessíveis a iniciantes no tema.",
    duration: "15 semanas (flexível no ritmo)",
    level: "Iniciante",
    prerequisites: [
      "Nenhum",
    ],
  },
  {
    id: "coursera-justice",
    name: "Justiça (filosofia moral e política)",
    institution: "Harvard University",
    platform: "edX / Harvard",
    modality: "Online",
    area: "Humanas",
    subArea: "Direito e cidadania",
    priceBrl: 0,
    priceDisplay: "Acesso a vídeos e materiais em grande parte gratuito",
    about:
      "Debates clássicos de ética, utilitarismo, liberdade, utilidade, justiça distributiva, com aulas de Michael Sandel em formato acessível.",
    duration: "12 semanas",
    level: "Iniciante",
    prerequisites: [
      "Inglês para entender debate acelerado (legendas em vários idiomas)",
    ],
  },
  {
    id: "coursera-animacion",
    name: "Game Design: Art and Concepts (foco em arte 2D)",
    institution: "California Institute of the Arts (CalArts)",
    platform: "Coursera",
    modality: "Online",
    area: "Artes & Design",
    subArea: "Artes visuais e ilustração",
    priceBrl: 0,
    priceDisplay: "Assinatura · bolsa de necessidade (região)",
    about:
      "Narrativa visual, desenho de personagens, ambiente, storyboard e criação de ativos 2D para jogos, com práticas e portfólio.",
    duration: "6 meses (estimado)",
    level: "Iniciante",
    prerequisites: [
      "Ferramenta de desenho (digital ou papel)",
    ],
  },
  {
    id: "udemy-grafic",
    name: "Branding: identidade visual e tipografia (projeto do zero)",
    institution: "Udemy",
    platform: "Udemy",
    modality: "Online",
    area: "Artes & Design",
    subArea: "Artes visuais e ilustração",
    priceBrl: 100,
    priceDisplay: "R$ 100,00 em promo (varia)",
    about:
      "Pesquisa, moodboard, logotipo, paleta, tipografia e aplicação em mockups para um cliente fictício com feedback guiado por checklist.",
    duration: "12 horas",
    level: "Iniciante",
    prerequisites: [
      "Adobe Illustrator ou Figma básico (aulas iniciais cobrem o essencial)",
    ],
  },
  {
    id: "coursera-michigan-photovideo",
    name: "Photography Basics and Beyond (especialização)",
    institution: "Michigan State University",
    platform: "Coursera",
    modality: "Presencial",
    area: "Artes & Design",
    subArea: "Audiovisual e mídia",
    priceBrl: 400,
    priceDisplay: "Cerca de R$ 400,00 a R$ 800,00 (parceiro presencial) + acesso online",
    about:
      "Câmera, luz, composição, edição básica e crítica de imagem. A versão híbrida/presencial ocorre em laboratórios de fotografia parceiros em capitais (oferta do protótipo).",
    duration: "5 meses",
    level: "Iniciante",
    prerequisites: [
      "Acesso a câmera ou smartphone de qualidade decente",
    ],
  },
  {
    id: "edx-rit-film",
    name: "Digital Storytelling: film craft for social media (RIT)",
    institution: "Rochester Institute of Technology",
    platform: "edX",
    modality: "Online",
    area: "Artes & Design",
    subArea: "Audiovisual e mídia",
    priceBrl: 0,
    priceDisplay: "Trilha gratuita · certificado pago (USD simbólico em promoção)",
    about:
      "Roteiro curto, captação, edição, sonorização básica e narrativa de marca para canais de vídeo, com tarefas semanais.",
    duration: "3 semanas",
    level: "Iniciante",
    prerequisites: [
      "Celular ou câmera básica",
    ],
  },
  {
    id: "coursera-berklee-song",
    name: "Songwriting: Writing the Lyrics (Berklee)",
    institution: "Berklee College of Music",
    platform: "Coursera",
    modality: "Online",
    area: "Artes & Design",
    subArea: "Música e performance",
    priceBrl: 0,
    priceDisplay: "Assinatura padrão Coursera",
    about:
      "Metrônimo, proposta lírica, hook, rima, construção de estrofes e estilo, com tarefas de compor a partir de gêneros populares.",
    duration: "6 semanas",
    level: "Iniciante",
    prerequisites: [
      "Instrumento (teclado ou violão) ajuda; não exige leitura em clave",
    ],
  },
  {
    id: "udemy-music-prod",
    name: "Produção musical no Ableton (do zero a um track)",
    institution: "Udemy",
    platform: "Udemy",
    modality: "Online",
    area: "Artes & Design",
    subArea: "Música e performance",
    priceBrl: 180,
    priceDisplay: "R$ 180,00 (promoção típica R$ 90–200)",
    about:
      "MIDI, amostras, efeito, sidechain, mix básica e masterização leve em Ableton, percorrendo um projeto completo de música eletrônica.",
    duration: "20 horas",
    level: "Intermediário",
    prerequisites: [
      "Ableton (trial) instalado",
      "Fones de ouvido (recomendado)",
    ],
  },
  {
    id: "coursera-google-mktg",
    name: "Google Digital Marketing & E-commerce (certificado profissional)",
    institution: "Google",
    platform: "Coursera",
    modality: "Online",
    area: "Negócios & Administração",
    subArea: "Vendas e marketing",
    priceBrl: 0,
    priceDisplay: "Cerca de US$ 49,00/mês (assinatura) · acesso a bolsa (região)",
    about:
      "Funil, SEO, mídia paga, analytics, CRM e e-commerce, com atividades e estudos de caso alinhados ao mercado digital.",
    duration: "6 meses (estimado)",
    level: "Iniciante",
    prerequisites: [
      "Familiaridade com computador e redes sociais",
    ],
  },
  {
    id: "wharton-mktg",
    name: "Marketing Analytics (Penn / Wharton · Coursera)",
    institution: "University of Pennsylvania",
    platform: "Coursera",
    modality: "Online",
    area: "Negócios & Administração",
    subArea: "Vendas e marketing",
    priceBrl: 0,
    priceDisplay: "Incluso no Coursera Plus (US$) ou pago em separado",
    about:
      "Dados, segmentação, preço, canais, experimentos e otimização de orçamento com enfoque analítico para marketing e vendas B2B/B2C.",
    duration: "4 semanas / módulo (parte de especialização)",
    level: "Intermediário",
    prerequisites: [
      "Planilha (Excel/Google)",
      "Matemática básica (média, proporção, porcentual)",
    ],
  },
  {
    id: "edx-imb-fin",
    name: "Financial Accounting and Analysis (edX, intro)",
    institution: "Indiana University (via edX)",
    platform: "edX",
    modality: "Online",
    area: "Negócios & Administração",
    subArea: "Gestão e finanças",
    priceBrl: 0,
    priceDisplay: "Acesso a materiais; certificado pago (USD 99 típico)",
    about:
      "Demonstrativos, interpretação, liquidez, rentabilidade e projeção simples a partir de demonstrações. Ideal para início de carreira em negócios.",
    duration: "4 semanas",
    level: "Iniciante",
    prerequisites: [
      "Familiaridade com planilha",
    ],
  },
  {
    id: "coursera-wharton-ent",
    name: "Entrepreneurship (4 cursos) — sementes, descoberta, execução",
    institution: "University of Pennsylvania (Wharton)",
    platform: "Coursera",
    modality: "Online",
    area: "Negócios & Administração",
    subArea: "Empreendedorismo",
    priceBrl: 0,
    priceDisplay: "Custo via assinatura; certificados por trilha",
    about:
      "Descoberta de oportunidade, liderança, proposta de valor, crescimento e testes, com enfoque em empreendimentos iniciais e spin-offs.",
    duration: "6 meses (estimado) · em ritmo próprio",
    level: "Iniciante",
    prerequisites: [
      "Inglês para as avaliações",
    ],
  },
  {
    id: "mit-startup",
    name: "Becoming an Entrepreneur (MIT Bootcamps, intro online)",
    institution: "MIT (Bootcamps / parceiro)",
    platform: "MIT Bootcamps",
    modality: "Online",
    area: "Negócios & Administração",
    subArea: "Empreendedorismo",
    priceBrl: 1500,
    priceDisplay: "A partir de ~US$ 300 em trilha intro; bootcamps presenciais mais altos (USD)",
    about:
      "Tese de problema, entrevista com usuário, proposta, MVP, pitch e iteração. A versão paga aprofunda mentoria, mas o intro cobre a base (protótipo).",
    duration: "6 semanas (intro)",
    level: "Intermediário",
    prerequisites: [
      "Trabalho em equipe (recomendado)",
      "Inglês (materiais e avaliação)",
    ],
  },
  {
    id: "coursera-struct-eng",
    name: "Mechanics of Materials I: fundamentals (Georgia Tech)",
    institution: "Georgia Institute of Technology",
    platform: "Coursera",
    modality: "Online",
    area: "Engenharia",
    subArea: "Civil e construção",
    priceBrl: 0,
    priceDisplay: "Acesso a vídeos; gradação/ certificado pago",
    about:
      "Tensão, deformação, elasticidade, torção, vigas simples e critérios de falha, base para cálculo estrutural e materiais de construção.",
    duration: "5 semanas (intensivo)",
    level: "Intermediário",
    prerequisites: [
      "Cálculo diferencial básico",
      "Física (estática) recomendada",
    ],
  },
  {
    id: "polimi-sustainable-build",
    name: "Green Building: sustainable materials (Politecnico di Milano, edX)",
    institution: "Politecnico di Milano",
    platform: "edX",
    modality: "Online",
    area: "Engenharia",
    subArea: "Civil e construção",
    priceBrl: 0,
    priceDisplay: "Trilha gratuita online",
    about:
      "Materiais de baixo carbono, ciclos de vida, rótulos ambientais, normas e exemplos de obras, para engenharia e arquitetura com foco em sustentabilidade.",
    duration: "4 semanas",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento de engenharia profundo exigido (introdutório)",
    ],
  },
  {
    id: "coursera-robotics-eng",
    name: "Modern Robotics: Mechanics, Planning, and Control (Northwestern)",
    institution: "Northwestern University",
    platform: "Coursera",
    modality: "Online",
    area: "Engenharia",
    subArea: "Mecânica e indústria",
    priceBrl: 0,
    priceDisplay: "Acesso a vídeos; certificação a parte (USD simbólico)",
    about:
      "Cinemática, jacobiano, controle, planejamento e visão introdutória, numa ponte entre mecânica, eletricidade e controle. Forte carga de matemática matricial.",
    duration: "6 meses (trilha completa) · aprox. 1 h/dia sugerida",
    level: "Avançado",
    prerequisites: [
      "Álgebra linear (intermediária a avançada)",
      "Cálculo diferencial básico",
    ],
  },
  {
    id: "coursera-lean-ops",
    name: "Operations Management (Penn, Coursera)",
    institution: "University of Pennsylvania (Wharton)",
    platform: "Coursera",
    modality: "Híbrido",
    area: "Engenharia",
    subArea: "Mecânica e indústria",
    priceBrl: 450,
    priceDisplay: "Aprox. R$ 400–500 + workshop presencial de simulação (parceiro)",
    about:
      "Filas, capacidade, otimização, filas, inventário e operação híbrida, com aplicações em cadeia logística. Oferta híbrida reúne estudo online e simulação em laboratório (quando ocorre).",
    duration: "4 semanas (núcleo) + 2 dias de simulação",
    level: "Intermediário",
    prerequisites: [
      "Planilha e estatística básica (média, desvio)",
    ],
  },
  {
    id: "coursera-ucsd-geoenergy",
    name: "Our Energy Future: renewable and sustainable (UCSD)",
    institution: "University of California, San Diego",
    platform: "Coursera",
    modality: "Online",
    area: "Engenharia",
    subArea: "Energia e sustentabilidade",
    priceBrl: 0,
    priceDisplay: "Acesso a vídeos; certificação a parte (USD 49 típico)",
    about:
      "Combustíveis fósseis, carbono, solar, eólica, energia hídrica, armazenamento e desafio político. Excelente leque introdutório de energia e sustentabilidade.",
    duration: "10 semanas (flexível)",
    level: "Iniciante",
    prerequisites: [
      "Nenhum conhecimento de engenharia exigido",
    ],
  },
  {
    id: "udemy-eng-budget",
    name: "Orçamento e cronograma em obras: planilha na prática",
    institution: "Udemy (instrutor autoral)",
    platform: "Udemy",
    modality: "Presencial",
    area: "Engenharia",
    subArea: "Civil e construção",
    priceBrl: 150,
    priceDisplay: "R$ 150,00 (promo) + 8h presenciais (parceiro local)",
    about:
      "EAP, BDI, acompanhamento e curva S em planilha, alinhada a pequenas obras. Turmas presenciais com laboratório de medição (protótipo).",
    duration: "16 horas (8 online + 8 presenciais)",
    level: "Iniciante",
    prerequisites: [
      "Noções de Excel/Google Sheets (recomendado)",
    ],
  },
];

const COURSE_ENROLLMENT: Record<
  string,
  { registrationUrl: string; isInternational: boolean; originCountry: string }
> = {
  "coursera-google-ux": {
    registrationUrl:
      "https://www.coursera.org/professional-certificates/google-ux-design",
    isInternational: true,
    originCountry: "EUA",
  },
  "udemy-figma-2024": {
    registrationUrl: "https://www.udemy.com/course/figma-uxui/",
    isInternational: true,
    originCountry: "EUA",
  },
  "edx-harvard-cs50": {
    registrationUrl: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-ibm-datascience": {
    registrationUrl:
      "https://www.coursera.org/professional-certificates/ibm-data-science",
    isInternational: true,
    originCountry: "EUA",
  },
  "udemy-terraform-aws": {
    registrationUrl: "https://www.udemy.com/course/terraform-aws-devops/",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-duke-java": {
    registrationUrl: "https://www.coursera.org/specializations/java-programming",
    isInternational: true,
    originCountry: "EUA",
  },
  "meta-front-end": {
    registrationUrl:
      "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    isInternational: true,
    originCountry: "EUA",
  },
  "mit-cloud-linux": {
    registrationUrl: "https://www.coursera.org/learn/linux-tools-for-developers",
    isInternational: true,
    originCountry: "EUA",
  },
  "stanford-ml-2024": {
    registrationUrl: "https://cs229.stanford.edu/",
    isInternational: true,
    originCountry: "EUA",
  },
  "harvard-extension-ux": {
    registrationUrl: "https://extension.harvard.edu/academics/programs/",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-michigan-python": {
    registrationUrl: "https://www.coursera.org/specializations/python",
    isInternational: true,
    originCountry: "EUA",
  },
  "edx-ibm-cyber": {
    registrationUrl: "https://www.edx.org/learn/cybersecurity",
    isInternational: true,
    originCountry: "EUA",
  },
  "udemy-photoshop-ux": {
    registrationUrl: "https://www.udemy.com/course/photoshop-web-design-uxui/",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-jhu-covid": {
    registrationUrl:
      "https://www.coursera.org/specializations/biostatistics-public-health",
    isInternational: true,
    originCountry: "EUA",
  },
  "edx-harvard-healthcare": {
    registrationUrl: "https://www.edx.org/learn/public-health",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-umich-nurs": {
    registrationUrl: "https://www.coursera.org/learn/vital-signs",
    isInternational: true,
    originCountry: "EUA",
  },
  "usp-medicina-intro": {
    registrationUrl: "https://uspdigital.usp.br/mooc/mooc",
    isInternational: false,
    originCountry: "Brasil",
  },
  "coursera-yale-wellness": {
    registrationUrl: "https://www.coursera.org/learn/the-science-of-well-being",
    isInternational: true,
    originCountry: "EUA",
  },
  "udemy-meditation": {
    registrationUrl: "https://www.udemy.com/course/mindfulness-meditation-stress-management/",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-ucla-public-speaking": {
    registrationUrl: "https://www.coursera.org/specializations/public-speaking",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-psych": {
    registrationUrl: "https://www.coursera.org/learn/introduction-psychology",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-justice": {
    registrationUrl: "https://www.edx.org/course/justice-2",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-animacion": {
    registrationUrl: "https://www.coursera.org/specializations/game-design",
    isInternational: true,
    originCountry: "EUA",
  },
  "udemy-grafic": {
    registrationUrl: "https://www.udemy.com/course/brand-identity-and-logo-design-process/",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-michigan-photovideo": {
    registrationUrl:
      "https://www.coursera.org/specializations/photography-basics",
    isInternational: true,
    originCountry: "EUA",
  },
  "edx-rit-film": {
    registrationUrl: "https://www.edx.org/learn/film",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-berklee-song": {
    registrationUrl: "https://www.coursera.org/learn/songwriting-lyrics",
    isInternational: true,
    originCountry: "EUA",
  },
  "udemy-music-prod": {
    registrationUrl: "https://www.udemy.com/course/ableton-live/",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-google-mktg": {
    registrationUrl:
      "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce",
    isInternational: true,
    originCountry: "EUA",
  },
  "wharton-mktg": {
    registrationUrl:
      "https://www.edx.org/learn/business-administration/the-wharton-school-of-the-university-of-pennsylvania-marketing-analytics-data-tools-and-techniques",
    isInternational: true,
    originCountry: "EUA",
  },
  "edx-imb-fin": {
    registrationUrl: "https://www.edx.org/learn/finance",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-wharton-ent": {
    registrationUrl:
      "https://www.coursera.org/specializations/business-entrepreneurship",
    isInternational: true,
    originCountry: "EUA",
  },
  "mit-startup": {
    registrationUrl: "https://entrepreneurship.mit.edu/",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-struct-eng": {
    registrationUrl: "https://www.coursera.org/learn/mechanics-of-materials-1",
    isInternational: true,
    originCountry: "EUA",
  },
  "polimi-sustainable-build": {
    registrationUrl: "https://www.edx.org/learn/renewable-energy",
    isInternational: true,
    originCountry: "Itália",
  },
  "coursera-robotics-eng": {
    registrationUrl: "https://www.coursera.org/specializations/modernrobotics",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-lean-ops": {
    registrationUrl: "https://www.coursera.org/learn/wharton-operations",
    isInternational: true,
    originCountry: "EUA",
  },
  "coursera-ucsd-geoenergy": {
    registrationUrl: "https://www.coursera.org/learn/renewable-energy",
    isInternational: true,
    originCountry: "EUA",
  },
  "udemy-eng-budget": {
    registrationUrl: "https://www.udemy.com/course/construction-management-estimating/",
    isInternational: false,
    originCountry: "Brasil",
  },
};

/** Niches canônicos (um dos 6 por área) + tags para busca por texto. */
const COURSE_NICHE: Record<
  string,
  { subArea: string; tags: string[] }
> = {
  "coursera-google-ux": {
    subArea: "Design de interfaces, UX e produto",
    tags: [
      "ux",
      "ui",
      "figma",
      "pesquisa com usuário",
      "acessibilidade",
      "portfólio",
    ],
  },
  "udemy-figma-2024": {
    subArea: "Design de interfaces, UX e produto",
    tags: [
      "figma",
      "interface",
      "wireframe",
      "protótipo",
      "design system",
      "web",
    ],
  },
  "edx-harvard-cs50": {
    subArea: "Programação e fundamentos de software",
    tags: [
      "algoritmos",
      "python",
      "c",
      "sql",
      "ciência da computação",
      "harvard",
    ],
  },
  "coursera-ibm-datascience": {
    subArea: "Dados, analytics e aprendizado de máquina",
    tags: [
      "dados",
      "python",
      "sql",
      "visualização",
      "machine learning",
      "projetos",
    ],
  },
  "udemy-terraform-aws": {
    subArea: "Infraestrutura, cloud e redes",
    tags: [
      "terraform",
      "aws",
      "devops",
      "iac",
      "nuvem",
      "rede",
    ],
  },
  "coursera-duke-java": {
    subArea: "Programação e fundamentos de software",
    tags: ["java", "oop", "software", "algoritmos", "desenvolvimento"],
  },
  "meta-front-end": {
    subArea: "Desenvolvimento web e aplicações front-end",
    tags: [
      "react",
      "html",
      "css",
      "javascript",
      "front-end",
      "meta",
    ],
  },
  "mit-cloud-linux": {
    subArea: "Infraestrutura, cloud e redes",
    tags: [
      "linux",
      "rede",
      "servidores",
      "sistemas",
      "híbrido",
    ],
  },
  "stanford-ml-2024": {
    subArea: "Dados, analytics e aprendizado de máquina",
    tags: [
      "machine learning",
      "otimização",
      "cálculo",
      "regressão",
      "rede neural",
    ],
  },
  "harvard-extension-ux": {
    subArea: "Design de interfaces, UX e produto",
    tags: [
      "ux",
      "interface",
      "prototipagem",
      "extensão",
      "acessibilidade",
    ],
  },
  "coursera-michigan-python": {
    subArea: "Programação e fundamentos de software",
    tags: [
      "python",
      "automação",
      "dados",
      "web",
      "programação",
    ],
  },
  "edx-ibm-cyber": {
    subArea: "Cibersegurança, DevOps e automação",
    tags: [
      "cibersegurança",
      "segurança",
      "ameaças",
      "criptografia",
      "rede",
    ],
  },
  "udemy-photoshop-ux": {
    subArea: "Design de interfaces, UX e produto",
    tags: [
      "photoshop",
      "ui",
      "assets",
      "mockup",
      "design gráfico",
    ],
  },
  "coursera-jhu-covid": {
    subArea: "Epidemiologia, evidências e saúde pública",
    tags: [
      "epidemiologia",
      "ciência",
      "saúde pública",
      "evidência",
    ],
  },
  "edx-harvard-healthcare": {
    subArea: "Gestão em saúde, políticas e sistemas",
    tags: [
      "qualidade",
      "segurança do paciente",
      "gestão",
      "hospital",
    ],
  },
  "coursera-umich-nurs": {
    subArea: "Enfermagem, cuidados e simulação clínica",
    tags: [
      "enfermagem",
      "cuidado",
      "simulação",
      "clínica",
    ],
  },
  "usp-medicina-intro": {
    subArea: "Enfermagem, cuidados e simulação clínica",
    tags: [
      "anatomia",
      "corpo humano",
      "cuidado",
      "brasil",
      "médico",
    ],
  },
  "coursera-yale-wellness": {
    subArea: "Bem-estar, saúde mental e mindfulness",
    tags: [
      "bem-estar",
      "felicidade",
      "mindfulness",
      "hábitos",
      "psicologia",
    ],
  },
  "udemy-meditation": {
    subArea: "Bem-estar, saúde mental e mindfulness",
    tags: [
      "meditação",
      "estresse",
      "atenção plena",
      "rotina",
    ],
  },
  "coursera-ucla-public-speaking": {
    subArea: "Comunicação, oratória e escrita",
    tags: [
      "oratória",
      "fala pública",
      "apresentação",
      "comunicação",
    ],
  },
  "coursera-psych": {
    subArea: "Psicologia, comportamento e desenvolvimento",
    tags: [
      "psicologia",
      "emoção",
      "aprendizagem",
      "comportamento",
    ],
  },
  "coursera-justice": {
    subArea: "Direito, ética, justiça e cidadania",
    tags: [
      "filosofia moral",
      "ética",
      "justiça",
      "direito",
    ],
  },
  "coursera-animacion": {
    subArea: "Animação, games e artes interativas",
    tags: [
      "game",
      "design de jogos",
      "personagem",
      "2d",
      "história",
    ],
  },
  "udemy-grafic": {
    subArea: "Artes visuais, ilustração e identidade",
    tags: [
      "identidade",
      "marca",
      "tipografia",
      "illustrator",
    ],
  },
  "coursera-michigan-photovideo": {
    subArea: "Audiovisual, cinema, fotografia e mídias",
    tags: [
      "fotografia",
      "luz",
      "câmera",
      "composição",
    ],
  },
  "edx-rit-film": {
    subArea: "Audiovisual, cinema, fotografia e mídias",
    tags: [
      "vídeo",
      "roteiro",
      "mídias",
      "storytelling",
    ],
  },
  "coursera-berklee-song": {
    subArea: "Música, áudio, performance e produção",
    tags: [
      "música",
      "composição",
      "letra",
      "songwriting",
    ],
  },
  "udemy-music-prod": {
    subArea: "Música, áudio, performance e produção",
    tags: [
      "ableton",
      "produção musical",
      "mix",
      "eletrônica",
    ],
  },
  "coursera-google-mktg": {
    subArea: "Marketing digital, conteúdo e analytics",
    tags: [
      "seo",
      "marketing digital",
      "crm",
      "google",
    ],
  },
  "wharton-mktg": {
    subArea: "Marketing digital, conteúdo e analytics",
    tags: [
      "analytics de marketing",
      "segmentação",
      "dados de marketing",
    ],
  },
  "edx-imb-fin": {
    subArea: "Finanças, controle e orçamento",
    tags: [
      "contabilidade",
      "demonstrações",
      "análise financeira",
    ],
  },
  "coursera-wharton-ent": {
    subArea: "Empreendedorismo, inovação e negócios",
    tags: [
      "startup",
      "mvp",
      "empreendedor",
      "validação",
    ],
  },
  "mit-startup": {
    subArea: "Empreendedorismo, inovação e negócios",
    tags: [
      "startup",
      "pitch",
      "bootcamp",
      "inovação",
    ],
  },
  "coursera-struct-eng": {
    subArea: "Civil, obras, orçamento e canteiro",
    tags: [
      "mecânica dos materiais",
      "estrutura",
      "materiais",
    ],
  },
  "polimi-sustainable-build": {
    subArea: "Energia, sustentabilidade e meio ambiente",
    tags: [
      "sustentabilidade",
      "construção verde",
      "materiais",
    ],
  },
  "coursera-robotics-eng": {
    subArea: "Automação, robótica e indústria 4.0",
    tags: [
      "robótica",
      "cinemática",
      "controle",
    ],
  },
  "coursera-lean-ops": {
    subArea: "Mecânica, materiais e processos industriais",
    tags: [
      "operações",
      "filas",
      "inventário",
      "logística",
    ],
  },
  "coursera-ucsd-geoenergy": {
    subArea: "Energia, sustentabilidade e meio ambiente",
    tags: [
      "energia",
      "renovável",
      "fósseis",
      "sustentabilidade",
    ],
  },
  "udemy-eng-budget": {
    subArea: "Civil, obras, orçamento e canteiro",
    tags: [
      "orçamento",
      "canteiro",
      "obra",
      "planilha",
      "cronograma",
    ],
  },
};

const MANUAL_COURSES: InternationalCourse[] = COURSE_CATALOG_RAW.map((c) => {
  const AREA_KEY_BY_LABEL: Record<string, GeneralArea> = {
    Tecnologia: "technology",
    Saúde: "health",
    Humanas: "humanities",
    "Artes & Design": "arts_design",
    "Negócios & Administração": "business_admin",
    Engenharia: "engineering",
  };

  const extra = COURSE_ENROLLMENT[c.id];
  const niche = COURSE_NICHE[c.id];
  if (!extra) {
    throw new Error(`Metadados de inscrição ausentes: ${c.id}`);
  }
  if (!niche) {
    throw new Error(`Nicho e tags ausentes: ${c.id}`);
  }
  const areaKey = AREA_KEY_BY_LABEL[c.area] ?? "technology";
  const firstSentence = c.about.split(".")[0]?.trim() ?? c.about.trim();
  return {
    ...c,
    area: areaKey,
    shortDescription:
      firstSentence.length > 120
        ? `${firstSentence.slice(0, 117)}...`
        : firstSentence,
    subArea: niche.subArea,
    tags: niche.tags,
    ...extra,
  };
});

function dedupeCatalogById(
  courses: InternationalCourse[]
): InternationalCourse[] {
  const seen = new Set<string>();
  const out: InternationalCourse[] = [];
  for (const c of courses) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

export const INTERNATIONAL_COURSES: InternationalCourse[] =
  dedupeCatalogById(MANUAL_COURSES);

export function getCourseById(
  id: string
): InternationalCourse | undefined {
  return INTERNATIONAL_COURSES.find((c) => c.id === id);
}
