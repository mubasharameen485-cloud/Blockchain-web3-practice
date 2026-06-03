"use client";

import dynamic from "next/dynamic";
import CreateProfile from "../components/CreateProfile"; 
import AllProfiles from "../components/AllProfiles"; // NAYA IMPORT

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Mubashar Web3 App</h1>
      
      <div className="mb-8">
        <WalletMultiButtonDynamic />
      </div>

      {/* Layout ko khoobsurat banane ke liye Grid use kiya hai */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left Side: Create Profile */}
        <div>
          <CreateProfile />
        </div>

        {/* Right Side: Global Profiles (Feed) */}
        <div>
          <AllProfiles />
        </div>
      </div>
    </main>
  );
}