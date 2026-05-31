use anchor_lang::prelude::*;

// FIXED: Ye Web2 ke Mongoose Schema jaisa hai. Hum bata rahe hain ke Profile mein kya save hoga.
#[account]
pub struct UserProfile {
    pub authority: Pubkey, // Jisne profile banayi uska address (Taala)
    pub name: String,      // User ka naam
}