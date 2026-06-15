/**
 * Stellar Helper - Blockchain Logic with Stellar Wallets Kit
 * ⚠️ DO NOT MODIFY THIS FILE! ⚠️ (Optimized for Async Control & Instant Transitions)
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { Keypair, Asset, TransactionBuilder, Networks, Operation, Horizon } from '@stellar/stellar-sdk';
import { 
  StellarWalletsKit, 
  WalletNetwork, 
  allowAllModules,
  FREIGHTER_ID 
} from '@creit.tech/stellar-wallets-kit';

export class StellarHelper {
  private server: StellarSdk.Horizon.Server;
  private networkPassphrase: string;
  private kit: StellarWalletsKit | null = null; 
  private network: WalletNetwork;
  private publicKey: string | null = null;

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    this.server = new StellarSdk.Horizon.Server(
      network === 'testnet'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org'
    );
    this.networkPassphrase =
      network === 'testnet'
        ? StellarSdk.Networks.TESTNET
        : StellarSdk.Networks.PUBLIC;
    
    this.network = network === 'testnet' 
      ? WalletNetwork.TESTNET 
      : WalletNetwork.PUBLIC;
  }

  /**
   * Private helper to lazily initialize the StellarWalletsKit only when needed.
   * This prevents the main thread from blocking during routing/page loading.
   */
  private getKit(): StellarWalletsKit {
    if (this.kit) return this.kit;

    if (typeof window === 'undefined') {
      throw new Error('Stellar Wallets Kit cannot be initialized on the server side.');
    }

    this.kit = new StellarWalletsKit({
      network: this.network,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });

    return this.kit;
  }

  // Dynamic network switcher
  public setNetwork(network: 'testnet' | 'mainnet') {
    this.server = new StellarSdk.Horizon.Server(
      network === 'testnet'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org'
    );
    this.networkPassphrase =
      network === 'testnet'
        ? StellarSdk.Networks.TESTNET
        : StellarSdk.Networks.PUBLIC;
    
    this.network = network === 'testnet' 
      ? WalletNetwork.TESTNET 
      : WalletNetwork.PUBLIC;

    this.kit = null;
  }

  isFreighterInstalled(): boolean {
    return true;
  }

  async connectWallet(): Promise<string> {
    try {
      const activeKit = this.getKit();

      // FIXED: Wrap in a promise to prevent the extension popup from cutting in front of the modal selection
      await new Promise<void>((resolve) => {
        activeKit.openModal({
          onWalletSelected: async (option) => {
            console.log('Wallet selected:', option.id);
            activeKit.setWallet(option.id);
            resolve(); // Unblocks execution only AFTER a wallet option is clicked
          }
        });
      });

      const { address } = await activeKit.getAddress();

      if (!address) {
        throw new Error('Wallet bağlanamadı');
      }

      this.publicKey = address;
      return address;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      throw new Error('Wallet bağlantısı başarısız: ' + error.message);
    }
  }

  async getBalance(publicKey: string): Promise<{
    xlm: string;
    assets: Array<{ code: string; issuer: string; balance: string }>;
  }> {
    const account = await this.server.loadAccount(publicKey);
    
    const xlmBalance = account.balances.find(
      (b) => b.asset_type === 'native'
    );

    const assets = account.balances
      .filter((b) => b.asset_type !== 'native')
      .map((b: any) => ({
        code: b.asset_code,
        issuer: b.asset_issuer,
        balance: b.balance,
      }));

    return {
      xlm: xlmBalance && 'balance' in xlmBalance ? xlmBalance.balance : '0',
      assets,
    };
  }

  async sendPayment(params: {
    from: string;
    to: string;
    amount: string;
    memo?: string;
  }): Promise<{ hash: string; success: boolean }> {
    const activeKit = this.getKit();
    const sourceAccount = await this.server.loadAccount(params.from);
    let operation;

    try {
      await this.server.loadAccount(params.to);
      operation = StellarSdk.Operation.payment({
        destination: params.to,
        asset: StellarSdk.Asset.native(),
        amount: params.amount,
      });
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        operation = StellarSdk.Operation.createAccount({
          destination: params.to,
          startingBalance: params.amount,
        });
      } else {
        throw error; 
      }
    }

    const transactionBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: this.networkPassphrase,
    }).addOperation(operation);

    if (params.memo) {
      transactionBuilder.addMemo(StellarSdk.Memo.text(params.memo));
    }

    const transaction = transactionBuilder.setTimeout(180).build();

    const { signedTxXdr } = await activeKit.signTransaction(transaction.toXDR(), {
      networkPassphrase: this.networkPassphrase,
    });

    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signedTxXdr,
      this.networkPassphrase
    );

    const result = await this.server.submitTransaction(
      transactionToSubmit as StellarSdk.Transaction
    );

    return {
      hash: result.hash,
      success: result.successful,
    };
  }

  async getRecentTransactions(
    publicKey: string,
    limit: number = 10
  ): Promise<Array<{
    id: string;
    type: string;
    amount?: string;
    asset?: string;
    from?: string;
    to?: string;
    createdAt: string;
    hash: string;
  }>> {
    const payments = await this.server
      .payments()
      .forAccount(publicKey)
      .order('desc')
      .limit(limit)
      .call();

    return payments.records.map((payment: any) => ({
      id: payment.id,
      type: payment.type,
      amount: payment.amount,
      asset: payment.asset_type === 'native' ? 'XLM' : payment.asset_code,
      from: payment.from,
      to: payment.to,
      createdAt: payment.created_at,
      hash: payment.transaction_hash,
    }));
  }

  public async launchToken(assetCode: string, supply: string, userPublicKey: string): Promise<boolean> {
    const activeKit = this.getKit();

    if (this.networkPassphrase === StellarSdk.Networks.PUBLIC) {
      throw new Error("Mainnet token launching requires real XLM to fund the issuer account. Please switch to Testnet!");
    }

    const server = this.server;
    const networkPassphrase = this.networkPassphrase;

    try {
      const issuer = Keypair.random();

      await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(issuer.publicKey())}`);

      const userAccount = await server.loadAccount(userPublicKey);
      const asset = new Asset(assetCode, issuer.publicKey());

      const trustlineTx = new TransactionBuilder(userAccount, {
        fee: "100", 
        networkPassphrase,
      })
        .addOperation(Operation.changeTrust({ asset: asset }))
        .setTimeout(60)
        .build();

      const { signedTxXdr } = await activeKit.signTransaction(trustlineTx.toXDR(), {
        networkPassphrase: networkPassphrase,
        address: userPublicKey,
      });

      const signedTrustlineTx = TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase);
      await server.submitTransaction(signedTrustlineTx as any);

      const issuerAccount = await server.loadAccount(issuer.publicKey());
      const mintTx = new TransactionBuilder(issuerAccount, {
        fee: "100",
        networkPassphrase,
      })
        .addOperation(Operation.payment({
          destination: userPublicKey,
          asset: asset,
          amount: supply,
        }))
        .addOperation(Operation.setOptions({ masterWeight: 0 }))
        .setTimeout(60)
        .build();

      mintTx.sign(issuer); 
      await server.submitTransaction(mintTx as any);

      return true;
    } catch (error) {
      console.error("Token launch failed:", error);
      throw error;
    }
  }

  getExplorerLink(hash: string, type: 'tx' | 'account' = 'tx'): string {
    const network = this.networkPassphrase === StellarSdk.Networks.TESTNET ? 'testnet' : 'public';
    return `https://stellar.expert/explorer/${network}/${type}/${hash}`;
  }

  formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
    if (address.length <= startChars + endChars) {
      return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }

  disconnect() {
    this.publicKey = null;
    return true;
  }
}

export const stellar = new StellarHelper('testnet');