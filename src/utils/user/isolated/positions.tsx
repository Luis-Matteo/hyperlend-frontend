import { useReadContract } from 'wagmi';

import { calculateApy } from '../../functions';
import {
  UserReserveData,
  UserPositionData,
  UserPositionsData,
} from '../../types';
import {
  contracts,
  tokenNameMap,
  tokenDecimalsMap,
  iconsMap,
  ltvMap,
  abis,
  liqMap,
} from '../../config';

import { useProtocolReservesData } from '../../protocol/core/reserves';
import { useProtocolPriceData } from '../../protocol/core/prices';

import { useGetUserBalanceHistory } from '../history';

export function useUserPositionData(
  isConnected: boolean,
  address: `0x${string}` | undefined,
  pair: `0x${string}` | undefined
): any {

  const { data: userPairData } = useReadContract({
    abi: abis.uiPoolDataProvider,
    address: contracts.uiPoolDataProvider,
    functionName: 'getUserReservesData',
    args: [
      contracts.poolAddressesProvider,
      address || '0x0000000000000000000000000000000000000000',
    ],
    query: {
      refetchInterval: 10000,
    },
  });

  if (!isConnected || !address) {
    return {
      supplied: [],
      borrowed: [],

      totalSupplyUsd: 0,
      totalBorrowUsd: 0,
      totalBalanceUsd: 0,
      totalBorrowLimit: 0,
      healthFactor: 0,
      netApy: 0,
      totalLiquidationThreshold: 0,

      totalBalanceChange: 0,
      totalBalanceChangePercentage: 0,
    };
  }

  return null
}

export function useUserAccountData(address?: string) {
  const { data: userAccountData, refetch } = useReadContract({
    abi: abis.pool,
    address: contracts.pool,
    functionName: 'getUserAccountData',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: {
      refetchInterval: 10000,
    },
  });

  return { userAccountData, refetch };
}
