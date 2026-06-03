"use client";

import { useState, useEffect } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../anchor/ultimate_project.json";

// TypeScript ke liye data ki shakal
interface Profile {
  publicKey: string;
  name: string;
  authority: string;
}

export default function AllProfiles() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllProfiles = async () => {
    // Agar wallet connect nahi hai toh dummy wallet use karo (Kyunke read karne ke liye signature nahi chahiye hota!)
    const provider = new anchor.AnchorProvider(
      connection, 
      wallet || ({} as any), 
      { commitment: "confirmed" }
    );
    const program = new anchor.Program(idl as any, provider);

    setIsLoading(true);
    try {
      // JADOO YAHAN HAI: Web3 ka "SELECT * FROM users"
      const allData = await program.account.userProfile.all();

      // Data ko map (clean) kar rahe hain taake screen par dikha sakein
      const cleanedData = allData.map((item) => ({
        publicKey: item.publicKey.toBase58(), // Tijori ka address
        name: item.account.name,              // User ka naam
        authority: item.account.authority.toBase58(), // Maalik ka address
      }));

      setProfiles(cleanedData);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Jaise hi page load ho, data khud ba khud fetch ho jaye
  useEffect(() => {
    fetchAllProfiles();
  }, [wallet]);

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-400">🌍 Global Web3 Profiles</h2>
        <button 
          onClick={fetchAllProfiles}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded text-sm"
        >
          {isLoading ? "Loading..." : "Refresh Data"}
        </button>
      </div>

      {/* Agar koi profile nahi mili */}
      {profiles.length === 0 && !isLoading && (
        <p className="text-gray-400 text-center">Abhi tak kisi ne profile nahi banayi.</p>
      )}

      {/* Profiles ki List (Grid) */}
      <div className="grid grid-cols-1 gap-4">
        {profiles.map((profile, index) => (
          <div key={index} className="p-4 bg-gray-900 rounded border border-teal-500">
            <h3 className="text-xl font-bold text-white mb-2">👤 {profile.name}</h3>
            <p className="text-xs text-gray-400">
              <span className="font-bold text-teal-300">Maalik (Authority):</span> <br/>
              {profile.authority}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-bold text-gray-400">Tijori (PDA):</span> <br/>
              {profile.publicKey}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}