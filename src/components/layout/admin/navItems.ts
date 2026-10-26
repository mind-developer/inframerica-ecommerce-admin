import {
  BadgeCheck,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  Image,
  LayoutDashboard,
  Receipt,
  Send,
  Settings,
  ShieldCheck,
  Ticket,
  UserCircle,
} from 'lucide-react';
import type { Route } from 'next';

export const NAV_ITEMS: { href: Route; label: string; Icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/clientes', label: 'Clientes', Icon: UserCircle },
  { href: '/pedidos', label: 'Pedidos', Icon: Receipt },
  { href: '/cursos', label: 'Cursos', Icon: GraduationCap },
  { href: '/turmas', label: 'Turmas', Icon: CalendarDays },
  { href: '/cupons', label: 'Cupons', Icon: Ticket },
  { href: '/links-pagamento', label: 'Links de Pagamento', Icon: Send },
  { href: '/usuarios', label: 'Usuários', Icon: ShieldCheck },
  { href: '/setores', label: 'Setores', Icon: Building2 },
  { href: '/credenciais', label: 'Credenciais', Icon: BadgeCheck },
  { href: '/conteudo', label: 'Conteúdo do Site', Icon: FileText },
  { href: '/banners', label: 'Banner', Icon: Image },
  { href: '/configuracoes', label: 'Configurações', Icon: Settings },
];
