import {
  BadgeCheck,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  Image,
  KeyRound,
  LayoutDashboard,
  Receipt,
  Send,
  Settings,
  ShieldCheck,
  Ticket,
  UserCircle,
} from 'lucide-react';
import type { Route } from 'next';

/** `soon`: the tab still runs on mock data, nothing reaches the API yet. */
export const NAV_ITEMS: {
  href: Route;
  label: string;
  Icon: typeof LayoutDashboard;
  exact?: boolean;
  soon?: boolean;
}[] = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard, exact: true, soon: true },
  { href: '/clientes', label: 'Clientes', Icon: UserCircle },
  { href: '/pedidos', label: 'Pedidos', Icon: Receipt, soon: true },
  { href: '/cursos', label: 'Cursos', Icon: GraduationCap, soon: true },
  { href: '/turmas', label: 'Turmas', Icon: CalendarDays, soon: true },
  { href: '/cupons', label: 'Cupons', Icon: Ticket, soon: true },
  { href: '/links-pagamento', label: 'Links de Pagamento', Icon: Send, soon: true },
  { href: '/usuarios', label: 'Usuários', Icon: ShieldCheck },
  { href: '/permissoes', label: 'Permissões', Icon: KeyRound },
  { href: '/setores', label: 'Setores', Icon: Building2 },
  { href: '/credenciais', label: 'Credenciais', Icon: BadgeCheck, soon: true },
  { href: '/conteudo', label: 'Conteúdo do Site', Icon: FileText, soon: true },
  { href: '/banners', label: 'Banner', Icon: Image, soon: true },
  { href: '/configuracoes', label: 'Configurações', Icon: Settings, soon: true },
];
