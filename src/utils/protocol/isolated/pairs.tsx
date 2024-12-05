import { useMemo, useCallback } from 'react';
import { useReadContracts, useReadContract } from 'wagmi';

import { contracts, abis, excludeIsolatedPairs, tokenDecimalsMap, tokenFullNameMap, tokenNameMap, iconsMap } from '../../config';

import {
  calculateApyIsolated
} from '../../../utils/functions';

export function useProtocolPairsData(pairAddress?: string): any {
  let {
    data: availablePoolsResults, //get all deployed pairs
  } = useReadContract({
    abi: abis.isolatedPairRegistry,
    address: contracts.isolatedPairRegistry,
    functionName: 'getAllPairAddresses',
  });

  if (!availablePoolsResults) {
    availablePoolsResults = [];
  }

  if (pairAddress){
    availablePoolsResults = [pairAddress]
  }

  //for each pair, get borrowed asset, ltv, total supplied tokens, total borrow, total collateral
  const {
    data: pairResults,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: (availablePoolsResults as `0x${string}`[]).flatMap(
      (poolAddress: `0x${string}`) => [
        {
          abi: abis.uiDataProviderIsolated,
          address: contracts.uiDataProviderIsolated,
          functionName: 'getPairData',
          args: [poolAddress],
        },
      ],
    ),
  });

  const getPairsData = useCallback(() => {
    if (!pairResults) {
      return (availablePoolsResults as `0x${string}`[]).reduce(
        (acc, asset) => {
          acc[asset] = {
            pair: '',
            asset: '',
            collateral: '',
            decimals: 0n,
            exchangeRate: {
              oracle: '',
              highExchangeRate: 0n,
              lastTimestamp: 0n,
              lowExchangeRate: 0n,
              maxOracleDeviation: 0n,
              chainlinkAssetAddress: '',
              chainlinkCollateralAddress: '',
            },
            interestRate: {
              lastBlock: 0,
              feeToProtocolRate: 0,
              lastTimestamp: 0n,
              ratePerSec: 0n,
            },
            ltv: 0n,
            name: '',
            symbol: '0',
            totalAsset: 0n,
            totalBorrow: 0n,
            totalCollateral: 0n,
            availableLiquidit: 0n,
          };
          return acc;
        },
        {} as Record<string, any>,
      );
    }

    return (availablePoolsResults as `0x${string}`[]).reduce(
      (acc, asset, index) => {
        const result = pairResults[index];
        if (result && result.status === 'success' && !excludeIsolatedPairs.includes((result.result as any).pair)) {
          acc[asset] = result.result as any;
        } else {
          console.error(`Failed to get pair data for asset or pair is excluded: ${asset}`);
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [pairResults, availablePoolsResults]);

  const pairsDataMap = useMemo(() => getPairsData(), [getPairsData]);

  return { pairsDataMap, isLoading, isError };
}

interface IsolatedPairInfo {
  pair: string;
  asset: string;
  assetName: string;
  assetSymbol: string;
  assetIcon: string;
  collateral: string;
  collateralName: string;
  collateralSymbol: string;
  collateralIcon: string;
  totalAssets: number;
  totalAssetsUsd: number;
  supplyApy: number;
  totalBorrowed: number;
  totalBorrowedUsd: number;
  borrowApy: number;
  totalCollateral: number;
  totalCollateralUsd: number;
  availableLiquidity: number;
  availableLiquidityUsd: number;
  utilization: number;
  ltv: number;
  liquidationPenalty: number;
}

export function preparePairData(pair: any, priceDataMap: any): IsolatedPairInfo {
  const assetPriceUsd =
    priceDataMap[pair.exchangeRate.chainlinkAssetAddress] || 0n;
  const collateralPriceUsd =
    priceDataMap[pair.exchangeRate.chainlinkCollateralAddress] || 0n;
  const assetPriceUsdNormalized = Number(assetPriceUsd) / Math.pow(10, 8);
  const collateralPriceUsdNormalized =
    Number(collateralPriceUsd) / Math.pow(10, 8);

  const totalAssets =
    Number(pair.totalAsset) / Math.pow(10, tokenDecimalsMap[pair.asset]);
  const totalCollateral =
    Number(pair.totalCollateral) /
    Math.pow(10, tokenDecimalsMap[pair.collateral]);
  const totalBorrow =
    Number(pair.totalBorrow) / Math.pow(10, tokenDecimalsMap[pair.asset]);

  const UTIL_PREC = 100000n;
  const utilizationRateBn =
    pair.totalAsset == 0n
      ? 0n
      : (UTIL_PREC * pair.totalBorrow) / pair.totalAsset;
  const utilization = Number(utilizationRateBn) / Number(UTIL_PREC);

  const borrowApy = calculateApyIsolated(pair.interestRate.ratePerSec);
  const supplyApy =
    borrowApy *
    utilization *
    (1 - Number(pair.interestRate.feeToProtocolRate) / 100000);

  const availableLiquidity =
    Number(pair.availableLiquidity) /
    Math.pow(10, tokenDecimalsMap[pair.asset]);
  const availableLiquidityUsd =
    availableLiquidity * assetPriceUsdNormalized;

  const market: IsolatedPairInfo = {
    pair: pair.pair,
    asset: pair.asset,
    assetName: tokenFullNameMap[pair.asset],
    assetSymbol: tokenNameMap[pair.asset],
    assetIcon: iconsMap[tokenNameMap[pair.asset]],
    collateral: pair.collateral,
    collateralName: tokenFullNameMap[pair.collateral],
    collateralSymbol: tokenNameMap[pair.collateral],
    collateralIcon: iconsMap[tokenNameMap[pair.collateral]],
    totalAssets: totalAssets,
    totalAssetsUsd: totalAssets * assetPriceUsdNormalized,
    supplyApy: supplyApy,
    totalBorrowed: totalBorrow,
    totalBorrowedUsd: totalBorrow * assetPriceUsdNormalized,
    borrowApy: borrowApy,
    totalCollateral: totalCollateral,
    totalCollateralUsd: totalCollateral * collateralPriceUsdNormalized,
    availableLiquidity: availableLiquidity,
    availableLiquidityUsd: availableLiquidityUsd,
    utilization: utilization * 100,
    ltv: Number(pair.ltv) / 1000,
    liquidationPenalty: 10
  };

  return market;
}