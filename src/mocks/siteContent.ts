/** Mock seed, converted from the prototype's `src/mocks` with English field names. Temporary: deleted when the API ships. */
import type { SiteContent } from '@/types/content';

export const siteContentSeed: SiteContent = {
  hero: {
    eyebrow: 'INFRAMÉRICA',
    title: 'Serviços Premium do',
    titleHighlight: 'Aeroporto de Brasília',
    subtitle: 'Reserve Sala VIP, agende salas corporativas, compre cursos e solicite credenciamentos.',
    ctaLabel: 'Ver Sala VIP',
  },
  banners: [
    {
      id: 'ban-cursos',
      title: 'Capacitação aeroportuária certificada',
      subtitle: 'Cursos AVSEC, segurança operacional e credenciamento com emissão de certificado.',
      ctaLabel: 'Ver cursos',
      ctaHref: '/treinamentos',
      imageUrl: '/placeholder.svg',
      position: 1,
      active: true,
    },
    {
      id: 'ban-salavip',
      title: 'Sala VIP e salas de reunião',
      subtitle: 'Ambiente executivo com acesso controlado por QR Code.',
      ctaLabel: 'Reservar',
      ctaHref: '/#salavip',
      imageUrl: '/placeholder.svg',
      position: 2,
      active: true,
    },
    {
      id: 'ban-creditos',
      title: 'Compre créditos e treine sua equipe',
      subtitle: 'Adquira créditos e vincule pessoas aos treinamentos quando precisar.',
      ctaLabel: 'Saiba mais',
      ctaHref: '/treinamentos',
      imageUrl: '/placeholder.svg',
      position: 3,
      active: true,
    },
    {
      id: 'ban-avsec',
      title: 'Conscientização AVSEC',
      subtitle: 'Capacitação em segurança da aviação civil com certificação reconhecida.',
      ctaLabel: 'Saiba mais',
      ctaHref: '/treinamentos/conscientizacao-avsec',
      imageUrl: '/placeholder.svg',
      position: 4,
      active: true,
    },
    {
      id: 'ban-combo',
      title: 'Combo AVSEC + Segurança Operacional',
      subtitle: 'Duas certificações, uma única matrícula com condição especial.',
      ctaLabel: 'Saiba mais',
      ctaHref: '/treinamentos/combo-avsec-seguranca-operacional',
      imageUrl: '/placeholder.svg',
      position: 5,
      active: true,
    },
  ],
  contact: {
    email: 'atendimento@inframerica.com',
    phone: '+55 61 3364-9000',
    address: 'Aeroporto Internacional de Brasília — Lago Sul/DF, CEP 71608-900',
  },
  faq: [
    {
      question: 'Como recebo o certificado do curso?',
      answer: 'O certificado é emitido automaticamente após a conclusão do curso e fica disponível na área do cliente.',
    },
    {
      question: 'Posso transferir uma vaga para outra pessoa?',
      answer: 'Sim, enquanto a vaga não tiver sido iniciada é possível trocar a pessoa vinculada na área do cliente.',
    },
  ],
  about:
    'A Inframérica reúne os serviços de credenciamento, capacitação e conveniência do Aeroporto Internacional de Brasília em um único canal digital.',
  updatedAt: '2026-09-01T12:00:00Z',
};
