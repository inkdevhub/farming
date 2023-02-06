#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[openbrush::contract]
pub mod rewarder {
    use farming::traits::rewarder::{
        data::*,
        getters::*,
        rewarder::*,
    };
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Rewarderontract {
        #[storage_field]
        rewarder: Data,
    }

    impl Rewarder for Rewarderontract {}

    impl RewarderGetters for Rewarderontract {}

    impl Rewarderontract {
        #[ink(constructor)]
        pub fn new(
            reward_multiplier: Balance,
            reward_token: AccountId,
            master_chef: AccountId,
        ) -> Self {
            let mut instance = Self::default();
            instance.rewarder.reward_multiplier = reward_multiplier;
            instance.rewarder.reward_token = reward_token;
            instance.rewarder.master_chef = master_chef;
            instance
        }
    }
}
