use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
mod lotto {
    use super::*;
    // Only the 'centralized' owner can create, trigger payouts
    // Set the creator here
    pub fn create_raffle(ctx: Context<CreateRaffle>) -> ProgramResult {
        let raffle_acct = &mut ctx.accounts.raffle;
        raffle_acct.starting_tickets = 10;
        raffle_acct.tickets_left = 10;
        raffle_acct.ticket_price = 1;
        msg!(&raffle_acct.key().to_string());
        Ok(())
    }

    //pub fn trigger_payout(ctx: Context<Initialize>) -> ProgramResult {
        //Ok(())
    //}

    //// Participant functions
    //pub fn buy_ticket(ctx: Context<Initialize>) -> ProgramResult {
        //Ok(())
    //}
}

// Authorized user creates raffle
// Anybody can buy raffle ticket
// When tickets are out, authorized user can trigger payout

#[derive(Accounts)]
pub struct CreateRaffle<'info> {
    #[account(init, payer = authority, space = 24 + 40)]
    pub raffle: Account<'info, Raffle>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

//#[account]
//pub struct RaffleParticipant {
    //pub num_tickets: u64,
    //pub authority: Pubkey,
//}

#[account]
pub struct Raffle {
    pub starting_tickets: u64,
    pub tickets_left: u64,
    pub ticket_price: u64,
    pub authority: Pubkey,
}


