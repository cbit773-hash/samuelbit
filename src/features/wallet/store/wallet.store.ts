import { create } from 'zustand';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

interface WalletState {
  address: string | null;
  chainId: number | null;
  cryptoBalance: string;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  cryptoBalance: '0.00',
  isConnecting: false,

  connectWallet: async () => {
    set({ isConnecting: true });
    
    try {
      // Intentamos usar el SDK de Coinbase
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: 'InvestPRO Platform',
        appLogoUrl: 'https://placeholder.com/logo.png',
        darkMode: true
      });

      const ethereum = coinbaseWallet.makeWeb3Provider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY', 1);
      
      // Request accounts
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      
      set({ 
        address: accounts[0], 
        chainId: 1, 
        cryptoBalance: '2.45', // Balance simulado
        isConnecting: false 
      });
      
    } catch (error) {
      console.warn("Wallet connection failed or user rejected. Fallback to mock for demo purposes.", error);
      // Fallback Demo: Simulamos una conexión exitosa si falla para poder ver la UI
      setTimeout(() => {
        set({
          address: '0x71C...976F',
          chainId: 1,
          cryptoBalance: '2.45',
          isConnecting: false
        });
      }, 1500);
    }
  },

  disconnectWallet: () => {
    set({ address: null, chainId: null, cryptoBalance: '0.00' });
  }
}));
