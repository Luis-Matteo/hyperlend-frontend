import { useReadContract } from 'wagmi';

import { calculateApy } from '../../functions';
import { UserReserveData, UserPositionData, UserPositionsData } from '../../types';
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

export function useUserPositionsData(
  isConnected: boolean,
  address: `0x${string}` | undefined,
): UserPositionsData {
  const { reserveDataMap } = useProtocolReservesData();
  const { priceDataMap } = useProtocolPriceData();
  const { totalBalanceChange, totalBalanceChangePercentage } =
    useGetUserBalanceHistory(address);
  const { data: userReservesData } = useReadContract({
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

  const supplied: UserPositionData[] = userReservesData
    ? (userReservesData as any)['0']
        .map((e: UserReserveData) => {
          const balanceNormalized =
            Number(e.scaledATokenBalance) /
            Math.pow(10, tokenDecimalsMap[e.underlyingAsset]);
          const priceUsd =
            Number((priceDataMap as any)[e.underlyingAsset]) / Math.pow(10, 8);
          const valueUsd = priceUsd * balanceNormalized;
          const apr = calculateApy(
            reserveDataMap[e.underlyingAsset]?.currentLiquidityRate ||
              BigInt(0),
          );

          return {
            underlyingAsset: e.underlyingAsset,
            assetName: tokenNameMap[e.underlyingAsset],
            balance: balanceNormalized,
            value: valueUsd,
            price: priceUsd,
            apr: apr,
            icon: iconsMap[tokenNameMap[e.underlyingAsset]],
            isCollateralEnabled: e.usageAsCollateralEnabledOnUser,
          };
        })
        .filter((item: UserPositionData) => item.balance > 0)
    : [];

  const borrowed: UserPositionData[] = userReservesData
    ? (userReservesData as any)['0']
        .map((e: UserReserveData) => {
          const balanceNormalized =
            Number(e.scaledVariableDebt) /
            Math.pow(10, tokenDecimalsMap[e.underlyingAsset]);
          const priceUsd =
            Number((priceDataMap as any)[e.underlyingAsset]) / Math.pow(10, 8);
          const valueUsd = priceUsd * balanceNormalized;
          const apr = calculateApy(
            reserveDataMap[e.underlyingAsset]?.currentVariableBorrowRate ||
              BigInt(0),
          );

          return {
            underlyingAsset: e.underlyingAsset,
            assetName: tokenNameMap[e.underlyingAsset],
            balance: balanceNormalized,
            value: valueUsd,
            apr: apr,
            icon: iconsMap[tokenNameMap[e.underlyingAsset]],
            isCollateralEnabled: null,
          };
        })
        .filter((item: UserPositionData) => item.balance > 0)
    : [];

  const totalSupply = supplied.reduce(
    (partialSum: number, a: any) => partialSum + a.value,
    0,
  );
  const totalBorrow = borrowed.reduce(
    (partialSum: number, a: any) => partialSum + a.value,
    0,
  );
  const totalBorrowAvailable = supplied.reduce(
    (partialSum: number, a: any) =>
      partialSum + a.value * ltvMap[a.underlyingAsset],
    0,
  );
  const totalLiquidationThreshold = supplied.reduce(
    (partialSum: number, a: any) =>
      partialSum + a.value * liqMap[a.underlyingAsset],
    0,
  );

  const supplyInterestEarned = supplied.reduce(
    (partialSum: number, a: any) => partialSum + (a.apr / 100) * a.value,
    0,
  );
  const borrowInterestEarned = borrowed.reduce(
    (partialSum: number, a: any) => partialSum + (a.apr / 100) * a.value,
    0,
  );
  const netApy = (supplyInterestEarned - borrowInterestEarned) / 100;

  return {
    supplied: supplied,
    borrowed: borrowed,

    totalSupplyUsd: totalSupply,
    totalBorrowUsd: totalBorrow,
    totalBalanceUsd: totalSupply - totalBorrow,
    totalBorrowLimit: totalBorrowAvailable,
    healthFactor: totalLiquidationThreshold / totalBorrow,
    netApy: isNaN(netApy) ? 0 : netApy,
    totalLiquidationThreshold: totalLiquidationThreshold,

    totalBalanceChange: totalBalanceChange,
    totalBalanceChangePercentage: totalBalanceChangePercentage,
  };
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
