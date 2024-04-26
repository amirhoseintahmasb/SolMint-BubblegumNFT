#![allow(clippy::result_large_err)]

pub mod actions;
pub use actions::*;

pub mod state;
pub use state::*;

use anchor_lang::prelude::*;
use solana_program::pubkey::Pubkey;
use spl_account_compression::{program::SplAccountCompression, Noop};

#[derive(Clone)]
pub struct MplBubblegum;

impl anchor_lang::Id for MplBubblegum {
    fn id() -> Pubkey {
        mpl_bubblegum::id()
    }
}

declare_id!("FC5Qxs25hfb7zGXUvr5tWn5mMz6Wp2hDnY1gATJGz2wE");

#[program]
pub mod compressed_nft {
    use super::*;

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn mint<'info>(
        ctx: Context<'_, '_, '_, 'info, Mint<'info>>,
        params: MintParams,
    ) -> Result<()> {
        Mint::actuate(ctx, params)
    }

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn verify<'info>(
        ctx: Context<'_, '_, '_, 'info, Verify<'info>>,
        params: VerifyParams,
    ) -> Result<()> {
        Verify::actuate(ctx, &params)
    }
}