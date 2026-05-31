"use client"; // Fixed: Next.js mein Web3 hamesha client-side par chalta hai

import { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";

// Fixed: Ye CSS file Wallet ke khoobsurat UI (buttons/modals) ke liye lazmi hai
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // 1. DATABASE CONNECTION (RPC Node)
  // Variable: Real world mein ye 'devnet' ya 'mainnet-beta' hoga. Abhi hum local par hain.
  const endpoint = useMemo(() => "http://127.0.0.1:8899", []);

  // 2. WALLETS SETUP
  // Fixed: Aaj kal wallets auto-detect hote hain, isliye empty array kafi hai.
  const wallets = useMemo(() => [], []);

  return (
    // ConnectionProvider = Database se connect karta hai
    <ConnectionProvider endpoint={endpoint}>
      // WalletProvider = User ke Phantom/Solflare wallet se connect karta hai
      <WalletProvider wallets={wallets} autoConnect>
        // WalletModalProvider = Screen par khoobsurat popup (modal) dikhata hai
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};