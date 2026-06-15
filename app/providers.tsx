'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import your exact WalletProvider and disable SSR
// (Make sure the path matches where you saved your context file)
const DynamicWalletProvider = dynamic(
  () => import('@/lib/wallet-context').then((mod) => mod.WalletProvider),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DynamicWalletProvider>
      {children}
    </DynamicWalletProvider>
  );
}