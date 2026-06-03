"use client";

import { useState } from "react";
import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../anchor/ultimate_project.json";

export default function LaunchCoin() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLaunchCoin = async () => {
    if (!publicKey || !wallet) return alert("Pehle Wallet Connect Karo!");
    setIsLoading(true);

    try {
      const provider = new anchor.AnchorProvider(connection, wallet as any, { commitment: "confirmed" });
      const program = new anchor.Program(idl as any, provider);

      // 1. Factory ke liye ek NAYI RANDOM CHABI (Keypair) banana
      const mintKeypair = anchor.web3.Keypair.generate();

      // 2. ATA (Batway) ka address calculate karna
      const userAta = anchor.utils.token.associatedAddress({
        mint: mintKeypair.publicKey,
        owner: publicKey,
      });

      // 3. Rust function ko call karna (1000 Coins chaapne ka order)
      const transaction = await program.methods
        .launchCoin(new anchor.BN(1000)) // 1000 Coins
        .accounts({
          mintAccount: mintKeypair.publicKey,
          userAta: userAta,
          user: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction();

      // 4. Lifafay par Pata, Stamp, aur FACTORY KI CHABI lagana
      transaction.feePayer = publicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      
      // JADOO: Nayi factory ban rahi hai, isliye uski chabi se dastakhat lazmi hain!
      transaction.sign(mintKeypair); 

      // 5. User (Tumhare Wallet) se dastakhat karwana
      const signature = await sendTransaction(transaction, connection);
      
      alert(`Mubarak Ho! 1000 Naye Coins Ban Gaye!\nSignature: ${signature}`);
    } catch (error) {
      console.error(error);
      alert("Error aagaya, Console check karo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicKey) return null;

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-purple-400">🪙 Launch Your Own Coin</h2>
      <p className="text-gray-300 mb-6">Ye button dabane se tumhari apni cryptocurrency banegi aur 1000 coins tumhare wallet mein aa jayenge!</p>
      
      <button 
        onClick={handleLaunchCoin}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg"
      >
        {isLoading ? "Minting Coins..." : "Launch 1000 Coins!"}
      </button>
    </div>
  );
}