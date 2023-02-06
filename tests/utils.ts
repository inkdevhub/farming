import type { WeightV2 } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
export function parseUnits(amount: bigint | number, decimals = 18): bigint {
  return BigInt(amount) * 10n ** BigInt(decimals);
}

export function scaleWeightV2(
  api: ApiPromise,
  weight: WeightV2,
  scale: number,
): WeightV2 {
  return api.registry.createType('WeightV2', {
    refTime: (weight as WeightV2).refTime.unwrap().muln(scale),
    proofSize: (weight as WeightV2).proofSize.unwrap().muln(scale),
  }) as WeightV2;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithDefaultMethods<T extends { tx: any }> = T &
  T['tx'] & { connect: (signer: KeyringPair) => WithDefaultMethods<T> };

export function wrapTxWithGasRequired<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { tx: any; query: any; withSigner: any },
>(contract: T): WithDefaultMethods<T> {
  getClassMethodNames(contract.tx).forEach((method: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contract[method] = async (...args: Array<any>): Promise<any> => {
      const { gasRequired } = await contract.query[method](...args);
      return await contract.tx[method](...args, { gasLimit: gasRequired });
    };
  });
  const contractExtended = contract as WithDefaultMethods<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contractExtended.connect = (signer: KeyringPair): any =>
    wrapTxWithGasRequired(contractExtended.withSigner(signer));
  return contractExtended;
}

export function getClassMethodNames(klass: Record<string, unknown>): unknown[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isFunction = (x: { [x: string]: any }, name: string): boolean =>
    typeof x[name] === 'function';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deepFunctions = (x: Record<string, unknown>): any =>
    x !== Object.prototype &&
    Object.getOwnPropertyNames(x)
      .filter((name) => isFunction(x, name))
      .concat(deepFunctions(Object.getPrototypeOf(x)) || []);
  const distinctDeepFunctions = (klass: Record<string, unknown>): unknown[] =>
    Array.from(new Set(deepFunctions(klass)));

  const allMethods = distinctDeepFunctions(klass);
  return allMethods.filter(
    (name: string) => name !== 'constructor' && !name.startsWith('__'),
  );
}

export function getSortedAddress(
  token0: string,
  token1: string,
): [string, string] {
  return token0 < token1 ? [token0, token1] : [token1, token0];
}
