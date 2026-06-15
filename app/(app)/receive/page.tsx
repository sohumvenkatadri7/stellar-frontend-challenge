'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import QRCode from 'react-qr-code'; 

export default function ReceivePage() {
  const { publicKey, network } = useWallet();
  const [copied, setCopied] = useState(false);

  // Helper variables for dynamic network text
  const isMainnet = network === 'mainnet';
  const networkName = isMainnet ? 'Mainnet' : 'Testnet';

  const copyAddress = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!publicKey) {
    return (
      <div className="flex h-[50vh] items-center justify-center font-mono text-sm text-muted-foreground">
        Please connect your wallet to receive assets.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* ─── Header ─── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          / inbound
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Receive XLM</h1>
      </div>

      {/* ─── Main Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutal glass flex flex-col items-center p-8 sm:p-12 text-center"
      >
        {/* Live QR Code Container */}
        {/* We use a white background here because dark-mode QR codes are notoriously hard for phone cameras to scan */}
        <div className="brutal-sm bg-white p-4 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
          <QRCode
            value={publicKey}
            size={220}
            bgColor="#ffffff"
            fgColor="#000000"
            level="Q" // Good error correction so it scans easily
          />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Your Stellar Address
        </p>

        {/* Address & Copy Button Box */}
        <div className="brutal-sm flex w-full items-center justify-between bg-background border-2 border-border pl-4 transition-colors hover:bg-muted/50">
           <span className="truncate font-mono text-xs sm:text-sm text-foreground py-4 pr-4">
             {publicKey}
           </span>
           <button
             onClick={copyAddress}
             title="Copy Address"
             className="brutal-sm brutal-hover flex shrink-0 items-center justify-center bg-warning p-4 text-black border-y-0 border-r-0 border-l-2 border-border h-full"
           >
             {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
           </button>
        </div>

        {/* Dynamic Network Warning */}
        <p className="mt-8 text-xs text-muted-foreground">
          Only send Stellar <span className={`font-bold uppercase tracking-wider ${isMainnet ? 'text-foreground' : 'text-warning'}`}>{networkName}</span> assets to this address.
        </p>
      </motion.div>
    </div>
  );
}