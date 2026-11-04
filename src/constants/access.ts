import type { Route } from 'next';

/** One entry per tab of the panel; `resource` is the name the API's permissions use. */
export const SCREENS = [
  { resource: 'dashboard', label: 'Dashboard', href: '/', exact: true },
  { resource: 'customers', label: 'Clientes', href: '/clientes' },
  { resource: 'orders', label: 'Pedidos', href: '/pedidos' },
  { resource: 'courses', label: 'Cursos', href: '/cursos' },
  { resource: 'cohorts', label: 'Turmas', href: '/turmas' },
  { resource: 'coupons', label: 'Cupons', href: '/cupons' },
  { resource: 'payment_links', label: 'Links de Pagamento', href: '/links-pagamento' },
  { resource: 'users', label: 'Usuários', href: '/usuarios' },
  { resource: 'permissions', label: 'Permissões', href: '/permissoes' },
  { resource: 'sectors', label: 'Setores', href: '/setores' },
  { resource: 'credentials', label: 'Credenciais', href: '/credenciais' },
  { resource: 'content', label: 'Conteúdo do Site', href: '/conteudo' },
  { resource: 'banners', label: 'Banner', href: '/banners' },
  { resource: 'settings', label: 'Configurações', href: '/configuracoes' },
] as const satisfies { resource: string; label: string; href: Route; exact?: boolean }[];

export type Resource = (typeof SCREENS)[number]['resource'];
export type AccessAction = 'read' | 'manage';

export const screenOf = (pathname: string) =>
  SCREENS.find((s) => ('exact' in s ? pathname === s.href : pathname.startsWith(s.href)));
