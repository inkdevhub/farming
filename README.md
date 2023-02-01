# Farming
A farming dApp implementation of [ArthSwap master chef](https://github.com/ArthSwap/ArthSwap-MasterChef) adapted from
[sushiswap](https://github.com/sushiswap/sushiswap/blob/archieve/canary/contracts/MasterChefV2.sol)

### Purpose
This is an unaudited implementation ready to be used.

### Status
- :white_check_mark: contracts
- :white_check_mark: integration tests
- :white_large_square: UI (January 2023)
- :white_large_square: Audit

### Versions
[ink! 4.0 beta (latest)](https://github.com/paritytech/ink/tree/4655a8b4413cb50cbc38d1b7c173ad426ab06cde)   
[openbrush 3.0.0 beta (latest)](https://github.com/727-Ventures/openbrush-contracts/tree/14ff655a0d83440f40c57c82d9a33e4c5b981da7)

### License
Apache 2.0

## 🏗️ How to use - Contracts
##### 💫 Build
Use these [instructions](https://use.ink/getting-started/setup) to set up your ink!/Rust environment    
Run this command in the contract folder:

```sh
cargo contract build
```

##### 💫 Run unit test

```sh
cargo test
```
##### 💫 Deploy
First start your local node.  
Deploy using polkadot JS. Instructions on [Astar docs](https://docs.astar.network/docs/wasm/sc-dev/polkadotjs-ui)

##### 💫 Run integration test
First start your local node. Recommended [swanky-node](https://github.com/AstarNetwork/swanky-node)

```sh
yarn
yarn compile
yarn test
```