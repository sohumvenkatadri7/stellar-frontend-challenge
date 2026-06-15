import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { NetworkBadge } from '@/components/NetworkBadge';

export const metadata: Metadata = {
  title: 'LumenVault — Stellar Wallet',
  description: 'Neo-brutalist Web3 wallet dashboard for the Stellar Network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {/* Render the badge here so it overlays on every page! */}
          <NetworkBadge />
          
          {children}
        </Providers>
      </body>
    </html>
  );
}