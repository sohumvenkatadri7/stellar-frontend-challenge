'use client';

import { LogOut, ShieldCheck, Bell, Globe } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { truncateKey } from '@/lib/utils';

export default function SettingsPage() {
  const { publicKey, disconnect } = useWallet();

  const rows = [
    { icon: Globe, label: 'Network', value: 'Stellar Testnet' },
    { icon: ShieldCheck, label: 'Wallet', value: 'Freighter (via Stellar Wallets Kit)' },
    { icon: Bell, label: 'Notifications', value: 'Toasts enabled' },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          / account
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">Settings</h1>
      </div>

      <div className="brutal glass p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Connected Address
        </p>
        <p className="mt-1 break-all font-mono text-sm">{publicKey}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {truncateKey(publicKey ?? '')}
        </p>
      </div>

      <div className="brutal glass divide-y-2 divide-border/40">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 p-4">
            <div className="brutal-sm grid h-9 w-9 shrink-0 place-items-center bg-card">
              <r.icon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {r.label}
              </p>
              <p className="font-display text-sm">{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={disconnect}
        className="brutal brutal-hover flex w-full items-center justify-center gap-2 bg-destructive px-4 py-3 text-sm font-bold uppercase text-destructive-foreground"
      >
        <LogOut className="h-4 w-4" /> Disconnect Wallet
      </button>
    </div>
  );
}
