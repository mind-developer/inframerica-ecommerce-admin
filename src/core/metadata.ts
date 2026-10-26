import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: { default: 'Painel — Inframérica', template: '%s | Painel Inframérica' },
  description: 'Gestão administrativa da loja SkyPass.',
  robots: { index: false, follow: false },
};
