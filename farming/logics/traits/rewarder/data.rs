use default_deriver::DataDefault;
use openbrush::traits::{
    AccountId,
    Balance,
};

pub const STORAGE_KEY: u32 = openbrush::storage_unique_key!(Data);

#[openbrush::upgradeable_storage(STORAGE_KEY)]
#[derive(Debug, DataDefault)]
pub struct Data {
    pub reward_multiplier: Balance,
    pub reward_token: AccountId,
    pub master_chef: AccountId,
}
