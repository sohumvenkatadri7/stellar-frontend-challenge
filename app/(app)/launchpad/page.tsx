'use client';

import { useState } from 'react';
import { Rocket, Coins, FileText } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';

export default function LaunchpadPage() {
  const { publicKey, launchToken } = useWallet();
  const [assetCode, setAssetCode] = useState('');
  const [supply, setSupply] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return alert('Please connect your wallet first!');
    
    if (!launchToken) {
      return alert('Launch function is not configured in your wallet context yet.');
    }
    
    setIsMinting(true);
    try {
      await launchToken(assetCode, supply);
      alert(`Success! Check your Freighter wallet, ${supply} ${assetCode} has been minted!`);
      setAssetCode('');
      setSupply('');
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to launch token: ${message}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 p-4 md:p-8">
      <div>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
          Token <span className="text-primary">Launchpad</span>
        </h1>
        <p className="mt-2 text-muted-foreground font-mono text-sm">
          Issue your own native asset on the Stellar Testnet in seconds.
        </p>
      </div>

      <div className="brutal-sm glass p-6 md:p-8">
        <form onSubmit={handleLaunch} className="space-y-6">
          <div className="space-y-4">
            
            {/* Asset Code Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Coins className="h-4 w-4" /> Asset Code
              </label>
              <input
                type="text"
                placeholder="e.g. LUMEN, PEPE, BTC"
                maxLength={12}
                required
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value.toUpperCase())}
                // FIXED: Changed bg-background to bg-white so black text is high contrast
                className="brutal-sm w-full bg-white px-4 py-3 font-mono text-lg text-black placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground font-mono">1-12 alphanumeric characters.</p>
            </div>

            {/* Initial Supply Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4" /> Initial Supply
              </label>
              <input
                type="number"
                placeholder="1000000"
                min="1"
                required
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                // FIXED: Changed bg-background to bg-white so black text is high contrast
                className="brutal-sm w-full bg-white px-4 py-3 font-mono text-lg text-black placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!publicKey || isMinting}
            className="brutal-sm brutal-hover flex w-full items-center justify-center gap-2 bg-primary px-8 py-4 font-display text-lg font-bold uppercase text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Rocket className="h-5 w-5" /> Igniting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Rocket className="h-5 w-5" /> Launch Token
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}