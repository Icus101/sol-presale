use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("7eUBXQXEz6wh52VEmiucmcZL1eE6aFaANEY1URA9FRy4");

#[program]
pub mod sol_presale {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, ) -> Result<()> {
        let presale = &mut ctx.accounts.presale;

        if presale.initialized {
            return Err(ErrorCode::AccountAlreadyInitialized.into());
        }

        presale.initialized = true;
        presale.presale_active = true;
        presale.amount_raised = 0;
        presale.admin = ctx.accounts.admin.key();

        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount_sol_lamports: u64) ->  Result<()> {
        
        // Ensure the presale is initialized and active
        if !ctx.accounts.presale.initialized || !ctx.accounts.presale.presale_active
        {
            return Err(ErrorCode::InvalidArgument.into());
        }

        if amount_sol_lamports <= 0 {
            return Err(ErrorCode::InvalidArgument.into());
        }

        // Transfer SOL from the buyer to the presale account
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.sender.key(),
            &ctx.accounts.presale.to_account_info().key(),
            amount_sol_lamports,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.sender.to_account_info(),
                ctx.accounts.presale.to_account_info(),
            ],
        )?;

        // Update the presale account's amount raised
        ctx.accounts.presale.amount_raised += amount_sol_lamports;

        Ok(())
    }

    pub fn withdraw_sol(ctx: Context<WithdrawSol>) ->  Result<()> {
        let presale = &mut ctx.accounts.presale;
        let admin = presale.admin;
        let amount = presale.amount_raised;

        // Check if the program account has enough balance
        if amount <= 0 {
            return Err(ErrorCode::InsufficientFunds.into());
        }

        // Check if the signer is the admin
        if admin != *ctx.accounts.admin.key {
            return Err(ErrorCode::InvalidAccountData.into());
        }

        // Transfer SOL from the program account to the recipient
        **presale.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx
            .accounts
            .admin
            .to_account_info()
            .try_borrow_mut_lamports()? += amount;

        presale.amount_raised = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,seeds = [b"presale".as_ref(),admin.key().as_ref()],
    bump,
    payer = admin,
    space = 8 + size_of::<Presale>())]
    pub presale: Account<'info, Presale>,
    //signer
    #[account(mut)]
    pub admin: Signer<'info>,
    //vault token account
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut,seeds = [b"presale".as_ref(),admin.key().as_ref(),],bump,)]
    pub presale: Account<'info, Presale>,
    // signer
    #[account(mut)]
    pub sender: Signer<'info>,
    /// CHECK: Safe
    #[account(mut)]
    pub admin: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    #[account(mut,seeds = [b"presale".as_ref(),admin.key().as_ref(),],bump,)]
    pub presale: Account<'info, Presale>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[account]
pub struct Presale {
    pub initialized: bool,
    pub amount_raised: u64,
    pub presale_active: bool,
    pub admin: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Account already initialized")]
    AccountAlreadyInitialized,
    #[msg("Missing required Signature")]
    MissingRequiredSignature,
    #[msg("Argument is invalid")]
    InvalidArgument,
    #[msg("Insufficient Funds")]
    InsufficientFunds,
    #[msg("Invalid account Data")]
    InvalidAccountData,
    #[msg("Cant complete transfer")]
    CantCompleteTransfer,
    #[msg("Invalid token amount")]
    InvalidTokenAmount,
    #[msg("Amount overflow")]
    Overflow,
    #[msg("Amount underflow")]
    UnderFlow,
    #[msg("Not Divisable")]
    DivisionError,
}
