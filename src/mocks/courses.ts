/** Mock seed, converted from the prototype's `src/mocks` with English field names. Temporary: deleted when the API ships. */
import type { Course } from '@/types/catalog';

export const coursesSeed: Course[] = [
  {
    id: 'cur-1',
    slug: 'conscientizacao-avsec',
    title: 'Conscientização com AVSEC (Aviation Security)',
    description:
      'Curso de conscientização em segurança da aviação civil, abordando ameaças e procedimentos preventivos.',
    longDescription:
      'Capacitação em conscientização AVSEC voltada para todos os profissionais que atuam no ambiente aeroportuário. Aborda conceitos fundamentais de segurança contra atos de interferência ilícita, procedimentos de identificação de ameaças e protocolos preventivos conforme regulamentação da ANAC.',
    category: 'Segurança da Aviação',
    sectorId: 'set-avsec',
    credentialIds: ['cred-avsec', 'cred-aeroportuaria'],
    modality: 'online',
    duration: '8h',
    price: 185,
    originalPrice: null,
    certificate: true,
    nextDate: '15/04/2025',
    spotsLeft: 30,
    imageUrl: '/images/courses/curso-avsec-consciencia.webp',
    students: 3200,
    rating: 4.8,
    reviews: 156,
    modules: 4,
    learningPoints: [
      'Fundamentos de segurança da aviação civil (AVSEC)',
      'Identificação de ameaças e comportamentos suspeitos',
      'Procedimentos preventivos em áreas restritas',
      'Legislação ANAC e normas internacionais ICAO',
    ],
    targetAudience: [
      'Profissionais de segurança aeroportuária',
      'Funcionários com acesso a áreas restritas',
      'Colaboradores de empresas aéreas',
    ],
    prerequisites: ['Ensino médio completo'],
    curriculum: [
      {
        title: 'Módulo 1: Introdução à Segurança AVSEC',
        lessons: [
          {
            title: 'Conceitos fundamentais de AVSEC',
            duration: '1h 30m',
            free: true,
          },
          {
            title: 'Tipos de ameaças à aviação civil',
            duration: '1h',
          },
        ],
      },
      {
        title: 'Módulo 2: Procedimentos Preventivos',
        lessons: [
          {
            title: 'Identificação de comportamentos suspeitos',
            duration: '1h 30m',
          },
          {
            title: 'Protocolos de comunicação de ameaças',
            duration: '1h',
          },
          {
            title: 'Avaliação final',
            duration: '30m',
          },
        ],
      },
    ],
    instructor: 'Cap. Roberto Alves',
    instructorRole: 'Especialista em Segurança da Aviação Civil',
    instructorBio:
      'Com mais de 18 anos de experiência em segurança aeroportuária, o Cap. Roberto Alves é referência nacional em AVSEC. Atuou como consultor da ANAC e instrutor credenciado pela ICAO.',
    instructorCourses: 5,
    instructorStudents: 4200,
    active: true,
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'cur-2',
    slug: 'seguranca-operacional-basico',
    title: 'Geral e Básico para a Segurança Operacional',
    description: 'Fundamentos gerais e básicos da segurança operacional em ambiente aeroportuário.',
    longDescription:
      'Curso introdutório que aborda os fundamentos da segurança operacional no ambiente aeroportuário, incluindo procedimentos gerais, normas regulatórias e boas práticas para garantir a segurança nas operações diárias do aeroporto.',
    category: 'Segurança da Aviação',
    sectorId: 'set-operacional',
    credentialIds: ['cred-aeroportuaria'],
    modality: 'online',
    duration: '12h',
    price: 185,
    originalPrice: null,
    certificate: true,
    nextDate: '20/04/2025',
    spotsLeft: 30,
    imageUrl: '/images/courses/curso-seguranca-operacional.webp',
    students: 2800,
    rating: 4.7,
    reviews: 112,
    modules: 5,
    learningPoints: [
      'Fundamentos da segurança operacional aeroportuária',
      'Procedimentos gerais de segurança em solo',
      'Normas regulatórias da ANAC',
      'Gestão de riscos operacionais',
      'Boas práticas de segurança no ambiente de trabalho',
    ],
    targetAudience: [
      'Novos profissionais da aviação',
      'Operadores de rampa e pátio',
      'Auxiliares de operações aeroportuárias',
    ],
    prerequisites: ['Ensino médio completo'],
    curriculum: [
      {
        title: 'Módulo 1: Introdução à Segurança Operacional',
        lessons: [
          {
            title: 'Visão geral da segurança em aeroportos',
            duration: '1h 30m',
            free: true,
          },
          {
            title: 'Regulamentações e normas vigentes',
            duration: '1h',
          },
        ],
      },
      {
        title: 'Módulo 2: Procedimentos Operacionais',
        lessons: [
          {
            title: 'Procedimentos de segurança em solo',
            duration: '2h',
          },
          {
            title: 'Gestão de riscos e prevenção',
            duration: '1h 30m',
          },
          {
            title: 'Avaliação final',
            duration: '45m',
          },
        ],
      },
    ],
    instructor: 'Eng. Maria Santos',
    instructorRole: 'Engenheira de Segurança Operacional',
    instructorBio:
      'Engenheira civil com MBA em Gestão Aeroportuária. Mais de 12 anos de experiência em segurança operacional em grandes aeroportos brasileiros.',
    instructorCourses: 3,
    instructorStudents: 2800,
    active: true,
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'cur-3',
    slug: 'direcao-defensiva-aeroportos',
    title: 'Direção Defensiva em Aeroportos (DDA)',
    description: 'Capacitação em direção defensiva para operadores de veículos em áreas operacionais do aeroporto.',
    longDescription:
      'Programa de capacitação em direção defensiva voltado especificamente para o ambiente aeroportuário. Aborda técnicas de condução segura em pátio de aeronaves, vias de serviço e áreas operacionais, com foco na prevenção de acidentes e conformidade com normas de circulação interna.',
    category: 'Operações de Pátio',
    sectorId: 'set-direcao',
    credentialIds: ['cred-atr'],
    modality: 'online',
    duration: '16h',
    price: 350,
    originalPrice: null,
    certificate: true,
    nextDate: '05/05/2025',
    spotsLeft: 20,
    imageUrl: '/images/courses/curso-direcao-defensiva.webp',
    students: 1500,
    rating: 4.6,
    reviews: 89,
    modules: 6,
    learningPoints: [
      'Técnicas de direção defensiva em aeroportos',
      'Normas de circulação em pátio de aeronaves',
      'Sinalização e procedimentos em vias de serviço',
      'Prevenção de acidentes com veículos e aeronaves',
      'Legislação aplicável a veículos em área operacional',
    ],
    targetAudience: [
      'Operadores de veículos em área operacional',
      'Motoristas de apoio de solo',
      'Profissionais de ground handling',
    ],
    prerequisites: ['CNH válida categoria B ou superior', 'Ensino médio completo'],
    curriculum: [
      {
        title: 'Módulo 1: Fundamentos de Direção Defensiva',
        lessons: [
          {
            title: 'Conceitos de direção defensiva',
            duration: '2h',
            free: true,
          },
          {
            title: 'Riscos específicos do ambiente aeroportuário',
            duration: '1h 30m',
          },
        ],
      },
      {
        title: 'Módulo 2: Circulação em Área Operacional',
        lessons: [
          {
            title: 'Sinalização e normas de trânsito interno',
            duration: '2h',
          },
          {
            title: 'Procedimentos de circulação em pátio',
            duration: '2h',
          },
          {
            title: 'Avaliação prática',
            duration: '1h',
          },
        ],
      },
    ],
    instructor: 'Instr. Paulo Mendes',
    instructorRole: 'Instrutor de Segurança Viária Aeroportuária',
    instructorBio:
      'Instrutor certificado com 15 anos de experiência em segurança viária em ambiente aeroportuário. Especialista em direção defensiva e prevenção de acidentes em áreas operacionais.',
    instructorCourses: 4,
    instructorStudents: 1500,
    active: true,
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'cur-4',
    slug: 'combo-avsec-seguranca-operacional',
    title: 'COMBO: Conscientização AVSEC + Segurança Operacional',
    description: 'Pacote combinado dos cursos de Conscientização AVSEC e Geral e Básico para Segurança Operacional.',
    longDescription:
      'Pacote combinado que reúne os cursos de Conscientização com AVSEC (Aviation Security) e Geral e Básico para a Segurança Operacional. Ideal para profissionais que precisam de ambas as certificações, oferecendo um valor diferenciado em relação à compra individual dos cursos.',
    category: 'Segurança da Aviação',
    sectorId: 'set-avsec',
    credentialIds: ['cred-avsec', 'cred-aeroportuaria'],
    modality: 'online',
    duration: '20h',
    price: 370,
    originalPrice: null,
    certificate: true,
    nextDate: '15/04/2025',
    spotsLeft: 30,
    imageUrl: '/images/courses/curso-combo-avsec.webp',
    students: 1800,
    rating: 4.8,
    reviews: 94,
    modules: 9,
    learningPoints: [
      'Fundamentos de AVSEC e segurança operacional',
      'Identificação de ameaças e procedimentos preventivos',
      'Normas regulatórias da ANAC',
      'Gestão de riscos operacionais',
      'Procedimentos de segurança em áreas restritas',
    ],
    targetAudience: [
      'Profissionais que necessitam de ambas as certificações',
      'Novos colaboradores do ambiente aeroportuário',
      'Funcionários em renovação de credenciamento',
    ],
    prerequisites: ['Ensino médio completo'],
    curriculum: [
      {
        title: 'Módulo 1: Conscientização AVSEC',
        lessons: [
          {
            title: 'Conceitos fundamentais de AVSEC',
            duration: '1h 30m',
            free: true,
          },
          {
            title: 'Ameaças à aviação civil',
            duration: '1h',
          },
          {
            title: 'Procedimentos preventivos',
            duration: '1h 30m',
          },
        ],
      },
      {
        title: 'Módulo 2: Segurança Operacional Básica',
        lessons: [
          {
            title: 'Fundamentos da segurança operacional',
            duration: '2h',
          },
          {
            title: 'Procedimentos gerais de segurança',
            duration: '1h 30m',
          },
          {
            title: 'Gestão de riscos',
            duration: '1h',
          },
          {
            title: 'Avaliação final combinada',
            duration: '1h',
          },
        ],
      },
    ],
    instructor: 'Cap. Roberto Alves',
    instructorRole: 'Especialista em Segurança da Aviação Civil',
    instructorBio:
      'Com mais de 18 anos de experiência em segurança aeroportuária, o Cap. Roberto Alves é referência nacional em AVSEC e segurança operacional.',
    instructorCourses: 5,
    instructorStudents: 4200,
    active: true,
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'cur-5',
    slug: 'equipamentos-checkins-gates-sita',
    title: 'Equipamentos de Check-ins e Gates — SITA',
    description: 'Treinamento operacional nos equipamentos SITA de check-in e gates utilizados no aeroporto.',
    longDescription:
      'Treinamento técnico e operacional focado nos equipamentos SITA utilizados nos balcões de check-in e portões de embarque do aeroporto. Aborda operação, troubleshooting básico e procedimentos padrão para garantir eficiência no atendimento ao passageiro.',
    category: 'Operações de Pátio',
    sectorId: 'set-tecnologia',
    credentialIds: ['cred-sita'],
    modality: 'online',
    duration: '8h',
    price: 0.01,
    originalPrice: null,
    certificate: true,
    nextDate: '22/04/2025',
    spotsLeft: 30,
    imageUrl: '/images/courses/curso-checkins-sita.webp',
    students: 950,
    rating: 4.5,
    reviews: 67,
    modules: 3,
    learningPoints: [
      'Operação de equipamentos SITA de check-in',
      'Sistemas de leitura de cartões de embarque',
      'Troubleshooting básico de equipamentos',
      'Procedimentos padrão de atendimento com SITA',
    ],
    targetAudience: ['Atendentes de check-in', 'Agentes de embarque', 'Supervisores de atendimento ao passageiro'],
    prerequisites: ['Vínculo com empresa operadora do aeroporto'],
    curriculum: [
      {
        title: 'Módulo 1: Sistemas SITA — Visão Geral',
        lessons: [
          {
            title: 'Introdução aos equipamentos SITA',
            duration: '1h',
            free: true,
          },
          {
            title: 'Interface e funcionalidades',
            duration: '1h 30m',
          },
        ],
      },
      {
        title: 'Módulo 2: Operação Prática',
        lessons: [
          {
            title: 'Check-in e emissão de cartão de embarque',
            duration: '2h',
          },
          {
            title: 'Operação de gates de embarque',
            duration: '1h 30m',
          },
          {
            title: 'Troubleshooting e procedimentos',
            duration: '1h',
          },
        ],
      },
    ],
    instructor: 'Téc. André Nascimento',
    instructorRole: 'Técnico Especialista em Sistemas SITA',
    instructorBio:
      'Técnico certificado SITA com 10 anos de experiência na operação e manutenção de equipamentos de check-in e gates em aeroportos brasileiros.',
    instructorCourses: 2,
    instructorStudents: 950,
    active: true,
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'cur-6',
    slug: 'locacao-auditorio',
    title: 'Locação Auditório',
    description: 'Locação de auditório equipado para treinamentos, palestras e eventos corporativos no aeroporto.',
    longDescription:
      'Serviço de locação de auditório totalmente equipado localizado no complexo do Aeroporto de Brasília. Ideal para treinamentos corporativos, palestras, workshops e eventos empresariais. O espaço conta com projetor, sistema de som, ar-condicionado e capacidade para até 50 pessoas.',
    category: 'Gestão e Liderança',
    sectorId: 'set-infra',
    credentialIds: [],
    modality: 'in_person',
    duration: '8h',
    price: 300,
    originalPrice: null,
    certificate: false,
    nextDate: 'Sob demanda',
    spotsLeft: 50,
    imageUrl: '/images/courses/curso-auditorio.webp',
    students: 400,
    rating: 4.9,
    reviews: 32,
    modules: 1,
    learningPoints: [
      'Espaço equipado com projetor e sistema de som',
      'Capacidade para até 50 pessoas',
      'Ar-condicionado e iluminação adequada',
      'Localizado no complexo do aeroporto',
    ],
    targetAudience: [
      'Empresas que necessitam de espaço para treinamentos',
      'Organizadores de eventos corporativos',
      'Instrutores e palestrantes',
    ],
    prerequisites: ['Agendamento prévio necessário'],
    curriculum: [
      {
        title: 'Informações do Espaço',
        lessons: [
          {
            title: 'Capacidade e equipamentos disponíveis',
            duration: '—',
          },
          {
            title: 'Regras de uso e agendamento',
            duration: '—',
          },
        ],
      },
    ],
    instructor: 'Coord. Administrativa',
    instructorRole: 'Coordenação de Espaços e Eventos',
    instructorBio:
      'Equipe de coordenação administrativa responsável pela gestão dos espaços de treinamento e eventos do Aeroporto de Brasília.',
    instructorCourses: 1,
    instructorStudents: 400,
    active: true,
    updatedAt: '2026-09-01T12:00:00Z',
  },
];
