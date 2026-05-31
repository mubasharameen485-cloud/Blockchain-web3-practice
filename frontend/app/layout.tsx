import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// NAYA IMPORT: Hamara banaya hua Provider
import { WalletContextProvider } from "../components/WalletContextProvider";
const inter = Inter({ subsets: ["latin"] });

// Variable: Real world mein yahan tumhari app ka naam aur description aayega
export const metadata: Metadata = {
  title: "Mubashar Web3 App",
  description: "My First Full-Stack Solana dApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Fixed: Poori website ko Wallet aur RPC ke connection mein wrap kar diya */}
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}