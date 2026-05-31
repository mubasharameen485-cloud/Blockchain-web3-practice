import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "./ultimate_project.json";

// 1. Database Connection (RPC)
const connection = new Connection("http://127.0.0.1:8899", "confirmed");

// 2. Dummy Provider (Anchor 0.30 ko ek provider chahiye hota hai initialize hone ke liye)
const provider = new AnchorProvider(connection, {} as any, { commitment: "confirmed" });

// 3. Program Instance (The Magic Object)
// FIXED: Anchor 0.30 ka naya tarika (idl, provider)
export const program = new Program(idl as any, provider);