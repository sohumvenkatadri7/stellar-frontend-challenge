'use client';

import { useState, useEffect } from 'react';
import { 
  Send, 
  QrCode, 
  History, 
  Globe, 
  Link as LinkIcon, 
  Activity, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { stellar } from '@/lib/stellar-helper';
import Link from 'next/link';

export default function DashboardPage() {
  const { publicKey, balance, network, balanceLoading, refreshBalance } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    async function fetchRecentActivity() {
      if (!publicKey) return;
      setTxLoading(true);
      try {
        // FIXED: Limited to only the 3 most recent transactions
        const history = await stellar.getRecentTransactions(publicKey, 3); 
        setTransactions(history);
      } catch (err) {
        console.error("Failed to sync recent ledger events:", err);
      } finally {
        setTxLoading(false);
      }
    }
    fetchRecentActivity();
  }, [publicKey, network, balance]);

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
        
        {/* Main Balance Card */}
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

        {/* Right Side Stats */}
        <div className="flex flex-col gap-4">
          <div className="brutal glass p-5 flex items-center gap-4 flex-1">
            <div className="brutal-sm bg-background p-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Network
              </p>
              <p className="font-display text-xl sm:text-2xl capitalize mt-1 text-foreground">
                {network}
              </p>
            </div>
          </div>

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

      {/* ─── Recent Transactions Section (Capped at 3) ─── */}
      <div className="brutal glass flex flex-col">
        <div className="border-b-2 border-border p-4 sm:px-6 flex items-center justify-between bg-card/40">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Recent Transactions
          </h2>
          <Link href="/history" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            View All &rarr;
          </Link>
        </div>

        {txLoading ? (
          <div className="p-12 flex justify-center items-center gap-2 text-sm font-mono text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Fetching ledger history...
          </div>
        ) : !publicKey ? (
          <div className="p-8 py-12 text-center text-sm text-muted-foreground font-mono">
            Connect your wallet to track recent account activity.
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 py-12 text-center text-sm text-muted-foreground font-mono">
            No transactions yet. Send some XLM to get started!
          </div>
        ) : (
          <div className="divide-y-2 divide-border">
            {transactions.map((tx) => {
              const isSent = tx.from === publicKey;
              const counterParty = isSent ? tx.to : tx.from;
              
              return (
                <div 
                  key={tx.id} 
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-card/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`brutal-sm p-2 shrink-0 ${isSent ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                      {isSent ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-bold truncate">
                        {isSent ? 'Sent to' : 'Received from'} {stellar.formatAddress(counterParty || '')}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right font-mono">
                      <p className={`text-sm font-bold ${isSent ? 'text-destructive' : 'text-success'}`}>
                        {isSent ? '-' : '+'}{parseFloat(tx.amount || '0').toLocaleString(undefined, { maximumFractionDigits: 4 })} {tx.asset}
                      </p>
                    </div>
                    <a
                      href={stellar.getExplorerLink(tx.hash, 'tx')}
                      target="_blank"
                      rel="noreferrer"
                      className="brutal-sm p-1.5 bg-background hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Inspect Block Transaction"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}