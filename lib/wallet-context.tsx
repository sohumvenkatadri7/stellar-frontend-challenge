/**
 * Wallet Context - Replicates LumenVault wallet state management
 *
 * NOTE: The actual Stellar blockchain logic is in lib/stellar-helper.ts - DO NOT MODIFY
 * This context wraps stellar-helper and provides state management
 */

'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

// Define the network type to match our updated stellar-helper
export type NetworkType = 'testnet' | 'mainnet';

// 🛑 DO NOT ADD THE TOP-LEVEL IMPORT HERE!
// import { stellar } from '@/lib/stellar-helper'; 

interface WalletCtx {
  publicKey: string | null;
  connecting: boolean;
  balance: string | null;
  balanceLoading: boolean;
  network: NetworkType; 
  toggleNetwork: () => Promise<void>; 
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  adjustBalance: (delta: string) => void;
  launchToken: (assetCode: string, supply: string) => Promise<void>;
}

const Ctx = createContext<WalletCtx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [network, setNetwork] = useState<NetworkType>('testnet'); // Default to testnet

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    setBalanceLoading(true);
    try {
      // ✅ Dynamically import ONLY when needed in the browser
      const { stellar } = await import('@/lib/stellar-helper');
      const balanceData = await stellar.getBalance(publicKey);
      setBalance(balanceData.xlm);
    } catch {
      setBalance('0'); // Fallback if account doesn't exist on the new network
    } finally {
      setBalanceLoading(false);
    }
  }, [publicKey]);

  const toggleNetwork = useCallback(async () => {
    const newNetwork = network === 'testnet' ? 'mainnet' : 'testnet';
    setNetwork(newNetwork);
    
    // ✅ Dynamically import and update the helper's internal network
    const { stellar } = await import('@/lib/stellar-helper');
    stellar.setNetwork(newNetwork);

    // Refresh the balance immediately to reflect the new network
    if (publicKey) {
      await refreshBalance();
    }
  }, [network, publicKey, refreshBalance]);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      // ✅ Dynamically import ONLY when the user clicks connect
      const { stellar } = await import('@/lib/stellar-helper');
      const pk = await stellar.connectWallet();
      setPublicKey(pk);
      setBalanceLoading(true);
      try {
        const balanceData = await stellar.getBalance(pk);
        setBalance(balanceData.xlm);
      } finally {
        setBalanceLoading(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      alert(`Wallet connection rejected: ${message}`);
    } finally {
      setConnecting(false);
    }
  }, []);

  const launchToken = useCallback(async (assetCode: string, supply: string) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      const { stellar } = await import('@/lib/stellar-helper');
      await stellar.launchToken(assetCode, supply, publicKey);
      
      // Refresh balance after successful mint!
      await refreshBalance(); 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [publicKey, refreshBalance]);

  const disconnect = useCallback(async () => {
    // ✅ Dynamically import for disconnect as well
    const { stellar } = await import('@/lib/stellar-helper');
    stellar.disconnect();
    setPublicKey(null);
    setBalance(null);
  }, []);

  const adjustBalance = useCallback((delta: string) => {
    setBalance((b) => {
      if (b === null) return b;
      const numBalance = parseFloat(b);
      const adjustment = parseFloat(delta);
      return String(Math.max(0, numBalance - adjustment));
    });
  }, []);

  return (
    <Ctx.Provider
      value={{ 
        publicKey, connecting, balance, balanceLoading, network, 
        toggleNetwork, connect, disconnect, refreshBalance, adjustBalance, launchToken 
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useWallet() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWallet must be used inside WalletProvider');
  return v;
}