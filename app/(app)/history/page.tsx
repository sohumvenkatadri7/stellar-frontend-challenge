'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { stellar } from '@/lib/stellar-helper';
import { useWallet } from '@/lib/wallet-context';
import { truncateKey, explorerTxUrl } from '@/lib/utils';

type Tx = {
  id: string;
  type: string;
  amount?: string;
  asset?: string;
  from?: string;
  to?: string;
  createdAt: string;
  hash: string;
};

export default function HistoryPage() {
  const { publicKey } = useWallet();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTxs = async () => {
    if (!publicKey) return;
    setRefreshing(true);
    try {
      const recent = await stellar.getRecentTransactions(publicKey, 20);
      setTxs(recent);
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, [publicKey]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            / ledger
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">
            Transaction History
          </h1>
        </div>
        <button
          onClick={fetchTxs}
          disabled={refreshing}
          className="brutal-sm brutal-hover grid h-9 w-9 place-items-center bg-card text-muted-foreground hover:text-foreground"
          title="Refresh"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="brutal glass overflow-hidden">
        {/* Table header (desktop) */}
        <div className="hidden grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b-2 border-border bg-card/40 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:grid">
          <span>Type</span>
          <span>Counterparty</span>
          <span>Amount</span>
          <span>Tx</span>
        </div>

        {loading ? (
          <div className="space-y-0 divide-y-2 divide-border/40">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse px-5 py-4">
                <div className="h-4 w-3/4 rounded bg-card" />
              </div>
            ))}
          </div>
        ) : txs.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No transactions yet. Send some XLM to get started!
          </div>
        ) : (
          <div className="divide-y-2 divide-border/40">
            {txs.map((tx) => {
              const outgoing = tx.from === publicKey;
              return (
                <div
                  key={tx.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4 sm:px-5"
                >
                  <div
                    className={`brutal-sm grid h-9 w-9 shrink-0 place-items-center ${
                      outgoing
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-success text-success-foreground'
                    }`}
                  >
                    {outgoing ? (
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm">
                      {truncateKey(outgoing ? tx.to ?? '' : tx.from ?? '')}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p
                    className={`font-mono text-sm font-bold ${
                      outgoing ? 'text-destructive' : 'text-success'
                    }`}
                  >
                    {outgoing ? '' : '+'}
                    {tx.amount ? parseFloat(tx.amount).toFixed(2) : '—'}{' '}
                    <span className="text-muted-foreground">XLM</span>
                  </p>
                  <a
                    href={explorerTxUrl(tx.hash)}
                    target="_blank"
                    rel="noreferrer"
                    className="brutal-sm brutal-hover col-span-3 mt-2 inline-flex items-center justify-center gap-1.5 bg-card px-3 py-1.5 text-[10px] font-bold uppercase sm:col-span-1 sm:mt-0"
                  >
                    Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {txs.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Showing last {txs.length} transaction{txs.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
