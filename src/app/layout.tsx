import type { ReactNode } from 'react';
import { inter, spaceGrotesk } from '@/core/fonts';
import { siteMetadata } from '@/core/metadata';
import { Providers } from '@/core/Providers';
import '@/styles/globals.css';

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
