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

export function useUserPositionsData(
  isConnected: boolean,
  address: `0x${string}` | undefined,
): UserPositionsData {
  const { reserveDataMap } = useProtocolReservesData();
  const { priceDataMap } = useProtocolPriceData();
  const {
    totalBalanceChange,
    totalBalanceChangePercentage,
    apyChange,
    apyChangePercentage,
  } = useGetUserBalanceHistory(address);
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

  // Early return if we aren’t connected or we don’t have a valid address
  if (!isConnected || !address || !reserveDataMap) {
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
      apyChange: 0,
      apyChangePercentage: 0,
    };
  }

  // --- Helpers to safely read BigInt values and convert to floating numbers ---
  const toBigIntSafe = (value: string | number | bigint | undefined) =>
    value ? BigInt(value) : 0n;

  const powerOfTen = (exp: number) => 10n ** BigInt(exp);

  /**
   * Example usage:
   *   bigIntToFloat(123456789n, 8) => 1.23456789
   */
  const bigIntToFloat = (value: bigint, decimals: number) =>
    Number(value) / Number(powerOfTen(decimals));

  const supplied: UserPositionData[] = userReservesData
    ? (userReservesData as any)['0']
        .map((e: UserReserveData) => {
          const reserveData = reserveDataMap[e.underlyingAsset];

          if (!reserveData) {
            return {
              underlyingAsset: e.underlyingAsset,
              assetName: tokenNameMap[e.underlyingAsset],
              balance: 0,
              value: 0,
              price: 0,
              apr: 0,
              icon: iconsMap[tokenNameMap[e.underlyingAsset]],
              isCollateralEnabled: e.usageAsCollateralEnabledOnUser,
            };
          }

          // Convert scaledATokenBalance to BigInt
          const balanceBn =
            (e.scaledATokenBalance * reserveData.liquidityIndex) /
            1000000000000000000000000000n;
          const decimals = tokenDecimalsMap[e.underlyingAsset] ?? 0;

          // Normalize the user’s supply position into a floating number
          const balanceNormalized = bigIntToFloat(balanceBn, decimals);

          // Price data (stored on-chain or from an oracle) also read as BigInt
          const rawPriceBn = toBigIntSafe(
            (priceDataMap as any)[e.underlyingAsset],
          );
          // Price in USD (often 8 decimals or sometimes 6, depends on your oracle)
          const priceUsd = bigIntToFloat(rawPriceBn, 8);

          // Final USD value = normalized balance * price
          const valueUsd = balanceNormalized * priceUsd;

          // APY uses reserveData’s currentLiquidityRate (already a BigInt)
          const liquidityRateBn =
            reserveDataMap[e.underlyingAsset]?.currentLiquidityRate || 0n;
          const apr = calculateApy(liquidityRateBn);

          return {
            underlyingAsset: e.underlyingAsset,
            assetName: tokenNameMap[e.underlyingAsset],
            balance: balanceNormalized,
            value: valueUsd,
            price: priceUsd,
            apr,
            icon: iconsMap[tokenNameMap[e.underlyingAsset]],
            isCollateralEnabled: e.usageAsCollateralEnabledOnUser,
          };
        })
        .filter((item: UserPositionData) => item.balance > 0)
    : [];

  const borrowed: UserPositionData[] = userReservesData
    ? (userReservesData as any)['0']
        .map((e: UserReserveData) => {
          const reserveData = reserveDataMap[e.underlyingAsset];

          if (!reserveData) {
            return {
              underlyingAsset: e.underlyingAsset,
              assetName: tokenNameMap[e.underlyingAsset],
              balance: 0,
              value: 0,
              apr: 0,
              icon: iconsMap[tokenNameMap[e.underlyingAsset]],
              isCollateralEnabled: null,
            };
          }

          // Convert scaledVariableDebt to BigInt
          const balanceBn =
            (e.scaledVariableDebt * reserveData.variableBorrowIndex) /
            1000000000000000000000000000n;
          const debtBn = toBigIntSafe(balanceBn);
          const decimals = tokenDecimalsMap[e.underlyingAsset] ?? 0;

          // Normalize the user’s borrow position into a floating number
          const balanceNormalized = bigIntToFloat(debtBn, decimals);

          // Price data
          const rawPriceBn = toBigIntSafe(
            (priceDataMap as any)[e.underlyingAsset],
          );
          const priceUsd = bigIntToFloat(rawPriceBn, 8);

          // Final USD value = normalized balance * price
          const valueUsd = balanceNormalized * priceUsd;

          // APY uses reserveData’s currentVariableBorrowRate (already BigInt)
          const variableBorrowRateBn =
            reserveDataMap[e.underlyingAsset]?.currentVariableBorrowRate || 0n;
          const apr = calculateApy(variableBorrowRateBn);

          return {
            underlyingAsset: e.underlyingAsset,
            assetName: tokenNameMap[e.underlyingAsset],
            balance: balanceNormalized,
            value: valueUsd,
            apr,
            icon: iconsMap[tokenNameMap[e.underlyingAsset]],
            isCollateralEnabled: null,
            pool: 'Core',
          };
        })
        .filter((item: UserPositionData) => item.balance > 0)
    : [];

  // --- Aggregations ---
  const totalSupply = supplied.reduce((acc, item) => acc + item.value, 0);
  const totalBorrow = borrowed.reduce((acc, item) => acc + item.value, 0);
  const totalBorrowAvailable = supplied.reduce(
    (acc, item) => acc + item.value * (ltvMap[item.underlyingAsset] ?? 0),
    0,
  );
  const totalLiquidationThreshold = supplied.reduce(
    (acc, item) => acc + item.value * (liqMap[item.underlyingAsset] ?? 0),
    0,
  );

  const supplyInterestEarned = supplied.reduce(
    (acc, item) => acc + (item.apr / 100) * item.value,
    0,
  );
  const borrowInterestEarned = borrowed.reduce(
    (acc, item) => acc + (item.apr / 100) * item.value,
    0,
  );

  // Net APY in percentage
  const netApy =
    ((supplyInterestEarned - borrowInterestEarned) /
      (totalSupply - totalBorrow || 1)) *
    100;

  return {
    supplied,
    borrowed,

    totalSupplyUsd: totalSupply,
    totalBorrowUsd: totalBorrow,
    totalBalanceUsd: totalSupply - totalBorrow,
    totalBorrowLimit: totalBorrowAvailable,
    healthFactor: totalBorrow ? totalLiquidationThreshold / totalBorrow : 0,
    netApy: isNaN(netApy) ? 0 : netApy,
    totalLiquidationThreshold,

    totalBalanceChange,
    totalBalanceChangePercentage,

    apyChange,
    apyChangePercentage,
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
