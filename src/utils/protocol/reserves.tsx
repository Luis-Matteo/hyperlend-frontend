import { useMemo, useCallback } from 'react';
import { useReadContracts, useReadContract } from 'wagmi';

import { Reserve, ReservesData } from '../types';
import { contracts, assetAddresses, abis } from '../config';

export function useProtocolReservesData(): ReservesData {
  const {
    data: reserveDataResults,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: assetAddresses.map((asset) => ({
      abi: abis.pool,
      address: contracts.pool,
      functionName: 'getReserveData',
      args: [asset],
    })),
  });

  const getReservesData = useCallback(() => {
    if (!reserveDataResults) {
      return assetAddresses.reduce(
        (acc, asset) => {
          acc[asset] = {
            aTokenAddress: '',
            accruedToTreasury: 0n,
            configuration: { data: 0n },
            currentLiquidityRate: 0n,
            currentStableBorrowRate: 0n,
            currentVariableBorrowRate: 0n,
            id: 0,
            interestRateStrategyAddress: '0x',
            isolationModeTotalDebt: 0n,
            lastUpdateTimestamp: 0,
            liquidityIndex: 0n,
            stableDebtTokenAddress: '',
            unbacked: 0n,
            variableBorrowIndex: 0n,
            variableDebtTokenAddress: '',
          };
          return acc;
        },
        {} as Record<string, Reserve>,
      );
    }

    return assetAddresses.reduce(
      (acc, asset, index) => {
        const result = reserveDataResults[index];
        if (result && result.status === 'success') {
          acc[asset] = result.result as Reserve;
        } else {
          console.error(`Failed to get reserve data for asset: ${asset}`);
        }
        return acc;
      },
      {} as Record<string, Reserve>,
    );
  }, [reserveDataResults, assetAddresses]);

  const reserveDataMap = useMemo(() => getReservesData(), [getReservesData]);

  return { reserveDataMap, isLoading, isError };
}

export function useProtocolAssetReserveData(asset: string) {
  const { data } = useReadContract({
    abi: abis.protocolDataProvider,
    address: contracts.protocolDataProvider,
    functionName: 'getReserveData',
    args: [asset],
  });

  const dataAny = (data as any) || [];

  return {
    unbacked: dataAny[0],
    accruedToTreasuryScaled: dataAny[1],
    totalAToken: dataAny[2],
    totalStableDebt: dataAny[3],
    totalVariableDebt: dataAny[4],
    liquidityRate: dataAny[5],
    variableBorrowRate: dataAny[6],
    stableBorrowRate: dataAny[7],
    averageStableBorrowRate: dataAny[8],
    liquidityIndex: dataAny[9],
    variableBorrowIndex: dataAny[10],
    lastUpdateTimestamp: dataAny[11],
  };
}
