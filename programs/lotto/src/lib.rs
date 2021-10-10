use anchor_lang::prelude::*;

declare_id!("283J3ppWdCmM9FoYv95x6q9EsDa1RXCfG8xQXE3ccfMG");

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
        Ok(())
    }

    //pub fn trigger_payout(ctx: Context<Initialize>) -> ProgramResult {
        //Ok(())
    //}

    //// Participant functions
    pub fn create_participant(ctx: Context<CreateParticipant>, authority: Pubkey) -> ProgramResult {
        let raffle_participant = &mut ctx.accounts.raffle_participant;
        raffle_participant.num_tickets = 0;
        raffle_participant.authority = authority;
        Ok(())
    }

    pub fn buy_ticket(ctx: Context<BuyTicket>) -> ProgramResult {
        let raffle_acct = &mut ctx.accounts.raffle;
        Ok(())
    }
}

// Authorized user creates raffle
// Anybody can buy raffle ticket
// When tickets are out, authorized user can trigger payout

#[derive(Accounts)]
pub struct CreateRaffle<'info> {
    #[account(init, payer = authority, space = 24 + 24)] // TODO: need the extra 24?
    pub raffle: Account<'info, Raffle>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateParticipant<'info> {
    #[account(init, payer = authority, space = 8 + 40)]
    pub raffle_participant: Account<'info, RaffleParticipant>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub raffle: Account<'info, Raffle>,
    #[account(mut, has_one = authority)]
    pub participant: Account<'info, RaffleParticipant>,
    pub authority: Signer<'info>,
}

//#[derive(Accounts)]
//pub struct BuyTicket<'info> {
//}

#[account]
pub struct RaffleParticipant {
    pub num_tickets: u64,
    pub authority: Pubkey,
}

#[account]
pub struct Raffle {
    pub starting_tickets: u64,
    pub tickets_left: u64,
    pub ticket_price: u64,
}

#[error]
pub enum ErrorCode {
    #[msg("There are no more tickets left to buy for this raffle!")]
    NoMoreTickets,
}


