'use client';

import { 
  Send, 
  QrCode, 
  History, 
  Globe, 
  Link as LinkIcon, 
  Activity, 
  RefreshCw 
} from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import Link from 'next/link';

export default function DashboardPage() {
  // 1. Pull the dynamic network and balance from context
  const { balance, network, balanceLoading, refreshBalance } = useWallet();

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            / Overview
          </p>
          <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-tight">
            Dashboard
          </h1>
        </div>
        <button
          onClick={refreshBalance}
          disabled={balanceLoading}
          className="brutal-sm p-3 bg-card hover:bg-card/80 transition-colors disabled:opacity-50"
          aria-label="Refresh Balance"
        >
          <RefreshCw className={`h-5 w-5 ${balanceLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ─── Top Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Main Balance Card (Takes up 2 columns) */}
        <div className="lg:col-span-2 brutal glass p-6 sm:p-8 flex flex-col justify-between min-h-[240px]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Total Balance
            </p>
            <div className="flex items-baseline gap-3">
              <p className="font-display text-5xl sm:text-7xl truncate">
                {balance ? balance : '0.0000000'}
              </p>
              <span className="text-xl sm:text-2xl text-muted-foreground font-mono">XLM</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link href="/send" className="brutal brutal-hover flex items-center gap-2 bg-primary px-6 py-3 text-sm font-bold uppercase text-primary-foreground">
              <Send className="h-4 w-4" /> Send
            </Link>
            <Link href="/receive" className="brutal brutal-hover flex items-center gap-2 bg-background border-2 border-border px-6 py-3 text-sm font-bold uppercase">
              <QrCode className="h-4 w-4" /> Receive
            </Link>
            <Link href="/history" className="brutal brutal-hover flex items-center gap-2 bg-background border-2 border-border px-6 py-3 text-sm font-bold uppercase">
              <History className="h-4 w-4" /> History
            </Link>
          </div>
        </div>

        {/* Right Side Stats (3 stacked cards) */}
        <div className="flex flex-col gap-4">
          
          {/* 🟢 FIXED NETWORK CARD 🟢 */}
          <div className="brutal glass p-5 flex items-center gap-4 flex-1">
            <div className="brutal-sm bg-background p-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Network
              </p>
              {/* Dynamic text with capitalize class */}
              <p className="font-display text-xl sm:text-2xl capitalize mt-1 text-foreground">
                {network}
              </p>
            </div>
          </div>

          {/* Asset Card */}
          <div className="brutal glass p-5 flex items-center gap-4 flex-1">
            <div className="brutal-sm bg-background p-3">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Asset
              </p>
              <p className="font-display text-xl sm:text-2xl uppercase mt-1">
                XLM
              </p>
            </div>
          </div>

          {/* Status Card */}
          <div className="brutal glass p-5 flex items-center gap-4 flex-1">
            <div className="brutal-sm bg-background p-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 bg-success shadow-[0_0_8px_currentColor] animate-pulse" />
                <p className="font-display text-xl sm:text-2xl text-success">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recent Transactions Section ─── */}
      <div className="brutal glass flex flex-col">
        <div className="border-b-2 border-border p-4 sm:px-6 flex items-center justify-between bg-card/40">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Recent Transactions
          </h2>
          <Link href="/history" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            View All &rarr;
          </Link>
        </div>
        <div className="p-8 py-12 text-center text-sm text-muted-foreground font-mono">
          No transactions yet. Send some XLM to get started!
        </div>
      </div>
    </div>
  );
}