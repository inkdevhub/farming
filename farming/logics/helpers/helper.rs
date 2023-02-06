use ink::{
    env::CallFlags,
    prelude::vec::Vec,
};
use openbrush::{
    contracts::psp22::{
        PSP22Error,
        PSP22Ref,
    },
    traits::{
        AccountId,
        Balance,
        String,
    },
};

#[macro_export]
macro_rules! ensure {
    ( $x:expr, $y:expr $(,)? ) => {{
        if !$x {
            return Err($y.into())
        }
    }};
}

#[inline]
pub fn transfer_from_with_reentrancy(
    token: AccountId,
    from: AccountId,
    to: AccountId,
    value: Balance,
) -> Result<(), PSP22Error> {
    match PSP22Ref::transfer_from_builder(&token, from, to, value, Vec::new())
        .call_flags(CallFlags::default().set_allow_reentry(true))
        .try_invoke()
    {
        Ok(Ok(res)) => res,
        _ => Err(PSP22Error::Custom(String::from("Transfer failed"))),
    }
}
