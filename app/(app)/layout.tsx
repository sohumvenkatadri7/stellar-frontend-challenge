'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useWallet } from '@/lib/wallet-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) {
      router.replace('/');
    }
  }, [publicKey, router]);

  if (!publicKey) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="brutal-sm sticky top-0 z-30 flex h-14 items-center gap-3 border-x-0 border-t-0 bg-background/70 px-4 backdrop-blur-xl">
          <SidebarTrigger />
          <div className="h-6 w-px bg-border" />
          <p className="font-display text-sm uppercase">LumenVault</p>
          <span className="ml-auto brutal-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Testnet/Mainnet
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
