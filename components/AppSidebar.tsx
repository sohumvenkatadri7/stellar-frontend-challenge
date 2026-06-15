'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Send,
  QrCode,
  History,
  Settings,
  Sparkles,
  LogOut,
  Copy,
  Check,
  Rocket,
  Globe // Added Globe icon
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useWallet } from '@/lib/wallet-context';
import { truncateKey } from '@/lib/utils';

const products = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Send XLM', url: '/send', icon: Send },
  { title: 'Receive', url: '/receive', icon: QrCode },
  { title: 'History', url: '/history', icon: History },
  { title: 'Launchpad', url: '/launchpad', icon: Rocket }, 
];

const settings = [{ title: 'Settings', url: '/settings', icon: Settings }];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  // Destructured network and toggleNetwork from useWallet
  const { publicKey, disconnect, network, toggleNetwork } = useWallet();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isActive = (path: string) => pathname === path;

  const renderItem = (item: {
    title: string;
    url: string;
    icon: typeof LayoutDashboard;
  }) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isActive(item.url)}>
        <Link href={item.url} className="flex items-center gap-2.5">
          <item.icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          {!collapsed && <span className="text-sm">{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="border-r-2 border-border">
      <SidebarHeader className="border-b-2 border-border bg-sidebar/60 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-1 py-3">
          <div className="brutal-sm grid h-9 w-9 shrink-0 place-items-center bg-primary">
            <Sparkles
              className="h-4 w-4 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm leading-none">
                LUMEN<span className="text-gradient">VAULT</span>
              </p>
              {/* Dynamic Network Text */}
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                stellar {network}
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar/40 backdrop-blur-xl">
        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{products.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{settings.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-border bg-sidebar/60 backdrop-blur-xl p-2 space-y-2">
        {/* Network Toggle Button */}
        {!collapsed && (
          <button
            onClick={toggleNetwork}
            className={`brutal-sm brutal-hover flex w-full items-center justify-center gap-2 px-2 py-2 text-xs font-bold uppercase transition-colors ${
              network === 'mainnet' 
                ? 'bg-[#000000] text-white dark:bg-white dark:text-black' 
                : 'bg-secondary text-secondary-foreground' 
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            {network === 'mainnet' ? 'Mainnet Active' : 'Testnet Active'}
          </button>
        )}

        {/* Existing Wallet Info */}
        {publicKey && !collapsed && (
          <div className="brutal-sm glass space-y-2 p-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 bg-success shadow-[0_0_8px_currentColor]" />
              <span className="truncate font-mono text-xs">
                {truncateKey(publicKey)}
              </span>
              <button
                onClick={copy}
                aria-label="Copy"
                className="ml-auto p-1 hover:text-primary"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <button
              onClick={disconnect}
              className="brutal-sm brutal-hover flex w-full items-center justify-center gap-2 bg-destructive px-2 py-1.5 text-xs font-bold uppercase text-destructive-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Disconnect
            </button>
          </div>
        )}

        {/* Collapsed Disconnect Button */}
        {publicKey && collapsed && (
          <button
            onClick={disconnect}
            aria-label="Disconnect"
            className="brutal-sm brutal-hover grid h-9 w-9 place-items-center bg-destructive text-destructive-foreground mx-auto"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}