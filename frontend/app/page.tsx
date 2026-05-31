"use client";

import dynamic from "next/dynamic";
import CreateProfile from "../components/CreateProfile";

// Hydration error ko khatam karne ke liye button ko dynamic kiya gaya hai
const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Mubashar Web3 App</h1>

      {/* Wallet Connect Button */}
      <div className="mb-8">
        <WalletMultiButtonDynamic />
      </div>

      {/* Hamara Create Profile ka Form */}
      <CreateProfile />
    </main>
  );
}