use default_deriver::DataDefault;
#[cfg(feature = "std")]
use ink::storage::traits::StorageLayout;
use ink::{
    prelude::vec::Vec,
    storage::Mapping,
};
use openbrush::traits::{
    AccountId,
    Balance,
};
use scale::{
    Decode,
    Encode,
};

pub const STORAGE_KEY: u32 = openbrush::storage_unique_key!(Data);

#[derive(Encode, Decode, Default)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
pub struct Pool {
    pub acc_arsw_per_share: u128,
    pub last_reward_block: u32,
    pub alloc_point: u32,
}

#[derive(Encode, Decode, Default)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
pub struct UserInfo {
    pub amount: Balance,
    pub reward_debt: i128,
}

#[openbrush::upgradeable_storage(STORAGE_KEY)]
#[derive(Debug, DataDefault)]
pub struct Data {
    /// Address of ARSW contract.
    pub arsw_token: AccountId,

    /// Info of each MasterChef user.
    /// key (`pool_id`: u32, `user_address`: AccountId )
    /// Value (`amount`: u128, `reward_debt`: u128)
    /// `amount` LP token amount the user has provided.
    /// `reward_debt` The amount of ARSW entitled to the user.
    pub user_info: Mapping<(u32, AccountId), UserInfo>,

    /// Info of each MasterChef pool.
    /// Key `pool_id`: u32
    /// Value Pool (`acc_arsw_per_share`: u128, `last_reward_block`: u32, `alloc_point`: u64 )
    /// `alloc_point` The amount of allocation points assigned to the pool.
    /// Also known as the amount of ARSW to distribute per block.
    pub pool_info: Mapping<u32, Pool>,
    pub pool_info_length: u32,

    /// Address of the LP token for each MasterChef pool.
    pub lp_tokens: Vec<AccountId>,

    /// Address of each `rewarder` contract in MasterChef.
    pub rewarders: Mapping<u32, AccountId>,

    /// Total allocation points. Must be the sum of all allocation points in all pools.
    pub total_alloc_point: u32,

    /// The block number when farming contract is deployed
    pub farming_origin_block: u32,
}
