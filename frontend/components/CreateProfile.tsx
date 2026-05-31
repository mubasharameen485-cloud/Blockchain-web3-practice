"use client";

import { useState } from "react";
import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../anchor/ultimate_project.json";

export default function CreateProfile() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  
  const [name, setName] = useState<string>("");
  const [newName, setNewName] = useState<string>(""); 
  const [fetchedName, setFetchedName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getProgramAndPda = () => {
    const provider = new anchor.AnchorProvider(connection, wallet as any, { commitment: "confirmed" });
    const program = new anchor.Program(idl as any, provider);
    const [profilePda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("profile"), publicKey!.toBuffer()], program.programId);
    return { program, profilePda };
  };

  // 1. CREATE
  const handleCreateProfile = async () => {
    if (!publicKey || !wallet) return alert("Pehle Wallet Connect Karo!");
    try {
      const { program, profilePda } = getProgramAndPda();
      const signature = await program.methods.createProfile(name).accounts({
          userProfile: profilePda,
          user: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).rpc(); 
      alert(`Profile Created! Signature: ${signature}`);
    } catch (error) { console.error(error); alert("Error in Create!"); }
  };

  // 2. READ
  const handleFetchProfile = async () => {
    if (!publicKey || !wallet) return;
    setIsLoading(true);
    try {
      const { program, profilePda } = getProgramAndPda();
      const profileData = await program.account.userProfile.fetch(profilePda);
      setFetchedName(profileData.name);
    } catch (error) { console.error(error); alert("Profile nahi mili!"); } 
    finally { setIsLoading(false); }
  };

  // 3. UPDATE
  const handleUpdateProfile = async () => {
    if (!publicKey || !wallet) return alert("Pehle Wallet Connect Karo!");
    try {
      const { program, profilePda } = getProgramAndPda();
      const signature = await program.methods.updateProfile(newName).accounts({
          userProfile: profilePda,
          authority: publicKey, 
        }).rpc(); 
      alert(`Profile Updated! Signature: ${signature}`);
      handleFetchProfile(); 
    } catch (error) { console.error(error); alert("Error in Update!"); }
  };

  // 4. NAYA FUNCTION: DELETE
  const handleDeleteProfile = async () => {
    if (!publicKey || !wallet) return alert("Pehle Wallet Connect Karo!");
    const confirmDelete = window.confirm("Kya tum waqai apni profile delete karna chahte ho? (Rent wapas mil jayega)");
    if (!confirmDelete) return;

    try {
      const { program, profilePda } = getProgramAndPda();
      const signature = await program.methods.deleteProfile().accounts({
          userProfile: profilePda,
          authority: publicKey, 
        }).rpc(); 
      
      alert(`Profile Deleted! Rent Refunded. Signature: ${signature}`);
      setFetchedName(""); // Screen se naam hata do
    } catch (error) { console.error(error); alert("Error in Delete!"); }
  };

  if (!publicKey) return null;

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md">
      
      {/* --- CREATE --- */}
      <h2 className="text-xl font-bold mb-4 text-blue-400">1. Create Profile</h2>
      <input type="text" placeholder="Apna Naam Likho..." value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-2 bg-gray-900 text-white rounded border border-gray-600" />
      <button onClick={handleCreateProfile} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8">Save to Blockchain</button>

      {/* --- UPDATE --- */}
      <hr className="border-gray-600 mb-8" />
      <h2 className="text-xl font-bold mb-4 text-yellow-400">2. Update Profile</h2>
      <input type="text" placeholder="Naya Naam Likho..." value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-2 mb-2 bg-gray-900 text-white rounded border border-gray-600" />
      <button onClick={handleUpdateProfile} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-8">Update on Blockchain</button>

      {/* --- READ & DELETE --- */}
      <hr className="border-gray-600 mb-8" />
      <h2 className="text-xl font-bold mb-4 text-green-400">3. Read & Delete</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={handleFetchProfile} className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" disabled={isLoading}>
          {isLoading ? "Fetching..." : "Fetch Profile"}
        </button>
        {/* NAYA BUTTON: DELETE */}
        <button onClick={handleDeleteProfile} className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete Profile
        </button>
      </div>

      {fetchedName && (
        <div className="p-4 bg-gray-900 rounded border border-green-500">
          <p className="text-gray-400 text-sm">Blockchain se aya hua naam:</p>
          <p className="text-2xl font-bold text-white mt-1">{fetchedName}</p>
        </div>
      )}

    </div>
  );
}