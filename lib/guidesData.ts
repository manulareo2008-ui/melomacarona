// lib/guidesData.ts
// Dados completos dos guias editoriais do Atloom
// Cada guia tem conteúdo denso para indexação orgânica no Google

export interface GuideSection {
    heading: string;
    body: string; // pode conter \n para parágrafos múltiplos
  }

  export interface GuideCourse {
    name: string;
    institution: string;
    level: string;
    highlight: string;
    slug?: string; // link pro wizard com filtro
  }

  export interface GuideFaq {
    question: string;
    answer: string;
  }

  export interface Guide {
    slug: string;
    title: string;
    eyebrow: string;
    metaDescription: string;
    intro: string;
    sections: GuideSection[];
    courses: GuideCourse[];
    faq: GuideFaq[];
  }

  export const guidesData: Guide[] = [
    // ─── GUIA 1 (existente, expandido) ─────────────────────────────────────────
    {
      slug: "cursos-ia-iniciantes",
      title: "Cursos de Inteligência Artificial para Iniciantes",
      eyebrow: "Guia prático — IA e Machine Learning",
      metaDescription:
        "Descubra os melhores cursos de Inteligência Artificial para iniciantes em 2026. Comparativo de plataformas, preços, carga horária e o que realmente importa antes de matricular.",
      intro:
        "Inteligência Artificial deixou de ser tema de pesquisa acadêmica e entrou definitivamente no mercado de trabalho. Profissionais de todas as áreas — de marketing a logística, de saúde a finanças — estão sendo cobrados por familiaridade com ferramentas de IA, automação e análise de dados. A questão não é mais se você vai precisar aprender IA, mas quando e como.\n\nO problema é que o mercado de cursos de IA cresceu junto com a demanda e hoje é cheio de armadilhas: cursos desatualizados, conteúdo superficial e promessas de resultado rápido que não se sustentam. Este guia foi escrito para cortar esse ruído e te ajudar a escolher o primeiro curso certo — aquele que vai te dar base real, não apenas certificado para o LinkedIn.",
      sections: [
        {
          heading: "O que você precisa saber antes de começar em IA",
          body: "A maioria dos iniciantes comete o mesmo erro: buscar o curso mais avançado, com o nome mais imponente, sem ter a base necessária. Cursos de Machine Learning que começam com álgebra linear e Python assumem que você já sabe programar. Se você não sabe, vai abandonar o curso na segunda semana.\n\nO caminho correto para iniciantes absolutos é linear: primeiro lógica de programação e Python básico, depois manipulação de dados com bibliotecas como Pandas e NumPy, depois visualização, e só então modelos de Machine Learning e redes neurais. Pular etapas é a razão número um de desistência.\n\nSe você já tem algum contato com programação, é possível começar diretamente em cursos de IA aplicada — especialmente os que focam em uso de APIs de modelos prontos (OpenAI, Anthropic, Google) para construir aplicações reais. Essa trilha é mais rápida e tem demanda de mercado alta no momento.",
        },
        {
          heading: "Como avaliar um curso de IA antes de comprar",
          body: "Quatro critérios decidem se um curso vale o investimento:\n\n1. Data de atualização: IA muda rápido. Um curso de 2021 sobre redes neurais já está desatualizado em vários pontos práticos. Verifique quando o conteúdo foi revisado pela última vez.\n\n2. Proporção teoria x prática: Os melhores cursos de IA para iniciantes têm pelo menos 60% do tempo em projetos aplicados. Assistir aulas sem codar não gera retenção de aprendizado.\n\n3. Suporte e comunidade: Iniciantes travam. Um curso sem fórum ativo, sem mentoria e sem suporte te deixa sozinho no momento mais crítico. Verifique se há comunidade no Discord, Slack ou fórum próprio.\n\n4. Certificado com valor de mercado: Nem todo certificado é igual. Certificados de plataformas reconhecidas como Coursera (parceria com Stanford, DeepLearning.AI), Alura e DIO têm peso diferente no currículo do que PDFs gerados automaticamente.",
        },
        {
          heading: "Trilhas de aprendizado por perfil",
          body: "Não existe um único caminho para aprender IA. O melhor curso depende de onde você está agora e onde quer chegar.\n\nPerfil 1 — Sem experiência em programação: Comece com lógica de programação e Python. Plataformas como DIO e Alura têm trilhas específicas para quem parte do zero. Espere de 3 a 6 meses antes de entrar em conteúdo de IA de forma consistente.\n\nPerfil 2 — Programador em outra linguagem: Se você já programa em Java, PHP, JavaScript ou qualquer outra linguagem, a curva para Python é curta. Você pode começar em cursos de Data Science ou IA aplicada em 2 a 4 semanas de transição.\n\nPerfil 3 — Profissional de outra área querendo usar IA no trabalho: Não precisa saber programar. Cursos de IA para negócios, automação com ferramentas no-code e uso de ferramentas como ChatGPT, Copilot e Gemini no contexto profissional são mais adequados. O objetivo é produtividade, não engenharia.\n\nPerfil 4 — Desenvolvedor querendo especializar em IA: Cursos da DeepLearning.AI, Hugging Face e especializações do Coursera são o caminho. Prepare-se para conteúdo denso com matemática aplicada.",
        },
        {
          heading: "Plataformas e o que cada uma entrega de verdade",
          body: "Cada plataforma tem um perfil diferente e serve melhor a um tipo de estudante.\n\nAlura: Melhor opção nacional para quem quer trilha estruturada em português com suporte real. O modelo de assinatura dá acesso a centenas de cursos. Ponto forte é a qualidade dos instrutores e atualização frequente do conteúdo. Ponto fraco: pode ser caro para quem quer testar um único tópico.\n\nRocketseat: Foco em desenvolvimento de software, com IA sendo integrada gradualmente. Excelente comunidade e metodologia de projetos. Mais indicada para quem quer combinar programação com IA aplicada a produtos digitais.\n\nDIO: Gratuita com opções pagas. Muito boa para certificações e trilhas patrocinadas por empresas. Qualidade variável entre cursos — vale verificar avaliação de cada trilha especificamente.\n\nCoursera: Parceria com universidades globais. Conteúdo de alto nível com opção de audit gratuito. Ideal para quem quer credencial internacional reconhecida. Ponto negativo: conteúdo em inglês na maioria dos casos, mesmo com legendas em português.\n\nDeepLearning.AI: Criada por Andrew Ng, referência mundial em educação de IA. Especializações com profundidade real. Recomendada para desenvolvedores ou profissionais de dados que querem ir fundo no tema.",
        },
      ],
      courses: [
        {
          name: "AI For Everyone",
          institution: "DeepLearning.AI (Coursera)",
          level: "Iniciante",
          highlight: "Melhor introdução a IA para não-técnicos. Audit gratuito disponível.",
        },
        {
          name: "Formação Inteligência Artificial",
          institution: "Alura",
          level: "Iniciante a Intermediário",
          highlight: "Trilha completa em português com projetos aplicados e suporte.",
        },
        {
          name: "Bootcamp IA Generativa",
          institution: "DIO",
          level: "Iniciante",
          highlight: "Gratuito com certificado. Bom ponto de entrada para o ecossistema de IA.",
        },
        {
          name: "Machine Learning Specialization",
          institution: "DeepLearning.AI (Coursera)",
          level: "Intermediário",
          highlight: "Curso de Andrew Ng. Referência absoluta para quem quer base sólida em ML.",
        },
      ],
      faq: [
        {
          question: "Preciso saber matemática para aprender IA?",
          answer:
            "Depende do nível de profundidade. Para uso de ferramentas de IA e automação, não precisa. Para treinar modelos do zero e entender arquiteturas, sim — álgebra linear e cálculo são necessários. A maioria dos cursos para iniciantes contorna isso usando bibliotecas prontas.",
        },
        {
          question: "Quanto tempo leva para conseguir emprego na área de IA?",
          answer:
            "Para uma posição de analista de dados ou ML engineer junior, espere de 12 a 18 meses de estudo dedicado, incluindo portfólio de projetos. Para usar IA como ferramenta no trabalho atual, o resultado pode vir em semanas.",
        },
        {
          question: "Vale mais a pena fazer curso online ou faculdade de IA?",
          answer:
            "Para entrar rápido no mercado, cursos online estruturados com portfólio prático superam faculdades tradicionais em velocidade e custo-benefício. Faculdade agrega em pesquisa, networking universitário e cargos que exigem diploma formalmente. As duas opções têm lugar — depende do seu objetivo.",
        },
      ],
    },

    // ─── GUIA 2 (existente, expandido) ─────────────────────────────────────────
    {
      slug: "melhores-cursos-ate-100",
      title: "Melhores Cursos Online até R$ 100 em 2026",
      eyebrow: "Guia prático — Custo-benefício",
      metaDescription:
        "Lista dos melhores cursos online de até R$ 100 em 2026. Comparativo real por área, plataforma e resultado esperado. Sem cursos medíocres, sem perda de tempo.",
      intro:
        "Investir em educação profissional não precisa custar caro para gerar retorno real. Existe um mercado robusto de cursos de alta qualidade abaixo de R$ 100 — especialmente em tecnologia, design, marketing digital e gestão — que entrega conteúdo aplicável e certificados com peso de mercado.\n\nO desafio é filtrar o que vale do que é barato sem qualidade. Plataformas como Udemy têm mais de 200 mil cursos — a maioria medíocre. Este guia seleciona as categorias com melhor custo-benefício e os critérios para você não errar na escolha, independente de qual plataforma usar.",
      sections: [
        {
          heading: "Por que o preço baixo não significa qualidade baixa em 2026",
          body: "O mercado de educação online passou por uma deflação de preços nos últimos anos. Plataformas como Udemy operam com descontos permanentes de 70 a 90%, o que significa que um curso listado a R$ 300 pode ser comprado por R$ 27 em qualquer semana do ano.\n\nAlém disso, o modelo de assinatura — usado por Alura, Rocketseat e LinkedIn Learning — dilui o custo por curso. Uma assinatura mensal de R$ 80 dá acesso a centenas de cursos, tornando o custo por hora de aprendizado menor do que qualquer alternativa presencial.\n\nIsso criou uma janela de oportunidade: nunca foi tão barato acessar conteúdo de qualidade. O problema mudou de acesso para curadoria — saber o que escolher no meio de tanto conteúdo disponível.",
        },
        {
          heading: "Áreas com melhor custo-benefício abaixo de R$ 100",
          body: "Nem todas as áreas têm a mesma densidade de cursos bons a preço baixo. Estas são as que têm melhor relação qualidade-preço na faixa até R$ 100:\n\nProgramação e desenvolvimento web: Alta oferta de cursos bons. HTML, CSS, JavaScript, Python e SQL têm excelentes opções gratuitas e pagas abaixo de R$ 50 em plataformas como freeCodeCamp, DIO e Udemy.\n\nMarketing digital e mídias sociais: Muitos cursos bons na faixa de R$ 29 a R$ 79, especialmente em Google Ads, SEO básico, Instagram e criação de conteúdo. Cuidado com cursos de 'guru' sem substância — verifique avaliação e data de atualização.\n\nDesign gráfico e UX básico: Cursos de Canva, Figma básico e design para redes sociais têm ótima oferta a preço baixo. Origamid tem cursos de design de alto nível em formato acessível.\n\nExcel e análise de dados: Uma das áreas com melhor ROI para profissionais de qualquer setor. Cursos de Excel avançado, Power BI e Google Sheets custam entre R$ 20 e R$ 80 e geram impacto direto na produtividade.\n\nIdiomas: Cursos de inglês online têm preço democrático. O Duolingo é gratuito. Plataformas como Preply e italki permitem aulas com professores nativos por valores acessíveis.",
        },
        {
          heading: "Como não errar na compra de um curso barato",
          body: "Quatro sinais de alerta antes de comprar:\n\n1. Última atualização há mais de 2 anos: Em tecnologia e marketing, conteúdo de 2022 pode estar completamente desatualizado. Verifique a data da última revisão antes de clicar em comprar.\n\n2. Avaliação abaixo de 4.3 estrelas: Em plataformas com sistema de review, cursos bons raramente ficam abaixo de 4.3. Desconfie de cursos com poucas avaliações ou com média suspeitamente alta.\n\n3. Carga horária desproporcional: Um curso de 2 horas que promete te tornar especialista em qualquer coisa é enganoso. Para aprendizado real, espere pelo menos 8 a 15 horas de conteúdo aplicado para cursos introdutórios.\n\n4. Sem projeto prático: Cursos só com aulas teóricas não geram portfólio e têm retenção de aprendizado muito menor. Prefira sempre cursos com exercícios, desafios e projetos entregáveis.",
        },
      ],
      courses: [
        {
          name: "Excel do Básico ao Avançado",
          institution: "Hashtag Treinamentos",
          level: "Iniciante a Avançado",
          highlight: "Referência nacional em Excel. Conteúdo atualizado e muito aplicável.",
        },
        {
          name: "Formação Design Gráfico",
          institution: "Origamid",
          level: "Iniciante",
          highlight: "Design ensinado com rigor técnico. Um dos melhores cursos nacionais de design.",
        },
        {
          name: "Trilha Python para Dados",
          institution: "DIO",
          level: "Iniciante",
          highlight: "Gratuito. Bom ponto de entrada para quem quer dados sem investimento inicial.",
        },
        {
          name: "SEO na Prática",
          institution: "Escola DNC",
          level: "Iniciante",
          highlight: "Cursos de marketing digital com aplicação direta. Bom custo-benefício.",
        },
      ],
      faq: [
        {
          question: "Vale mais a pena assinar uma plataforma ou comprar cursos avulsos?",
          answer:
            "Se você vai estudar mais de 2 tópicos diferentes no ano, assinatura compensa. Se você tem um objetivo específico e pontual, curso avulso é mais eficiente. Calcule: Alura custa em torno de R$ 80 a R$ 100 por mês — se você consumir mais de 2 cursos completos por mês, já pagou o investimento.",
        },
        {
          question: "Cursos gratuitos são suficientes para entrar no mercado?",
          answer:
            "Para algumas áreas, sim. Programação web, por exemplo, tem um ecossistema gratuito robusto (freeCodeCamp, DIO, MDN). Para outras, como design e marketing avançado, os cursos pagos têm qualidade significativamente superior. O modelo híbrido — gratuito para base, pago para especialização — é o mais eficiente.",
        },
        {
          question: "Cursos da Udemy são reconhecidos pelo mercado?",
          answer:
            "Sim, especialmente em tecnologia. Cursos de instrutores renomados na Udemy (Angela Yu, Jose Portilla, Stephen Grider) são amplamente reconhecidos. O certificado Udemy em si tem menos peso do que o conhecimento adquirido — o que conta no portfólio é o projeto construído, não o PDF.",
        },
      ],
    },

    // ─── GUIA 3 (existente, expandido) ─────────────────────────────────────────
    {
      slug: "cursos-online-com-certificado",
      title: "Cursos Online com Certificado que Valem no Mercado",
      eyebrow: "Guia prático — Certificação profissional",
      metaDescription:
        "Quais certificados de cursos online realmente valem para o mercado de trabalho em 2026. Guia completo com plataformas, áreas e o que RH e gestores realmente olham.",
      intro:
        "Certificado de curso online já não é diferencial — é expectativa. Recrutadores e gestores de contratação passaram a esperar que candidatos juniors e em transição de carreira apresentem certificados como prova de iniciativa e aprendizado autodirigido. A questão relevante deixou de ser 'tem certificado?' e passou a ser 'de onde é e o que ele prova?'\n\nNem todo certificado tem o mesmo peso. Existe uma hierarquia clara no mercado: certificados de universidades e instituições com nome reconhecido valem mais que certificados de plataformas genéricas, que por sua vez valem mais que certificados gerados automaticamente sem nenhum critério de avaliação. Este guia mostra como navegar essa hierarquia e escolher certificações que realmente movem agulha na sua carreira.",
      sections: [
        {
          heading: "A hierarquia real dos certificados no mercado brasileiro",
          body: "Existe uma ordem de credibilidade que RH e recrutadores técnicos aplicam, mesmo que não falem isso abertamente:\n\nNível 1 — Certificações de fabricante: AWS, Google Cloud, Microsoft Azure, Cisco, Oracle. São as mais valorizadas em tecnologia porque exigem prova presencial ou monitorada, têm prazo de validade e custo real de manutenção. Indicam investimento sério.\n\nNível 2 — Certificados de universidades via plataformas globais: Coursera (parceria com Stanford, Michigan, Johns Hopkins), edX (MIT, Harvard). O certificado traz o nome da universidade parceira, o que tem peso real em processos seletivos competitivos.\n\nNível 3 — Plataformas nacionais reconhecidas: Alura, Rocketseat, Conquer. Têm nome no mercado brasileiro, especialmente em tecnologia e gestão. Recrutadores dessas áreas conhecem e valorizam.\n\nNível 4 — Plataformas de grande volume (Udemy, Hotmart): O certificado em si tem pouco peso, mas o conhecimento e portfólio gerado pelo curso são valorizados. O certificado é complementar, não o destaque.\n\nNível 5 — Certificados autogerados sem critério: PDFs emitidos automaticamente ao assistir vídeos sem nenhuma avaliação. Têm valor próximo de zero como credencial, embora o conhecimento do curso possa ser valioso.",
        },
        {
          heading: "Quais áreas têm maior retorno por certificação",
          body: "Algumas áreas têm retorno direto e mensurável por certificação. Outras, o certificado é coadjuvante.\n\nTecnologia e Cloud Computing: Maior ROI de certificação do mercado. Um AWS Solutions Architect Associate, por exemplo, pode aumentar o salário de um desenvolvedor entre 20 e 40% em alguns mercados. Certificações Azure e GCP têm efeito similar.\n\nMarketing Digital e Analytics: Google Ads, Google Analytics 4 e Meta Blueprint são certificações gratuitas reconhecidas. Para agências e vagas de marketing digital, aparecer com essas certificações é critério de filtragem em muitos processos.\n\nProjeto e Gestão: PMP (Project Management Institute) é a referência global, mas exige experiência. Para iniciantes, certificações como Scrum Master (Scrum.org, Certiprof) têm boa aceitação e custo acessível.\n\nFinanças e Contabilidade: CFA, CFP e CNPI têm peso real no mercado financeiro brasileiro. Para posições juniors, cursos da ANBIMA são bem vistos.\n\nRH e Gestão de Pessoas: SHRM e CIPD têm reconhecimento internacional. Para o mercado brasileiro, cursos da FGV e Conquer têm boa reputação.",
        },
        {
          heading: "Como apresentar certificados no currículo e LinkedIn",
          body: "Ter o certificado é apenas metade da equação. A outra metade é posicionar corretamente.\n\nNo currículo: Crie uma seção separada chamada 'Certificações' ou 'Educação Complementar'. Liste apenas os relevantes para a vaga — não coloque tudo que você tem. Um currículo com 20 certificados parece desorganizado. Selecione os 3 a 5 mais alinhados com o cargo.\n\nNo LinkedIn: Use a seção 'Licenças e certificados' para cada certificação. Inclua o link de verificação quando disponível — plataformas como Coursera e Alura emitem certificados com URL de validação. Isso aumenta credibilidade.\n\nNo portfólio: O certificado prova que você assistiu o curso. O projeto que você fez durante o curso prova que você aprendeu. Para vagas técnicas, o portfólio de projetos é mais poderoso que qualquer PDF de conclusão.",
        },
      ],
      courses: [
        {
          name: "AWS Cloud Practitioner Essentials",
          institution: "Amazon Web Services (Coursera)",
          level: "Iniciante",
          highlight: "Preparatório para a certificação AWS mais acessível. Alta demanda de mercado.",
        },
        {
          name: "Google Digital Marketing & E-commerce",
          institution: "Google (Coursera)",
          level: "Iniciante",
          highlight: "Certificado Google com peso real em vagas de marketing.",
        },
        {
          name: "Formação Full Stack",
          institution: "Rocketseat",
          level: "Intermediário",
          highlight: "Certificado reconhecido no mercado tech brasileiro. Foco em projetos reais.",
        },
        {
          name: "MBA em Gestão de Projetos",
          institution: "Conquer",
          level: "Intermediário a Avançado",
          highlight: "Referência em gestão. Certificado com peso em mercado corporativo.",
        },
      ],
      faq: [
        {
          question: "Certificado online é aceito em processos seletivos de grandes empresas?",
          answer:
            "Depende da empresa e da posição. Empresas de tecnologia aceitam amplamente — muitas valorizam mais portfólio do que diploma. Empresas tradicionais de outros setores ainda dão peso maior a graduação. A tendência é de aceitação crescente, especialmente pós-pandemia.",
        },
        {
          question: "Quantos certificados é o ideal ter no currículo?",
          answer:
            "Qualidade supera quantidade. Ter 3 certificados relevantes e reconhecidos é mais poderoso do que ter 30 certificados de plataformas diversas sem conexão com a vaga. Curadoria do que você apresenta é tão importante quanto a quantidade de cursos que você fez.",
        },
        {
          question: "Vale a pena pagar por certificado em plataformas que permitem audit gratuito?",
          answer:
            "Se você vai usar o certificado ativamente em candidaturas, sim. O audit gratuito do Coursera, por exemplo, dá acesso ao conteúdo mas não emite certificado. Se o objetivo é só aprender, audit é suficiente. Se o objetivo é credencial, o investimento no certificado se paga.",
        },
      ],
    },

    // ─── GUIA 4 (novo) ─────────────────────────────────────────────────────────
    {
      slug: "programacao-e-desenvolvimento",
      title: "Melhor Curso de Programação em 2026: Guia Completo para Iniciantes",
      eyebrow: "Guia prático — Desenvolvimento de Software",
      metaDescription:
        "Qual o melhor curso de programação em 2026? Guia completo com trilhas por linguagem, nível e objetivo. Comparativo de plataformas, preços e o que o mercado realmente paga.",
      intro:
        "Programação é a habilidade profissional com maior crescimento de demanda da última década e o mercado brasileiro de tecnologia segue com escassez de profissionais qualificados. A porta de entrada nunca foi tão acessível — mas o volume de opções de cursos criou um labirinto que paralisa quem está começando.\n\nEste guia organiza o caminho por objetivo e perfil. Não existe 'melhor linguagem' ou 'melhor plataforma' em absoluto — existe o que é melhor para o que você quer construir e onde você quer trabalhar. A partir disso, a escolha fica objetiva.",
      sections: [
        {
          heading: "Por onde começar: a escolha da primeira linguagem",
          body: "A primeira linguagem de programação não é a mais importante da sua carreira — é a que vai determinar se você fica ou desiste. Por isso, a escolha deve priorizar feedback rápido, curva de aprendizado acessível e demanda de mercado.\n\nPython: Melhor opção para quem quer versatilidade. Usado em automação, dados, IA, backend e scripts. Sintaxe legível que não pune o iniciante. Alta demanda no mercado brasileiro.\n\nJavaScript: Melhor opção para quem quer ver resultado visual rápido. Roda no navegador, o que elimina a barreira de configurar ambiente de desenvolvimento. Domina o desenvolvimento web frontend e tem presença forte no backend via Node.js.\n\nJava: Preferida por quem quer entrar em empresas grandes e corporativas. Muito usada em bancos, seguradoras e sistemas legados. Curva de aprendizado mais íngreme, mas abre portas específicas.\n\nSQL: Não é uma linguagem de programação completa, mas é obrigatório para qualquer profissional de dados, backend ou analytics. Deve entrar na trilha de qualquer programador independente da especialização.",
        },
        {
          heading: "Trilhas por objetivo de carreira",
          body: "Desenvolvimento web frontend: HTML + CSS + JavaScript -> React ou Vue -> TypeScript. Essa trilha tem alta empregabilidade e permite trabalho remoto internacional. Plataformas como Rocketseat e Alura têm as melhores trilhas nacionais para esse caminho.\n\nDesenvolvimento backend: Python (Django/FastAPI) ou Node.js (Express) ou Java (Spring Boot). Backend tem salários mais altos que frontend em média no mercado brasileiro. Exige mais familiaridade com bancos de dados, APIs e arquitetura de sistemas.\n\nDesenvolvimento mobile: React Native (JavaScript, um código para iOS e Android) ou Swift (iOS nativo) ou Kotlin (Android nativo). React Native tem a melhor relação custo-benefício de aprendizado para o mercado atual.\n\nDados e analytics: Python + SQL + pandas + visualização (matplotlib, Plotly) + uma ferramenta de BI (Power BI, Tableau). Trilha com altíssima demanda e salários acima da média em empresas que já têm cultura de dados.\n\nDevOps e cloud: Linux + Git + Docker + Kubernetes + AWS/Azure/GCP. Alta demanda, poucos profissionais qualificados, salários premium. Curva de aprendizado mais longa, mas retorno financeiro proporcional.",
        },
        {
          heading: "Como montar um portfólio que gera entrevistas",
          body: "Portfólio é o que converte aprendizado em emprego. Um portfólio fraco é a razão mais comum pela qual bons estudantes não recebem chamadas.\n\nTrês regras para um portfólio que funciona:\n\n1. Projetos com problema real: Não coloque to-do list ou calculadora de IMC. Construa algo que resolve um problema que você ou alguém próximo tem. Um sistema de controle de estoque simples para uma mercearia, um bot de Telegram para alertas, um dashboard de finanças pessoais. O contexto do problema é o que chama atenção.\n\n2. Código no GitHub com README profissional: Cada projeto deve ter um README que explica o que é, por que foi construído, como rodar localmente e quais tecnologias foram usadas. Recrutadores técnicos avaliam o README antes do código.\n\n3. Projeto ao vivo: Hospede o projeto. Vercel e Netlify são gratuitos para frontend. Railway e Render têm tier gratuito para backend. Mostrar um link ao vivo é muito mais poderoso do que mostrar só o repositório.",
        },
      ],
      courses: [
        {
          name: "Formação Python Developer",
          institution: "DIO",
          level: "Iniciante",
          highlight: "Trilha gratuita. Boa cobertura de Python para quem está partindo do zero.",
        },
        {
          name: "Discover e Ignite",
          institution: "Rocketseat",
          level: "Iniciante a Intermediário",
          highlight: "Melhor trilha de desenvolvimento web full stack em português. Comunidade ativa.",
        },
        {
          name: "Formação Front-end",
          institution: "Alura",
          level: "Iniciante a Avançado",
          highlight: "Cobertura completa com HTML, CSS, JavaScript e React. Instrutores de alto nível.",
        },
        {
          name: "The Web Developer Bootcamp",
          institution: "Udemy (Colt Steele)",
          level: "Iniciante",
          highlight: "Um dos cursos mais completos de desenvolvimento web em inglês. Frequentemente abaixo de R$ 30.",
        },
      ],
      faq: [
        {
          question: "Quanto tempo leva para conseguir o primeiro emprego como programador?",
          answer:
            "Com dedicação de 4 a 6 horas por dia, a maioria dos estudantes está pronta para vagas juniors entre 12 e 18 meses. Com dedicação parcial (2 horas diárias), espere 24 a 30 meses. Portfólio ativo e participação em comunidades reduzem esse prazo.",
        },
        {
          question: "É possível aprender programação sem faculdade?",
          answer:
            "Sim, e isso já é a norma em tecnologia. Empresas como Nubank, iFood, TOTVS e a grande maioria das startups contratam por habilidade comprovada, não por diploma. Bootcamps e trilhas online estruturadas têm produzido profissionais contratados consistentemente.",
        },
        {
          question: "Qual plataforma é melhor: Alura ou Rocketseat?",
          answer:
            "Alura tem mais amplitude de conteúdo e é melhor para quem quer explorar várias áreas de tecnologia. Rocketseat é mais focada em desenvolvimento web e mobile, com metodologia mais intensa e comunidade mais engajada. Se o objetivo é desenvolvimento web, Rocketseat tende a ter vantagem. Para diversificação, Alura.",
        },
      ],
    },

    // ─── GUIA 5 (novo) ─────────────────────────────────────────────────────────
    {
      slug: "design-e-ux",
      title: "Melhores Cursos de Design e UX em 2026",
      eyebrow: "Guia prático — Design e Experiência do Usuário",
      metaDescription:
        "Os melhores cursos de Design Gráfico e UX/UI em 2026. Compare plataformas, ferramentas e trilhas para iniciantes e profissionais. Guia com indicações reais.",
      intro:
        "Design é uma das áreas com maior confusão terminológica no mercado de cursos. Designer gráfico, UX designer, UI designer, product designer, motion designer — cada título implica habilidades diferentes e usa ferramentas diferentes. Escolher o curso errado por não entender essa distinção é um erro clássico e caro.\n\nEste guia diferencia essas trilhas, explica quais ferramentas o mercado realmente usa e indica os cursos com melhor reputação por especialidade. O objetivo é que você saia com clareza sobre qual caminho seguir e qual curso começar.",
      sections: [
        {
          heading: "As diferentes trilhas de design e o que cada uma exige",
          body: "Design Gráfico: Foco em comunicação visual para impressão e digital. Usa Illustrator, Photoshop e Canva. Demanda por freelance ainda é alta, especialmente para pequenas empresas. Mercado mais saturado para posições CLT.\n\nUX Design (User Experience): Foco no comportamento do usuário, pesquisa, wireframes e testes de usabilidade. Usa Figma, Maze e ferramentas de pesquisa qualitativa. Alta demanda em empresas de tecnologia. Exige pensamento analítico além de habilidade visual.\n\nUI Design (User Interface): Foco na interface visual de produtos digitais. Usa Figma como ferramenta central. Muito contratado em conjunto com UX — a maioria das vagas hoje busca UX/UI juntos.\n\nProduct Design: Combinação de UX, UI e estratégia de produto. Posição sênior que entende o produto como um todo. Alta remuneração, poucos profissionais qualificados.\n\nMotion Design: Animações para vídeo, apps e interfaces. Usa After Effects, Lottie e Rive. Nicho mas com alta demanda em produtos de tecnologia que querem diferenciar experiência.",
        },
        {
          heading: "Figma: por que toda trilha de UX/UI passa por aqui",
          body: "Figma é a ferramenta padrão da indústria para design de produtos digitais. Não é exagero dizer que saber Figma é pré-requisito para qualquer vaga de UI, UX ou Product Design em 2026. A Adobe comprou a Figma em 2022, mas a aquisição não foi aprovada pelos reguladores e a empresa seguiu independente — o que é bom para o ecossistema.\n\nO Figma tem um plano gratuito robusto que permite criar projetos profissionais sem custo. O aprendizado pode começar sem investimento. Cursos de Figma são abundantes — a distinção é entre cursos que ensinam a ferramenta e cursos que ensinam design usando a ferramenta. O segundo é muito mais valioso.\n\nOutras ferramentas relevantes: Adobe XD (perdendo espaço para Figma), Sketch (restrito a Mac, ainda usado em algumas empresas de tech americana), Principle e Framer (protótipos avançados com interação).",
        },
        {
          heading: "Como construir portfólio de design sem experiência comercial",
          body: "A barreira mais comum para designers iniciantes é o paradoxo do portfólio: precisa de portfólio para conseguir trabalho, mas precisa de trabalho para ter portfólio.\n\nTrês caminhos para sair desse paradoxo:\n\n1. Projetos conceituais com problema real: Redesenhe um app que você usa e considera ruim. Documente seu processo: pesquisa, identificação de problemas, wireframes, solução. O processo documentado é mais valioso do que o resultado final.\n\n2. Projetos para organizações sem fins lucrativos: ONGs, projetos comunitários e iniciativas locais frequentemente precisam de design e aceitam colaboração voluntária. Gera portfólio real com cliente real.\n\n3. Desafios de design: Plataformas como Frontendmentor, Daily UI e Dribbble têm desafios públicos com briefs definidos. Resolver e publicar a solução com documentação de processo é aceito como portfólio por muitos recrutadores.",
        },
      ],
      courses: [
        {
          name: "UI Design com Figma",
          institution: "Origamid",
          level: "Iniciante",
          highlight: "Melhor curso nacional de UI Design. Rigor técnico e estética elevada. Altamente recomendado.",
        },
        {
          name: "UX Design Professional Certificate",
          institution: "Google (Coursera)",
          level: "Iniciante",
          highlight: "7 cursos em sequência. Certificado Google reconhecido. Excelente base de UX.",
        },
        {
          name: "Formação Design Gráfico",
          institution: "Origamid",
          level: "Iniciante a Intermediário",
          highlight: "Abrange tipografia, cor, composição e ferramentas com profundidade real.",
        },
      ],
      faq: [
        {
          question: "Preciso saber desenhar para ser designer?",
          answer:
            "Não. Design digital, especialmente UX/UI, exige pensamento lógico, empatia com o usuário e habilidade com ferramentas digitais — não habilidade de desenho manual. Alguns designers têm essa habilidade, mas ela não é requisito para a área.",
        },
        {
          question: "Qual a diferença entre designer gráfico e UX designer?",
          answer:
            "Designer gráfico trabalha com comunicação visual — logos, flyers, materiais de marketing. UX designer trabalha com a experiência do usuário em produtos digitais — apps, sites, sistemas. As habilidades se sobrepõem parcialmente, mas os objetivos e ferramentas são diferentes. Vagas e salários também diferem.",
        },
        {
          question: "Quanto ganha um UX designer junior no Brasil?",
          answer:
            "Em 2026, salários de UX/UI designer junior no Brasil variam entre R$ 2.500 e R$ 5.000 para posições CLT. Em empresas de tecnologia e startups, o teto tende a ser maior. Trabalho remoto internacional para empresas estrangeiras pode pagar em dólar, com salários a partir de USD 30 por hora para freelancers.",
        },
      ],
    },

    // ─── GUIA 6 (novo) ─────────────────────────────────────────────────────────
    {
      slug: "marketing-digital",
      title: "Melhores Cursos de Marketing Digital em 2026",
      eyebrow: "Guia prático — Marketing e Growth",
      metaDescription:
        "Os melhores cursos de Marketing Digital em 2026. Do iniciante ao avançado: SEO, tráfego pago, redes sociais, email marketing e analytics. Guia com indicações reais por objetivo.",
      intro:
        "Marketing digital é uma das áreas com maior proliferação de cursos ruins do mercado. O volume de 'gurus' e formações vazias tornou a curadoria essencial. Ao mesmo tempo, é uma das áreas com maior demanda de mercado — toda empresa que vende online precisa de profissionais que entendam tráfego, conversão e retenção.\n\nA distinção crítica que este guia faz é entre marketing digital como habilidade operacional (saber rodar anúncios, publicar conteúdo, analisar métricas) e marketing digital como estratégia (entender o funil completo, atribuição, custo de aquisição e valor do cliente). Os melhores cursos desenvolvem ambos.",
      sections: [
        {
          heading: "As especialidades do marketing digital e qual aprender primeiro",
          body: "Marketing digital não é um campo único — é um guarda-chuva de especialidades com diferentes curvas de aprendizado e mercados de trabalho.\n\nSEO (Search Engine Optimization): Otimização para motores de busca. Resultado orgânico de longo prazo. Alta demanda, poucos especialistas realmente bons. Curva de aprendizado moderada, resultado lento mas composto.\n\nTráfego pago (Google Ads, Meta Ads): Resultado rápido, requer orçamento. Alta demanda de freelancers e agências. Dominar as plataformas de anúncio é uma habilidade comercializável imediatamente.\n\nMarketing de conteúdo: Produção editorial para atrair e reter audiência. Combina com SEO, redes sociais e email. Mais adequado para quem tem habilidade de escrita e pensamento editorial.\n\nEmail marketing: Uma das áreas com maior ROI comprovado no marketing digital. Subestimada por iniciantes, muito valorizada por empresas com base de clientes consolidada.\n\nAnalytics e dados: GA4, Looker Studio, análise de funil, atribuição. A especialização mais escassa e mais bem paga do marketing digital. Combina com SQL e ferramentas de BI.",
        },
        {
          heading: "O que separa um bom curso de marketing digital de um ruim",
          body: "Três sinais de um curso de marketing digital que vai entregar resultado real:\n\n1. Mostra números reais, não só teoria: Cursos bons mostram campanhas reais, resultados reais e como interpretar dados. Cursos ruins ficam em frameworks genéricos e cases hipotéticos.\n\n2. Atualizado com as plataformas atuais: Google Ads mudou significativamente com o Performance Max. Meta Ads mudou pós-iOS 14. Instagram mudou o algoritmo várias vezes. Um curso de 2022 sobre tráfego pago pode ser perigoso — vai te ensinar a operar uma plataforma que não existe mais.\n\n3. Tem foco em métricas de negócio, não só de vaidade: Curtidas e seguidores são métricas de vaidade. Custo por lead, taxa de conversão, ROAS e LTV são métricas de negócio. Cursos que só falam do primeiro grupo não vão te tornar um profissional de marketing — vão te tornar um gerenciador de redes sociais.",
        },
        {
          heading: "Certificações de marketing que o mercado reconhece",
          body: "Diferente de tecnologia, certificações de marketing têm peso variável. As que têm reconhecimento real:\n\nGoogle Ads: Certificação oficial do Google, gratuita, renovável anualmente. Critério de filtragem em muitas agências. Vale fazer mesmo que você já saiba operar a plataforma.\n\nGoogle Analytics 4: Certificação oficial. Cresceu em importância com a descontinuação do Universal Analytics. Ter essa certificação diferencia candidatos em vagas de analytics.\n\nMeta Blueprint: Certificações da Meta para Facebook e Instagram Ads. Têm peso em agências que trabalham com essas plataformas.\n\nHubSpot Academy: Gratuita. Cobre inbound marketing, email, CRM e vendas. Reconhecida em empresas B2B que usam HubSpot.",
        },
      ],
      courses: [
        {
          name: "Marketing Digital para Negócios",
          institution: "Sebrae",
          level: "Iniciante",
          highlight: "Foco em aplicação prática para empreendedores. Gratuito e direto ao ponto.",
        },
        {
          name: "Formação Marketing Digital",
          institution: "Escola DNC",
          level: "Iniciante a Intermediário",
          highlight: "Bom custo-benefício. Cobre as principais plataformas com foco em mercado de trabalho.",
        },
        {
          name: "Digital Marketing & E-commerce Certificate",
          institution: "Google (Coursera)",
          level: "Iniciante",
          highlight: "Certificado Google. Cobre o funil completo com foco em conversão e analytics.",
        },
      ],
      faq: [
        {
          question: "Dá para viver de marketing digital como freelancer?",
          answer:
            "Sim, é uma das áreas com maior demanda de freelancers no Brasil. Gestores de tráfego pago (Google e Meta Ads) têm alta procura de pequenas e médias empresas. O modelo típico é cobrança de honorário mensal mais percentual do investimento em mídia. Profissionais estabelecidos cobram entre R$ 1.500 e R$ 8.000 por cliente por mês.",
        },
        {
          question: "Qual a diferença entre gestor de tráfego e analista de marketing digital?",
          answer:
            "Gestor de tráfego é especialista em plataformas de anúncio pago (Google Ads, Meta Ads). Analista de marketing digital tem visão mais ampla do funil, incluindo orgânico, email e analytics. Em empresas menores, a mesma pessoa faz os dois. Em empresas maiores, são posições diferentes.",
        },
        {
          question: "Preciso saber programar para trabalhar com marketing digital?",
          answer:
            "Não é obrigatório, mas saber o básico de HTML, JavaScript e como funcionam APIs muda seu nível como profissional. Especialmente para implementação de tags, rastreamento avançado e integração de ferramentas. Cursos de 'marketing tech' cobrem exatamente esse gap.",
        },
      ],
    },

    // ─── GUIA 7 (novo) ─────────────────────────────────────────────────────────
    {
      slug: "dados-e-inteligencia-artificial",
      title: "Melhores Cursos de Ciência de Dados e IA em 2026",
      eyebrow: "Guia prático — Dados e Machine Learning",
      metaDescription:
        "Os melhores cursos de Ciência de Dados e Inteligência Artificial em 2026. Guia completo para iniciantes e intermediários: trilhas, ferramentas, plataformas e mercado de trabalho.",
      intro:
        "Ciência de Dados e IA são as áreas com maior crescimento de salário e demanda do mercado de tecnologia brasileiro nos últimos 3 anos. O problema é que os cursos são muito heterogêneos — alguns ensinam Python superficialmente e chamam de 'ciência de dados', outros mergulham em matemática sem aplicação prática.\n\nEste guia separa o que o mercado realmente precisa do que os cursos prometem, e orienta a escolha por nível real de conhecimento e objetivo de carreira.",
      sections: [
        {
          heading: "O mapa da área: Data Analyst, Data Scientist, ML Engineer",
          body: "São três posições distintas com habilidades e salários diferentes:\n\nData Analyst (Analista de Dados): Extrai, limpa e visualiza dados para apoiar decisões de negócio. Usa SQL, Excel, Power BI ou Tableau e algum Python básico. Ponto de entrada mais acessível. Alta demanda em empresas de todos os setores.\n\nData Scientist (Cientista de Dados): Constrói modelos preditivos e estatísticos. Usa Python avançado, machine learning (scikit-learn, XGBoost), estatística e cálculo. Requer base matemática sólida. Salários acima da média de tecnologia.\n\nML Engineer (Engenheiro de Machine Learning): Coloca modelos em produção. Combina habilidade de Data Scientist com engenharia de software — APIs, Docker, cloud, monitoramento de modelos. O perfil mais raro e mais bem pago do campo.",
        },
        {
          heading: "Trilha de aprendizado por nível",
          body: "Nível zero — sem programação: SQL primeiro. É a habilidade mais subestimada e mais demandada em dados. Com SQL, você já pode trabalhar como analista de dados em muitas empresas. Depois, Excel avançado e Power BI. Essa trilha leva 3 a 6 meses e abre mercado real.\n\nNível iniciante — sabe programar: Python com pandas e matplotlib. Limpeza de dados, análise exploratória, visualização. Depois, estatística descritiva e inferencial. Depois, primeiros modelos com scikit-learn. Essa trilha leva 6 a 12 meses.\n\nNível intermediário: Machine learning avançado, deep learning básico com TensorFlow ou PyTorch, feature engineering, validação de modelos, deploy simples com Flask ou FastAPI. Aqui entra Hugging Face e modelos pré-treinados para NLP.\n\nNível avançado: Arquiteturas de transformers, fine-tuning de LLMs, MLOps (Kubeflow, MLflow), distribuição de treinamento em GPU, produção em escala.",
        },
      ],
      courses: [
        {
          name: "IBM Data Science Professional Certificate",
          institution: "IBM (Coursera)",
          level: "Iniciante",
          highlight: "Trilha completa de 10 cursos. Certificado IBM com reconhecimento internacional.",
        },
        {
          name: "Formação Data Science",
          institution: "Alura",
          level: "Iniciante a Intermediário",
          highlight: "Melhor trilha nacional de dados. Cobertura completa em português.",
        },
        {
          name: "Deep Learning Specialization",
          institution: "DeepLearning.AI (Coursera)",
          level: "Avançado",
          highlight: "Referência mundial. Andrew Ng. Para quem quer ir fundo em redes neurais.",
        },
      ],
      faq: [
        {
          question: "Preciso de matemática para trabalhar com dados?",
          answer:
            "Para análise de dados e BI: estatística básica é suficiente. Para machine learning: álgebra linear, cálculo e probabilidade são necessários para entender o que está acontecendo nos modelos — mas existem cursos que contornam isso inicialmente.",
        },
        {
          question: "Python ou R para ciência de dados?",
          answer:
            "Python. O mercado brasileiro e internacional convergiu para Python. R tem nicho acadêmico e em algumas áreas de bioestatística, mas para o mercado de trabalho geral, Python é a escolha sem discussão.",
        },
        {
          question: "Quanto ganha um cientista de dados no Brasil?",
          answer:
            "Em 2026, salários de Data Scientist variam amplamente: juniors entre R$ 5.000 e R$ 9.000, plenos entre R$ 10.000 e R$ 18.000, sêniors acima de R$ 20.000 em empresas de tecnologia. ML Engineers tendem a ganhar mais que Data Scientists no mesmo nível de senioridade.",
        },
      ],
    },

    // ─── GUIA 8 (novo) ─────────────────────────────────────────────────────────
    {
      slug: "negocios-e-gestao",
      title: "Melhores Cursos de Gestão e Negócios em 2026",
      eyebrow: "Guia prático — Negócios e Liderança",
      metaDescription:
        "Os melhores cursos de Gestão, Liderança e Negócios em 2026. Para empreendedores e profissionais que querem crescer na carreira. Guia com plataformas, preços e indicações reais.",
      intro:
        "Gestão e negócios é uma das áreas com maior diversidade de qualidade no mercado de cursos. De um lado, MBAs de instituições tradicionais com conteúdo desatualizado e metodologia passiva. De outro, cursos práticos de empreendedores e gestores com experiência real que entregam frameworks aplicáveis.\n\nEste guia foca no que move agulha para dois perfis: o profissional que quer crescer para posições de liderança dentro de uma empresa, e o empreendedor que quer estruturar melhor o negócio próprio.",
      sections: [
        {
          heading: "O que gestão realmente envolve e o que os cursos ensinam mal",
          body: "A maioria dos cursos de gestão ensina teoria organizacional e frameworks clássicos (SWOT, PDCA, BSC) sem conectar com a realidade de gestão em 2026 — times híbridos, decisões baseadas em dados, OKRs, product thinking e agilidade como prática real.\n\nO que o mercado atual exige de um gestor ou líder:\n\nTomada de decisão com dados: Saber ler um dashboard, entender métricas de negócio e questionar números. Não precisa saber programar, mas precisa ter familiaridade com analytics.\n\nGestão de pessoas em ambiente de incerteza: Liderança servidora, feedbacks, desenvolvimento de time, retenção. Soft skills que os cursos clássicos ignoram.\n\nPlanejamento estratégico executável: Diferença entre plano que fica na gaveta e OKRs que guiam o time semana a semana.\n\nFinanças para não financeiros: Entender DRE, fluxo de caixa, margem e ponto de equilíbrio é obrigatório para qualquer gestor ou empreendedor.",
        },
        {
          heading: "MBA vale a pena em 2026?",
          body: "Depende de qual MBA e para qual objetivo.\n\nMBAs de escolas de elite (FGV, Insper, Dom Cabral, FIA): Valem pelo networking, pela credencial e pela qualidade do corpo docente. O custo é alto — entre R$ 30.000 e R$ 150.000 — e o retorno depende do seu mercado e nível de carreira atual. Para quem já está em posição de liderança e quer dar um salto, faz sentido.\n\nMBAs online de escolas médias: Custo menor, mas credencial de menor peso. Vale avaliar se o certificado vai realmente importar para o seu próximo objetivo de carreira.\n\nAlternativa ao MBA: Para empreendedores e profissionais de startups, cursos como os da Conquer, programas da Endeavor e aceleradoras entregam conteúdo mais atualizado e networking igualmente relevante a uma fração do custo.",
        },
      ],
      courses: [
        {
          name: "Formação Liderança e Gestão",
          institution: "Conquer",
          level: "Intermediário",
          highlight: "Referência em educação executiva moderna. Conteúdo aplicado com cases reais brasileiros.",
        },
        {
          name: "Empreendedorismo na Prática",
          institution: "Sebrae",
          level: "Iniciante",
          highlight: "Gratuito. Excelente base para quem está começando ou estruturando um negócio.",
        },
        {
          name: "Business Foundations Specialization",
          institution: "Wharton (Coursera)",
          level: "Iniciante a Intermediário",
          highlight: "Conteúdo da Wharton School. Finanças, marketing, operações e liderança em 4 cursos.",
        },
      ],
      faq: [
        {
          question: "Vale mais a pena fazer MBA ou cursos específicos?",
          answer:
            "Para quem tem menos de 5 anos de experiência, cursos específicos e práticos tendem a entregar mais resultado por custo. MBA faz mais sentido para quem já tem base de gestão e quer a credencial e o networking de uma instituição reconhecida.",
        },
        {
          question: "Quais habilidades de gestão têm maior demanda em 2026?",
          answer:
            "Gestão de OKRs e metas, liderança de times remotos e híbridos, tomada de decisão orientada a dados, gestão de produto (product management) e finanças para gestores. Essas habilidades cruzam gestão tradicional com as demandas de empresas de tecnologia.",
        },
      ],
    },

    // ─── GUIA 9 (novo) ─────────────────────────────────────────────────────────
    {
      slug: "idiomas",
      title: "Melhores Cursos de Idiomas Online em 2026",
      eyebrow: "Guia prático — Idiomas e Comunicação Global",
      metaDescription:
        "Os melhores cursos de inglês e outros idiomas online em 2026. Comparativo de plataformas, métodos, preços e qual realmente funciona para quem precisa de fluência profissional.",
      intro:
        "Inglês fluente é o maior multiplicador salarial disponível para profissionais brasileiros. Em tecnologia, a diferença entre trabalhar para uma empresa nacional e conseguir uma posição remota internacional — com salário em dólar — é frequentemente o inglês. Em outras áreas, abre portas para multinacionais, posições de liderança e mercado externo.\n\nO problema é que o mercado de cursos de idiomas tem a maior taxa de abandono de todas as categorias de educação. A razão principal: a maioria dos métodos não foi desenhada para adultos com rotina corrida que precisam de fluência funcional, não de perfeição gramatical. Este guia vai direto ao que funciona.",
      sections: [
        {
          heading: "Por que a maioria dos adultos não aprende inglês com cursos tradicionais",
          body: "Cursos tradicionais de idiomas foram desenhados para aprendizado linear em sala de aula, com progressão gramatical estruturada. Esse modelo funciona para crianças e adolescentes com tempo disponível. Para adultos, falha por três razões:\n\n1. Input insuficiente: Adultos precisam de horas de exposição ao idioma para internalizar estruturas. Uma aula de 1 hora por semana não gera o volume necessário.\n\n2. Foco em produção antes de compreensão: Muitos cursos forçam o aluno a falar antes de ter insumo suficiente. Isso gera ansiedade e resultados lentos.\n\n3. Contexto artificial: Aprender frases de diálogo sem contexto real de uso não gera retenção.\n\nO que funciona: imersão com input compreensível (conteúdo em inglês no seu nível atual, ligeiramente acima), prática de conversação com falantes reais ou tutores, e consistência diária mesmo que por apenas 20 a 30 minutos.",
        },
        {
          heading: "Plataformas e métodos por objetivo",
          body: "Para quem quer base e consistência diária gratuita: Duolingo funciona para manutenção e gamificação, mas não é suficiente sozinho para fluência. Combinar com podcasts, séries e leitura em inglês é obrigatório.\n\nPara conversação e fluência rápida: Preply e italki conectam com professores nativos e não-nativos para aulas 1:1. É o caminho mais rápido para fluência oral. Custo entre R$ 30 e R$ 100 por aula dependendo do professor.\n\nPara inglês de negócios e profissional: Cursos como os da Business English Pod cobrem vocabulário e situações específicas — reuniões, negociações, apresentações, emails formais. Mais eficiente do que curso geral para quem tem objetivo profissional específico.\n\nPara certificação internacional: IELTS e TOEFL são as principais. Preparatórios específicos para essas provas têm melhor resultado do que cursos gerais. British Council e Cambridge têm materiais oficiais.",
        },
      ],
      courses: [
        {
          name: "English for Career Development",
          institution: "University of Pennsylvania (Coursera)",
          level: "Intermediário",
          highlight: "Foco em inglês profissional. Certificado Penn. Ideal para transição de carreira internacional.",
        },
        {
          name: "Inglês com Duolingo + conversação",
          institution: "Duolingo / Preply",
          level: "Iniciante a Avançado",
          highlight: "Combinação custo-eficiente: Duolingo para base diária, Preply para prática de conversação real.",
        },
      ],
      faq: [
        {
          question: "Quanto tempo leva para ficar fluente em inglês?",
          answer:
            "Para nível B2 (fluência funcional para trabalho), espere de 600 a 750 horas de estudo e exposição. Com 1 hora por dia, isso é 2 anos. Com 2 a 3 horas diárias combinando estudo e consumo de conteúdo em inglês, 12 a 18 meses. Consistência é mais determinante do que o método.",
        },
        {
          question: "Vale a pena fazer curso de inglês presencial ou online é suficiente?",
          answer:
            "Online é suficiente para fluência — e muitas vezes superior pelo volume de input disponível. Aulas presenciais têm vantagem em accountability e conversação estruturada. O modelo híbrido — curso online mais aulas de conversação com tutor — é o mais eficiente em custo e resultado.",
        },
        {
          question: "Qual idioma tem maior retorno financeiro depois do inglês?",
          answer:
            "Espanhol para quem quer mercado latino-americano. Mandarim para quem trabalha com China. Alemão para mercado europeu em engenharia e indústria. Para a maioria dos brasileiros, inglês sólido tem ROI muito maior do que qualquer segundo idioma antes da fluência em inglês.",
        },
      ],
    },
  ];

  export function getGuideBySlug(slug: string): Guide | undefined {
    return guidesData.find((g) => g.slug === slug);
  }

  export function getAllGuideSlugs(): string[] {
    return guidesData.map((g) => g.slug);
  }
