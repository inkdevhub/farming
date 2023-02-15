import fs from 'fs';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';
import Farming_factory from '../types/constructors/master_chef_contract';
import Token from '../types/contracts/psp22_token';
import Farming from '../types/contracts/master_chef_contract';
import 'dotenv/config';
import '@polkadot/api-augment';

// Create a new instance of contract
const wsProvider = new WsProvider('wss://rpc.shibuya.astar.network');
// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519' });
// See https://github.com/swanky-dapps/dex/pull/10
const aploAddress = 'WTUDjFZ1LkPy3Vgud8qrN9iZN36E2Lke899eMhSrJ6FzRPg';
const aploSbyAddress = 'ZMobUaTH5xv924rygieNjcQsG8528DNxvxbZa85v7pYTHxS';
const usdcSbyAddress = 'aQrcsubte7qkajFwCEPn5wEe6bhkRruT8NJYsf7CevMa9MN';
const usdtSbyAddress = 'YFLs6cukCTg9bwAMm8Bc6Qzh2WzcrZusUVzYDvM11pkJCLu';

async function main(): Promise<void> {
  const api = await ApiPromise.create({ provider: wsProvider });
  const deployer = keyring.addFromUri(process.env.PRIVATE_KEY);
  const aplo = new Token(aploAddress, deployer, api);
  const farmingContractRaw = JSON.parse(
    fs.readFileSync(
      __dirname + `/../artifacts/master_chef_contract.contract`,
      'utf8',
    ),
  );
  const farmingAbi = new Abi(farmingContractRaw);
  let { gasRequired } = await api.call.contractsApi.instantiate(
    deployer.address,
    0,
    null,
    null,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { Upload: farmingAbi.info.source.wasm },
    farmingAbi.constructors[0].toU8a([aplo.address]),
    '',
  );

  const farmingFactory = new Farming_factory(api, deployer);
  const { address: farmingAddress } = await farmingFactory.new(aplo.address, {
    gasLimit: gasRequired,
  });
  console.log('farming address:', farmingAddress);
  const farming = new Farming(farmingAddress, deployer, api);

  ({ gasRequired } = await aplo.query.mint(
    farming.address,
    parseUnits(1_000_000_000).toString(),
  ));
  await aplo.tx.mint(farming.address, parseUnits(1_000_000_000).toString(), {
    gasLimit: gasRequired,
  });

  ({ gasRequired } = await farming.query.add(30, aploSbyAddress, null));
  await farming.tx.add(10, aploSbyAddress, null, {
    gasLimit: gasRequired,
  });

  ({ gasRequired } = await farming.query.add(15, usdcSbyAddress, null));
  await farming.tx.add(10, usdcSbyAddress, null, {
    gasLimit: gasRequired,
  });

  ({ gasRequired } = await farming.query.add(15, usdtSbyAddress, null));
  await farming.tx.add(10, usdtSbyAddress, null, {
    gasLimit: gasRequired,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function parseUnits(amount: bigint | number, decimals = 18): bigint {
  return BigInt(amount) * 10n ** BigInt(decimals);
}
