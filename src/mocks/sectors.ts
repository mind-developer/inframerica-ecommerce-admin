/** Mock seed, converted from the prototype's `src/mocks` with English field names. Temporary: deleted when the API ships. */
import type { Sector } from '@/types/sectors';

export const sectorsSeed: Sector[] = [
  {
    id: 'set-avsec',
    name: 'Segurança da Aviação (AVSEC)',
    description: 'Cursos de conscientização e procedimentos de segurança contra atos de interferência ilícita.',
    manager: 'Cap. Roberto Alves',
    active: true,
  },
  {
    id: 'set-operacional',
    name: 'Segurança Operacional',
    description: 'Cursos voltados para operações em pista, pátio e áreas restritas.',
    manager: 'Eng. Marina Costa',
    active: true,
  },
  {
    id: 'set-direcao',
    name: 'Direção e Movimentação',
    description: 'Direção defensiva e condução de veículos em ambiente aeroportuário.',
    manager: 'Inst. Carlos Mendes',
    active: true,
  },
  {
    id: 'set-tecnologia',
    name: 'Tecnologia e Sistemas',
    description: 'Operação de equipamentos SITA, check-in, gates e sistemas embarcados.',
    manager: 'Tec. Júlia Ramos',
    active: true,
  },
  {
    id: 'set-infra',
    name: 'Infraestrutura e Eventos',
    description: 'Locação de auditórios, salas e infraestrutura para treinamentos.',
    manager: 'Adm. Pedro Lima',
    active: true,
  },
];
