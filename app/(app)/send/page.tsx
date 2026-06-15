'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Loader2,
  Send,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { stellar } from '@/lib/stellar-helper';
import { useWallet } from '@/lib/wallet-context';
import { isValidStellarAddress, truncateKey, explorerTxUrl } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Status =
  | { kind: 'idle' }
  | { kind: 'success'; hash: string }
  | { kind: 'error'; message: string };

export default function SendPage() {
  const { publicKey, balance, refreshBalance } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const addrInvalid = to.length > 0 && !isValidStellarAddress(to);
  const amtNum = parseFloat(amount);
  const amtInvalid = amount.length > 0 && (isNaN(amtNum) || amtNum <= 0);
  const canSubmit = to && amount && !addrInvalid && !amtInvalid && !submitting && publicKey;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !publicKey) return;
    setStatus({ kind: 'idle' });
    setSubmitting(true);
    try {
      const result = await stellar.sendPayment({
        from: publicKey,
        to: to.trim(),
        amount: amount,
        memo: memo || undefined,
      });
      if (result.success) {
        setStatus({ kind: 'success', hash: result.hash });
        toast.success('Transaction submitted', {
          description: truncateKey(result.hash, 6, 6),
        });
        await refreshBalance();
        setTo('');
        setAmount('');
        setMemo('');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      setStatus({ kind: 'error', message });
      toast.error('Transaction failed', { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          / transfer
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">Send XLM</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="brutal glass space-y-5 p-6 sm:p-8"
      >
        {/* Recipient */}
        <div className="space-y-2">
          <Label htmlFor="to">Recipient Address</Label>
          <Input
            id="to"
            placeholder="G... (56 characters)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={submitting}
            // ADDED: text-black and placeholder:text-black/50
            className={`h-12 rounded-md border-2 border-border bg-input/40 text-black placeholder:text-black/50 font-mono text-sm focus-visible:ring-2 focus-visible:ring-ring ${
              addrInvalid ? 'border-destructive' : ''
            }`}
            aria-invalid={addrInvalid}
          />
          {addrInvalid && (
            <p className="text-xs font-semibold text-destructive">
              Not a valid Stellar public key.
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount</Label>
            {balance !== null && (
              <button
                type="button"
                onClick={() => setAmount(String(balance))}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                Max:{' '}
                {parseFloat(balance).toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}{' '}
                XLM
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={submitting}
              // ADDED: text-black and placeholder:text-black/50
              className={`h-12 rounded-md border-2 border-border bg-input/40 text-black placeholder:text-black/50 pr-14 font-mono focus-visible:ring-2 focus-visible:ring-ring ${
                amtInvalid ? 'border-destructive' : ''
              }`}
              aria-invalid={amtInvalid}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
              XLM
            </span>
          </div>
        </div>

        {/* Memo */}
        <div className="space-y-2">
          <Label htmlFor="memo">Memo (optional)</Label>
          <Input
            id="memo"
            placeholder="Payment for…"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            disabled={submitting}
            // ADDED: text-black and placeholder:text-black/50
            className="h-12 rounded-md border-2 border-border bg-input/40 text-black placeholder:text-black/50 font-mono text-sm focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="brutal brutal-hover flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-bold uppercase text-primary-foreground disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send Transaction
            </>
          )}
        </button>

        {/* Success */}
        {status.kind === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="brutal-sm flex items-start gap-3 bg-success/15 p-3 text-sm"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <div className="min-w-0 flex-1">
              <p className="font-bold uppercase text-success">
                Transaction successful
              </p>
              <a
                href={explorerTxUrl(status.hash)}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                {truncateKey(status.hash, 8, 8)}{' '}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {status.kind === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="brutal-sm flex items-start gap-3 bg-destructive/15 p-3 text-sm"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-bold uppercase text-destructive">
                Transaction failed
              </p>
              <p className="text-xs text-muted-foreground">{status.message}</p>
            </div>
          </motion.div>
        )}
      </motion.form>

      {/* Warning */}
      <div className="brutal-sm glass flex items-start gap-3 p-4 text-xs text-muted-foreground">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Double-check</strong> the recipient address before sending.
          Transactions on the blockchain are irreversible.
        </p>
      </div>
    </div>
  );
}