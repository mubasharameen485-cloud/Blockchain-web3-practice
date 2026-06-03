use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("A4KcpT3paxY6w29djfA8fyinXJw3iMRB5GjhNwWkpoQW"); 

#[program]
pub mod ultimate_project {
    use super::*;

    // 1. CREATE PROFILE (With Events)
    pub fn create_profile(ctx: Context<CreateProfile>, name: String) -> Result<()> {
        require!(name.trim().chars().count() > 0, MyCustomErrors::NameEmpty);
        require!(name.trim().chars().count() <= 15, MyCustomErrors::NameTooLong);

        let profile = &mut ctx.accounts.user_profile;
        profile.authority = ctx.accounts.user.key();
        profile.name = name.clone(); // Clone isliye kiya taake event mein bhi use kar sakein

        // JADOO YAHAN HAI: Event Emit (Broadcast) karna
        emit!(ProfileCreatedEvent {
            name: name,
            authority: ctx.accounts.user.key(),
            message: String::from("Ek Nayi Web3 Profile Ban Gayi Hai!"),
        });

        Ok(())
    }

    // 2. UPDATE PROFILE
    pub fn update_profile(ctx: Context<UpdateProfile>, new_name: String) -> Result<()> {
        require!(new_name.trim().chars().count() > 0, MyCustomErrors::NameEmpty);
        require!(new_name.trim().chars().count() <= 15, MyCustomErrors::NameTooLong);

        let profile = &mut ctx.accounts.user_profile;
        profile.name = new_name;
        Ok(())
    }

    // 3. DELETE PROFILE
    pub fn delete_profile(_ctx: Context<DeleteProfile>) -> Result<()> {
        Ok(())
    }

    // 4. LAUNCH COIN
    pub fn launch_coin(ctx: Context<LaunchCoin>, amount: u64) -> Result<()> {
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint_account.to_account_info(),
            to: ctx.accounts.user_ata.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        let actual_amount = amount * 1_000_000_000;
        token::mint_to(cpi_ctx, actual_amount)?;
        Ok(())
    }
}

// ---------------------------------------------------
// NAYA SECTION: EVENTS (Live Notifications)
// ---------------------------------------------------
#[event]
pub struct ProfileCreatedEvent {
    pub name: String,
    pub authority: Pubkey,
    pub message: String,
}

// ---------------------------------------------------
// CUSTOM ERRORS
// ---------------------------------------------------
#[error_code]
pub enum MyCustomErrors {
    #[msg("Error: Naam khali nahi ho sakta! Please enter a valid name.")]
    NameEmpty,
    #[msg("Error: Naam bohot lamba hai! Maximum 15 characters allowed.")]
    NameTooLong,
}

// ---------------------------------------------------
// ACCOUNTS VALIDATION
// ---------------------------------------------------
#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32, seeds = [b"profile", user.key().as_ref()], bump)]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut, has_one = authority, seeds = [b"profile", authority.key().as_ref()], bump)]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub authority: Signer<'info>, 
}

#[derive(Accounts)]
pub struct DeleteProfile<'info> {
    #[account(mut, close = authority, has_one = authority, seeds = [b"profile", authority.key().as_ref()], bump)]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub authority: Signer<'info>, 
}

#[derive(Accounts)]
pub struct LaunchCoin<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(init, payer = user, mint::decimals = 9, mint::authority = user)]
    pub mint_account: Account<'info, Mint>,
    #[account(init_if_needed, payer = user, associated_token::mint = mint_account, associated_token::authority = user)]
    pub user_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

// ---------------------------------------------------
// SCHEMA / MODEL
// ---------------------------------------------------
#[account]
pub struct UserProfile {
    pub authority: Pubkey, 
    pub name: String,      
}