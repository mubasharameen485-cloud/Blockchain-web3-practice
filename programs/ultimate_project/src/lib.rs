use anchor_lang::prelude::*;

// Tumhari ID 'anchor keys sync' se khud update ho jayegi
declare_id!("A4KcpT3paxY6w29djfA8fyinXJw3iMRB5GjhNwWkpoQW"); 

#[program]
pub mod ultimate_project {
    use super::*;

    // 1. CREATE
    pub fn create_profile(ctx: Context<CreateProfile>, name: String) -> Result<()> {
        let profile = &mut ctx.accounts.user_profile;
        profile.authority = ctx.accounts.user.key();
        profile.name = name;
        Ok(())
    }

    // 2. UPDATE
    pub fn update_profile(ctx: Context<UpdateProfile>, new_name: String) -> Result<()> {
        let profile = &mut ctx.accounts.user_profile;
        profile.name = new_name;
        msg!("Profile Updated to: {}", profile.name);
        Ok(())
    }

    // 3. NAYA FUNCTION: DELETE (CLOSE)
    pub fn delete_profile(_ctx: Context<DeleteProfile>) -> Result<()> {
        // Yahan koi logic likhne ki zaroorat nahi! 
        // Anchor ka 'close' macro khud account delete karega aur paise wapas bhej dega.
        msg!("Profile Deleted and Rent Refunded!");
        Ok(())
    }
}

// ---------------------------------------------------
// ACCOUNTS VALIDATION
// ---------------------------------------------------

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 32, 
        seeds = [b"profile", user.key().as_ref()], 
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
        mut, 
        has_one = authority, 
        seeds = [b"profile", authority.key().as_ref()], 
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub authority: Signer<'info>, 
}

// NAYA STRUCT: DELETE KE RULES
#[derive(Accounts)]
pub struct DeleteProfile<'info> {
    #[account(
        mut, 
        close = authority, // JADOO YAHAN HAI: Account band karo aur saare paise 'authority' ko wapas de do
        has_one = authority, // SECURITY: Sirf maalik hi delete kar sake
        seeds = [b"profile", authority.key().as_ref()], 
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub authority: Signer<'info>, 
}

// ---------------------------------------------------
// SCHEMA / MODEL
// ---------------------------------------------------
#[account]
pub struct UserProfile {
    pub authority: Pubkey, 
    pub name: String,      
}