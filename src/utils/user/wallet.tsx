import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';

import {
  contracts,
  assetAddresses,
  tokenDecimalsMap,
  abis,
  wrappedTokenProtocolTokens,
} from '../config';

export function useUserWalletValueUsd() {
  const { address, isConnected } = useAccount();

  const balanceDataResults = assetAddresses.map((asset) =>
    useReadContract(
      isConnected && address
        ? ({
            abi: erc20Abi,
            address: asset,
            functionName: 'balanceOf',
            args: [address],
            query: {
              refetchInterval: 10000,
            },
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
            query: {
              refetchInterval: 10000,
            },
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

export function useUserTokenBalance(
  isConnected: boolean,
  token: string,
  address?: string,
): any {
  const { data, refetch } = useReadContract(
    isConnected && address
      ? ({
          abi: erc20Abi,
          address: token,
          functionName: 'balanceOf',
          args: [address],
          query: {
            refetchInterval: 10000,
          },
        } as any)
      : undefined,
  );

  return {
    data,
    refetch,
  };
}

export function useUserAllowance(
  isConnected: boolean,
  contract: string,
  owner: string,
  spender: string,
): any {
  const { data } = useReadContract(
    isConnected
      ? ({
          abi: erc20Abi,
          address: contract,
          functionName: 'allowance',
          args: [owner, spender],
          query: {
            refetchInterval: 10000,
          },
        } as any)
      : undefined,
  );
  return data;
}

interface IUserWrappedTokenAllowanceData {
  hTokenAllowance?: any;
  dTokenAllowance?: any;
}

export function useUserWrappedTokenAllowanceData(
  token: string,
  owner: string,
  spender: string,
): IUserWrappedTokenAllowanceData {
  const { address, isConnected } = useAccount();
  //allowances to wrappedTokenGatewayV3
  const { data: userHTokenAllowance } = useReadContract(
    isConnected && address
      ? ({
          abi: erc20Abi,
          address: wrappedTokenProtocolTokens[token].hToken,
          functionName: 'allowance',
          args: [owner, spender],
          query: {
            refetchInterval: 10000,
          },
        } as any)
      : undefined,
  );

  const { data: userDTokenAllowance } = useReadContract(
    isConnected && address
      ? ({
          abi: abis.variableDebtToken,
          address: wrappedTokenProtocolTokens[token].dToken,
          functionName: 'borrowAllowance',
          args: [owner, spender],
          query: {
            refetchInterval: 10000,
          },
        } as any)
      : undefined,
  );

  return {
    hTokenAllowance: userHTokenAllowance,
    dTokenAllowance: userDTokenAllowance,
  };
}
