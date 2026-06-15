'use client';

import { usePathname } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';

export function NetworkBadge() {
  const { network } = useWallet();
  const pathname = usePathname();

  // 1. Hide the badge on the landing page ('/') 
  // because the landing page header already has the network toggle!
  if (pathname === '/') return null;

  return (
    <div 
      // 2. Moved from top-4 to bottom-6 so it stays out of the way of top-navs
      className={`fixed bottom-6 right-6 z-50 brutal-sm px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
        network === 'mainnet'
          ? 'bg-[#000000] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]'
          : 'bg-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
      }`}
    >
      <span className="flex items-center gap-2">
        <span 
          className={`h-2 w-2 shrink-0 ${
            network === 'mainnet' ? 'bg-success animate-pulse' : 'bg-warning'
          }`} 
        />
        {network}
      </span>
    </div>
  );
}