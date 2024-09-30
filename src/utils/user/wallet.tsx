import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from 'viem';

import {
  contracts,
  assetAddresses,
  tokenDecimalsMap,
  abis,
} from '../config';

export function useUserWalletBalance() {
  const { address, isConnected } = useAccount();

  const balanceDataResults = assetAddresses.map((asset) =>
    useReadContract(
      isConnected && address
        ? ({
            abi: erc20Abi,
            address: asset,
            functionName: 'balanceOf',
            args: [address],
          } as any)
        : undefined,
    ),
  );

  const priceDataResults = assetAddresses.map((asset) =>
    useReadContract(
      isConnected && address
        ? {
            abi: abis.oracle,
            address: contracts.oracle,
            functionName: 'getAssetPrice',
            args: [asset],
          }
        : undefined,
    ),
  );

  if (!isConnected || !address) {
    return { walletBalanceValue: 0 };
  }

  const balanceDataMap = assetAddresses.reduce(
    (acc, asset, index) => {
      acc[asset] = balanceDataResults[index].data;
      return acc;
    },
    {} as Record<string, any>,
  );

  const priceDataMap = assetAddresses.reduce(
    (acc, asset, index) => {
      acc[asset] = priceDataResults[index].data;
      return acc;
    },
    {} as Record<string, any>,
  );

  const walletBalanceValue = assetAddresses.reduce(
    (partialSum: number, a: any) =>
      partialSum +
      (Number(priceDataMap[a]) / Math.pow(10, 8)) *
        (Number(balanceDataMap[a]) / Math.pow(10, tokenDecimalsMap[a])),
    0,
  );

  return {
    walletBalanceValue: walletBalanceValue,
  };
}

export function useUserAllowance(
  contract: string,
  owner: string,
  spender: string,
) {
  const { address, isConnected } = useAccount();
  const { data } = useReadContract(
    isConnected && address
      ? ({
          abi: erc20Abi,
          address: contract,
          functionName: 'allowance',
          args: [owner, spender],
        } as any)
      : undefined,
  );
  return data;
}