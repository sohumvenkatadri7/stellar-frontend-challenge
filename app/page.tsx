/**
 * Landing / Connect Page
 *
 * Shown when the user is NOT connected.
 * Once connected, the app layout redirects to /dashboard.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Wallet,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';

const features = [
  {
    icon: ShieldCheck,
    title: 'Non-custodial',
    desc: 'Your keys, your crypto. We never hold your funds.',
  },
  {
    icon: Zap,
    title: 'Fast finality',
    desc: 'Transactions settle in 3–5 seconds on the Stellar network.',
  },
  {
    icon: Sparkles,
    title: 'Modular UI',
    desc: 'Neo-brutalist dashboard built for speed and clarity.',
  },
];

export default function LandingPage() {
  const { publicKey, connecting, connect, network, toggleNetwork } = useWallet();
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const isMainnet = network === 'mainnet';
  const networkName = isMainnet ? 'Mainnet' : 'Testnet';

  const steps = [
    { num: '01', title: 'Install Freighter', desc: 'Browser extension for Stellar wallets.' },
    { num: '02', title: 'Connect', desc: 'Click the button and approve the request.' },
    { num: '03', title: 'Send & receive', desc: `Transfer XLM on the Stellar ${networkName}.` },
  ];

  const faqs = [
    {
      q: `What is the Stellar ${networkName}?`,
      a: isMainnet 
        ? 'The live, production Stellar blockchain where real XLM and assets are transferred securely and instantly.'
        : 'A public sandbox for building and testing on Stellar — no real money involved.',
    },
    {
      q: 'Where are my keys stored?',
      a: 'Inside your browser wallet extension (e.g. Freighter). LumenVault never sees them.',
    },
    {
      q: 'How much does a transaction cost?',
      a: 'About 0.00001 XLM — virtually free.',
    },
  ];

  useEffect(() => {
    if (publicKey) router.replace('/dashboard');
  }, [publicKey, router]);

  if (publicKey) return null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* ─── Header ─── */}
      <header className="brutal-sm sticky top-0 z-40 flex h-14 items-center border-b-2 border-x-0 border-border bg-background/70 px-4 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="brutal-sm grid h-8 w-8 place-items-center bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm uppercase">
              LUMEN<span className="text-gradient">VAULT</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-9 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how-it-works" className="hover:text-foreground">How it works</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleNetwork}
              className={`brutal-sm brutal-hover hidden sm:flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                isMainnet 
                  ? 'bg-[#000000] text-white dark:bg-white dark:text-black' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <Globe className="h-3 w-3" />
              Testnet/Mainnet Active
            </button>
            <button
              onClick={connect}
              disabled={connecting}
              className="brutal brutal-hover flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground disabled:opacity-50"
            >
              <Wallet className="h-3.5 w-3.5" />
              {connecting ? 'Connecting…' : 'Connect'}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      {/* Reduced the top padding (pt-8 sm:pt-12) to pull it closer to the navbar */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-24 sm:pt-12 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start text-left"
          >
            <div className="brutal-sm flex items-center gap-2 bg-success/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-success mb-6">
              <span className="h-2 w-2 bg-success animate-pulse shadow-[0_0_8px_currentColor]" />
              Stellar Testnet/Mainnet Live
            </div>
            
            {/* Forced 2-line layout matching the screenshot exactly */}
            <h1 className="font-display text-6xl sm:text-7xl xl:text-[70px] uppercase leading-[0.9] tracking-tight">
              A WALLET WITH<br/>
              <span className="text-gradient">ATTITUDE.</span>
            </h1>
            
            <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">
              Connect Freighter and ship lumens in seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={connect}
                disabled={connecting}
                className="brutal brutal-hover flex items-center gap-2 bg-primary px-6 py-4 text-sm font-bold uppercase text-primary-foreground disabled:opacity-50"
              >
                <Wallet className="h-4 w-4" />
                {connecting ? 'Connecting…' : 'Connect Freighter'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="brutal brutal-hover flex items-center gap-2 bg-card px-6 py-4 text-sm font-bold uppercase text-card-foreground"
              >
                Explore <ArrowRight className="h-4 w-4 -rotate-45" />
              </a>
            </div>

            {/* Stat Boxes */}
            <div className="mt-12 flex flex-wrap gap-4">
              <div className="brutal bg-background px-4 py-3">
                <p className="font-display text-xl sm:text-2xl">1.2s</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Avg Send</p>
              </div>
              <div className="brutal bg-background px-4 py-3">
                <p className="font-display text-xl sm:text-2xl">0%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Custody</p>
              </div>
              <div className="brutal bg-background px-4 py-3">
                <p className="font-display text-xl sm:text-2xl">100%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Open Src</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Mock Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 relative"
          >
            <div className="brutal-lg bg-[#15161C] text-white p-6 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Stellar - {networkName}
                </p>
                <span className="brutal-sm bg-[#D946EF] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                  Live
                </span>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Balance
                </p>
                <p className="mt-1 font-display text-4xl sm:text-5xl">
                  1,428.73 <span className="text-base text-white/50">XLM</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="brutal bg-primary text-black p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Send</p>
                  <p className="font-display text-2xl mt-1">+24.0</p>
                </div>
                <div className="brutal bg-[#D946EF] text-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Receive</p>
                  <p className="font-display text-2xl mt-1">+102.4</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  { dir: 'out', label: 'Sent to G3X…7QF', amt: '-12.40 XLM' },
                  { dir: 'in', label: 'From G91…ALD', amt: '+250.00 XLM' },
                  { dir: 'out', label: 'Sent to GBR…M2P', amt: '-8.25 XLM' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between text-xs sm:text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="font-mono text-white/60">{tx.label}</span>
                    <span className="font-mono font-bold">{tx.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="border-y-2 border-border bg-card/20 py-16 sm:py-24">
        {/* NEW: Added the "BUILT FOR BUILDERS" header row */}
        <div className="mx-auto max-w-7xl px-4 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight">
            BUILT FOR BUILDERS.
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pb-3">
            /01 • FEATURES
          </span>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="brutal glass p-6"
            >
              <div className="brutal-sm mb-4 grid h-10 w-10 place-items-center bg-primary">
                <f.icon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-sm uppercase">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:py-24 w-full">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground text-center">
          How it works
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl uppercase text-center">
          Three steps
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="brutal glass p-6">
              <span className="font-display text-3xl text-primary">{s.num}</span>
              <h3 className="mt-2 font-display text-sm uppercase">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-4 pb-16 sm:pb-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground text-center">
          FAQ
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl uppercase text-center">
          Common questions
        </h2>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="brutal glass">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left text-sm font-bold uppercase tracking-wide"
              >
                {f.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    faqOpen === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {faqOpen === i && (
                <div className="border-t-2 border-border/40 px-4 pb-4 pt-3 text-sm text-muted-foreground">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t-2 border-border py-8 text-center text-xs text-muted-foreground mt-auto">
        <p>Built with ❤️ using Stellar SDK · Running on {networkName}</p>
        
        {!isMainnet && (
          <p className="mt-1 text-[10px] uppercase tracking-widest text-warning">
            ⚠ This is a testnet application — do not use real funds.
          </p>
        )}
      </footer>
    </div>
  );
}