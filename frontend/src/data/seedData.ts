import { User, Event, Workshop, Enrollment, Attendance, HomeBanner, SystemLog, FinancialExpense } from '../types';

export const SEEDED_USERS: User[] = [
  {
    id: 'user_root',
    name: 'Super Administrador Root',
    email: 'admin.root@camporeal.edu.br',
    role: 'ROOT',
    course: 'Tecnologia da Informação',
    period: 'Superuser'
  },
  {
    id: 'user_coord',
    name: 'Coordenador Gigi',
    email: 'gigi@camporeal.edu.br',
    role: 'COORDENADOR',
    course: 'Engenharia de Software',
    period: 'Colegiado'
  },
  {
    id: 'user_prof1',
    name: 'Enrique Augusto da Roza',
    email: 'enrique.prof@camporeal.edu.br',
    role: 'PROFESSOR',
    course: 'Engenharia de Software'
  },
  {
    id: 'user_prof2',
    name: 'Adriana Cristina Loli',
    email: 'adriana.prof@camporeal.edu.br',
    role: 'PROFESSOR',
    course: 'Medicina'
  },
  {
    id: 'user_aluno',
    name: 'Guilherme Rossoni',
    email: 'engs-guilhermerossoni@camporeal.edu.br',
    role: 'ALUNO',
    ra: '202611029',
    course: 'Engenharia de Software',
    period: '7º Período'
  },
  {
    id: 'user_aluno2',
    name: 'Anne Gabrielly',
    email: 'engs-anneantunes@camporeal.edu.br',
    role: 'ALUNO',
    ra: '202509121',
    course: 'Engenharia de Software',
    period: '7º Período'
  }
];

export const SEEDED_EVENTS: Event[] = [
  {
    id: 'event_ia_futuro',
    name: 'Inteligência Artificial e o Futuro',
    description: 'Explore como os novos modelos de IA generativa e redes neurais profundas estão moldando o mercado de trabalho, o desenvolvimento de software e a ética na sociedade atual. Um evento imperdível com palestrantes renomados do setor técnico.',
    banner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    location: 'Auditório Central, Bloco 3',
    startDate: '2026-10-10',
    endDate: '2026-10-10',
    startTime: '19:00',
    endTime: '22:30',
    category: 'PALESTRA',
    maxParticipants: 150,
    status: 'PUBLICADO',
    creatorId: 'user_prof1',
    creatorName: 'Dra. Patricia Medeiros',
    isFeatured: true,
    price: 0
  },
  {
    id: 'event_sem_adm',
    name: 'Semana Acadêmica de Administração',
    description: 'A 15ª Semana de Administração da Campo Real reúne líderes de startups, gestores de grandes corporates e investidores de risco para discutir gestão ágil, ESG, marketing digital e estratégias de turnaround corporativo.',
    banner: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800',
    location: 'Auditório Central e Salas de Debate',
    startDate: '2026-10-11',
    endDate: '2026-10-13',
    startTime: '19:00',
    endTime: '23:00',
    category: 'SEMANA ACADÊMICA',
    maxParticipants: 200,
    status: 'PUBLICADO',
    creatorId: 'user_coord',
    creatorName: 'Roberto de Almeida',
    isFeatured: true,
    price: 25.0 // Academic week fee
  },
  {
    id: 'event_congresso_med',
    name: 'Congresso de Medicina',
    description: 'Discussões científicas aprofundadas sobre bioética, novas tecnologias cirúrgicas assistidas por robótica, medicina nuclear, avanços cardiológicos e workshops práticos em laboratórios de simulação biológica avançada.',
    banner: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    location: 'Teatro Municipal de Guarapuava',
    startDate: '2026-11-05',
    endDate: '2026-11-07',
    startTime: '08:00',
    endTime: '18:00',
    category: 'CONGRESSO',
    maxParticipants: 350,
    status: 'PUBLICADO',
    creatorId: 'user_prof2',
    creatorName: 'Dr. Leonardo Ramos',
    isFeatured: true,
    price: 60.0
  },
  {
    id: 'event_design_thinking',
    name: 'Design Thinking na Prática',
    description: 'Aprenda o framework completo de design thinking com dinâmicas imersivas focadas na ideação rápida, empatia de mercado e prototipagem física e digital para criação de soluções reais centradas em usuários.',
    banner: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    location: 'Sala de Inovação, Bloco 2',
    startDate: '2026-10-22',
    endDate: '2026-10-22',
    startTime: '14:00',
    endTime: '18:00',
    category: 'WORKSHOP',
    maxParticipants: 40,
    status: 'PUBLICADO',
    creatorId: 'user_prof1',
    creatorName: 'Dra. Patricia Medeiros',
    isFeatured: false,
    price: 15.0
  },
  {
    id: 'event_opensource_palestra',
    name: 'Palestra acadêmica sobre sistemas OpenSource',
    description: 'Venha compreender o poder das soluções colaborativas. Desbravando Linux, licenças GNU, contribuições para GitHub e o impacto do ecossistema aberto no barateamento e avanço tecnológico mundial.',
    banner: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=800',
    location: 'Auditório Central, Bloco 2',
    startDate: '2026-06-07',
    endDate: '2026-06-07',
    startTime: '19:00',
    endTime: '21:30',
    category: 'PALESTRA',
    maxParticipants: 100,
    status: 'PUBLICADO',
    creatorId: 'user_prof1',
    creatorName: 'Dra. Patricia Medeiros',
    isFeatured: false,
    price: 0
  },
  {
    id: 'event_softweek',
    name: '2a SOFTWEEK - Semana Tecnológica',
    description: 'A segunda semana de Engenharia de Software da Campo Real, contendo maratona de programação, palestras sobre arquiteturas distribuídas e dezenas de minicursos aplicados diretamente em nossos laboratórios.',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    location: 'Laboratórios 1, 2, 3, 4 e COLAB',
    startDate: '2026-10-10',
    endDate: '2026-10-15',
    startTime: '19:00',
    endTime: '22:40',
    category: 'SEMANA ACADÊMICA',
    maxParticipants: 180,
    status: 'PUBLICADO',
    creatorId: 'user_coord',
    creatorName: 'Roberto de Almeida',
    isFeatured: false,
    price: 10.0
  },
  {
    id: 'event_web_rust',
    name: 'Desenvolvimento Web Moderno com Rust',
    description: 'Aprenda marcos teóricos e práticos para concepção de APIs REST utilizando a velocidade e a segurança do compilador da linguagem de programação Rust de maneira simples.',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    location: 'Laboratório 2',
    startDate: '2026-11-21',
    endDate: '2026-11-21',
    startTime: '14:00',
    endTime: '17:30',
    category: 'WORKSHOP',
    maxParticipants: 35,
    status: 'ANALISE', // Waiting for Approval by Coordinate!
    creatorId: 'user_prof1',
    creatorName: 'Dra. Patricia Medeiros',
    isFeatured: false,
    price: 20.0
  }
];

export const SEEDED_WORKSHOPS: Workshop[] = [
  // Core workshops tied to the Event 'Inteligência Artificial e o Futuro'
  {
    id: 'ws_ia_prompting',
    eventId: 'event_ia_futuro',
    name: 'Engenharia de Prompt para Cientistas de Dados',
    description: 'Aprenda metodologias avançadas (Few-Shot, Chain-of-Thought) para extrair o potencial ideal de modelos de Large Language Models no seu dia a dia profissional.',
    instructor: 'Dra. Patricia Medeiros',
    date: '2026-10-10',
    time: '14:00',
    maxParticipants: 30,
    price: 10.0,
    enrolledCount: 15
  },
  {
    id: 'ws_ia_vision',
    eventId: 'event_ia_futuro',
    name: 'Hands-on Vision Transformers e YOLO v8',
    description: 'Laboratório aplicado de Visão Computacional para detecção de objetos em tempo real em câmeras de monitoramento institucional.',
    instructor: 'Dr. Leonardo Ramos',
    date: '2026-10-10',
    time: '16:30',
    maxParticipants: 25,
    price: 15.0,
    enrolledCount: 8
  },

  // Workshops for Admin Week
  {
    id: 'ws_adm_agile',
    eventId: 'event_sem_adm',
    name: 'Metodologias Ágeis em Startups Tech-Leads',
    description: 'Domine Scrum, Kanban e OKRs na prática desenhando ciclos trimestrais para times ágeis integrados.',
    instructor: 'Roberto de Almeida',
    date: '2026-10-11',
    time: '15:00',
    maxParticipants: 40,
    price: 0,
    enrolledCount: 22
  },
  {
    id: 'ws_adm_valuation',
    eventId: 'event_sem_adm',
    name: 'Valuations de Startups e Rodadas de Venture Capital',
    description: 'Aprenda a precificar projetos inovadores através do fluxo de caixa descontado e múltiplos de mercado no valuation.',
    instructor: 'Dr. Leonardo Ramos',
    date: '2026-10-12',
    time: '14:00',
    maxParticipants: 30,
    price: 20.0,
    enrolledCount: 12
  },

  // Workshops for Medical Congress
  {
    id: 'ws_med_sutura',
    eventId: 'event_congresso_med',
    name: 'Minicurso Prático de Técnicas em Sutura Avançada',
    description: 'Prática de sutura, nós cirúrgicos e pontos especiais utilizando simuladores biológicos de última geração no Centro da Campo Real.',
    instructor: 'Dr. Leonardo Ramos',
    date: '2026-11-06',
    time: '09:00',
    maxParticipants: 20,
    price: 35.0,
    enrolledCount: 18
  },
  {
    id: 'ws_med_uti',
    eventId: 'event_congresso_med',
    name: 'Workshop de Urgência e Emergência em UTI Neonatal',
    description: 'Instrução crítica de intubação, suporte básico de vida e tratamento de intercorrências cardíacas em recém-nascidos.',
    instructor: 'Dra. Patricia Medeiros',
    date: '2026-11-07',
    time: '10:30',
    maxParticipants: 15,
    price: 40.0,
    enrolledCount: 14
  }
];

export const SEEDED_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enroll_01',
    userId: 'user_aluno2',
    userEmail: 'ana.vieira@aluno.camporeal.edu.br',
    userName: 'Ana Cláudia Vieira',
    userRa: '202509121',
    eventId: 'event_ia_futuro',
    eventName: 'Inteligência Artificial e o Futuro',
    selectedWorkshops: ['ws_ia_prompting'],
    totalValue: 10.0,
    status: 'APROVADO',
    createdAt: '2026-05-20T14:30:00Z'
  },
  {
    id: 'enroll_02',
    userId: 'user_aluno2',
    userEmail: 'ana.vieira@aluno.camporeal.edu.br',
    userName: 'Ana Cláudia Vieira',
    userRa: '202509121',
    eventId: 'event_sem_adm',
    eventName: 'Semana Acadêmica de Administração',
    selectedWorkshops: ['ws_adm_agile'],
    totalValue: 25.0,
    status: 'PENDENTE',
    createdAt: '2026-05-24T18:20:00Z'
  },
  {
    id: 'enroll_demo_gui',
    userId: 'user_aluno',
    userEmail: 'guiiwtf1@gmail.com',
    userName: 'Guilherme Silva Santos',
    userRa: '202611029',
    eventId: 'event_opensource_palestra',
    eventName: 'Palestra acadêmica sobre sistemas OpenSource',
    selectedWorkshops: [],
    totalValue: 0.0,
    status: 'APROVADO',
    createdAt: '2026-05-22T10:15:00Z'
  }
];

export const SEEDED_ATTENDANCE: Attendance[] = [
  {
    id: 'att_01',
    userId: 'user_aluno2',
    userName: 'Ana Cláudia Vieira',
    userEmail: 'ana.vieira@aluno.camporeal.edu.br',
    userRa: '202509121',
    eventId: 'event_ia_futuro',
    checkedInAt: '2026-10-10T19:15:02Z',
    checkedInBy: 'Dra. Patricia Medeiros'
  },
  {
    id: 'att_02',
    userId: 'user_aluno',
    userName: 'Guilherme Silva Santos',
    userEmail: 'guiiwtf1@gmail.com',
    userRa: '202611029',
    eventId: 'event_opensource_palestra',
    checkedInAt: '2026-06-07T19:10:00Z',
    checkedInBy: 'Dra. Patricia Medeiros'
  }
];

export const SEEDED_BANNERS: HomeBanner[] = [
  {
    id: 'banner_01',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    title: 'OS MELHORES EVENTOS COMEÇAM AQUI',
    subtitle: 'Conecte-se, aprenda e viva experiências incríveis na Campo Real.',
    linkToEventId: 'event_ia_futuro',
    isActive: true
  },
  {
    id: 'banner_02',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
    title: 'SEMANA ACADÊMICA DE ADMINISTRAÇÃO',
    subtitle: 'Aprenda com líderes do ecossistema e expanda seu networking.',
    linkToEventId: 'event_sem_adm',
    isActive: true
  }
];

export const SEEDED_LOGS: SystemLog[] = [
  {
    id: 'log_01',
    action: 'CREATE_EVENT',
    userEmail: 'roberto.coordenador@camporeal.edu.br',
    userRole: 'COORDENADOR',
    details: 'Coordenador criou o evento: "Semana Acadêmica de Administração"',
    timestamp: '2026-05-18T10:00:00Z'
  },
  {
    id: 'log_02',
    action: 'APPROVE_EVENT',
    userEmail: 'roberto.coordenador@camporeal.edu.br',
    userRole: 'COORDENADOR',
    details: 'Coordenador aprovou o evento: "Inteligência Artificial e o Futuro"',
    timestamp: '2026-05-19T09:12:00Z'
  },
  {
    id: 'log_03',
    action: 'USER_REGISTER',
    userEmail: 'ana.vieira@aluno.camporeal.edu.br',
    userRole: 'ALUNO',
    details: 'Nova conta de Aluno registrada: Ana Cláudia Vieira',
    timestamp: '2026-05-20T14:15:00Z'
  }
];

export const SEEDED_EXPENSES: FinancialExpense[] = [
  {
    id: 'exp_01',
    eventId: 'event_sem_adm',
    eventName: 'Semana Acadêmica de Administração',
    description: 'Coquetel e Coffee Break de Abertura',
    category: 'REFEICAO',
    value: 1500,
    type: 'DESPESA',
    date: '2026-10-11',
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 'exp_02',
    eventId: 'event_sem_adm',
    eventName: 'Semana Acadêmica de Administração',
    description: 'Pastas, Crachás e Canetas Customizadas',
    category: 'MARKETING',
    value: 600,
    type: 'DESPESA',
    date: '2026-10-10',
    createdAt: '2026-05-20T11:00:00Z'
  },
  {
    id: 'exp_03',
    eventId: 'event_sem_adm',
    eventName: 'Semana Acadêmica de Administração',
    description: 'Honorários Palestrante Dr. Paulo',
    category: 'PALESTRANTE',
    value: 2000,
    type: 'DESPESA',
    date: '2026-10-12',
    createdAt: '2026-05-20T12:00:00Z'
  },
  {
    id: 'exp_03_patroc',
    eventId: 'event_sem_adm',
    eventName: 'Semana Acadêmica de Administração',
    description: 'Patrocínio Faculdade e Cooperativa Sicredi',
    category: 'PATROCINIO',
    value: 3000,
    type: 'ENTRADA',
    date: '2026-10-10',
    createdAt: '2026-05-20T12:15:00Z'
  },
  {
    id: 'exp_04',
    eventId: 'event_congresso_med',
    eventName: 'Congresso de Medicina',
    description: 'Buffet Completo Pró-Gourmet (3 Dias)',
    category: 'REFEICAO',
    value: 3500,
    type: 'DESPESA',
    date: '2026-11-05',
    createdAt: '2026-05-20T13:00:00Z'
  },
  {
    id: 'exp_05',
    eventId: 'event_congresso_med',
    eventName: 'Congresso de Medicina',
    description: 'Kits para Oficina Congênita Avançada',
    category: 'INFRAESTRUTURA',
    value: 2800,
    type: 'DESPESA',
    date: '2026-11-04',
    createdAt: '2026-05-20T14:00:00Z'
  },
  {
    id: 'exp_06',
    eventId: 'event_congresso_med',
    eventName: 'Congresso de Medicina',
    description: 'Locação de Monitores de UTI Avançados para Workshops',
    category: 'SERVICOS',
    value: 5000,
    type: 'DESPESA',
    date: '2026-11-05',
    createdAt: '2026-05-20T15:00:00Z'
  },
  {
    id: 'exp_06_spons',
    eventId: 'event_congresso_med',
    eventName: 'Congresso de Medicina',
    description: 'Patrocínio Master - Laboratório Unimed',
    category: 'PATROCINIO',
    value: 8000,
    type: 'ENTRADA',
    date: '2026-11-03',
    createdAt: '2026-05-20T15:30:00Z'
  },
  {
    id: 'exp_07',
    eventId: 'event_ia_futuro',
    eventName: 'Inteligência Artificial e o Futuro',
    description: 'Brindes e Adesivos Devs',
    category: 'MARKETING',
    value: 450,
    type: 'DESPESA',
    date: '2026-10-09',
    createdAt: '2026-05-20T16:00:00Z'
  }
];

