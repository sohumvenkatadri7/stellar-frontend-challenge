'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface SidebarCtx {
  collapsed: boolean;
  toggle: () => void;
}

const Ctx = createContext<SidebarCtx>({ collapsed: false, toggle: () => {} });

export function useSidebar() {
  return useContext(Ctx);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);
  return (
    <Ctx.Provider value={{ collapsed, toggle }}>
      <div className="flex min-h-screen w-full">{children}</div>
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, collapsed } = useSidebar();
  return (
    <button
      onClick={toggle}
      className={cn(
        'brutal-sm brutal-hover grid h-9 w-9 place-items-center bg-card text-foreground',
        className
      )}
      aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
    >
      {collapsed ? (
        <PanelLeftOpen className="h-4 w-4" strokeWidth={2.5} />
      ) : (
        <PanelLeftClose className="h-4 w-4" strokeWidth={2.5} />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar shell                                                      */
/* ------------------------------------------------------------------ */

export function Sidebar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { collapsed } = useSidebar();
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r-2 border-border bg-sidebar/60 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border-b-2 border-border', className)}>{children}</div>
  );
}

export function SidebarContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex-1 overflow-y-auto', className)}>{children}</div>
  );
}

export function SidebarFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border-t-2 border-border', className)}>{children}</div>
  );
}

/* ------------------------------------------------------------------ */
/*  Groups & Items                                                     */
/* ------------------------------------------------------------------ */

export function SidebarGroup({ children }: { children: ReactNode }) {
  return <div className="px-3 py-2">{children}</div>;
}

export function SidebarGroupLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return (
    <p
      className={cn(
        'mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground px-1',
        className
      )}
    >
      {children}
    </p>
  );
}

export function SidebarGroupContent({ children }: { children: ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function SidebarMenu({ children }: { children: ReactNode }) {
  return <nav className="space-y-1">{children}</nav>;
}

export function SidebarMenuItem({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function SidebarMenuButton({
  children,
  isActive,
  className,
  ...props
}: {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const { collapsed } = useSidebar();
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md border-2 border-transparent px-2 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-card',
        isActive &&
          'border-border bg-primary text-primary-foreground shadow-brutal-sm',
        collapsed && 'justify-center px-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
