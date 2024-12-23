import { useMemo, useCallback } from 'react';
import { useReadContracts } from 'wagmi';
import { normalizeBN, RAY, rayDiv, rayMul } from '@aave/math-utils';
import { BigNumber } from 'bignumber.js';

import { calculateApy } from '../../functions';
import { contracts, assetAddresses, abis } from '../../config';

import { useProtocolReservesData } from './reserves';

export function useProtocolInterestRate() {
  const { reserveDataMap } = useProtocolReservesData();
  const {
    data: interestRateDataResults,
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

  const getInterestRateData = useCallback(() => {
    if (!interestRateDataResults) {
      return assetAddresses.reduce(
        (acc, asset) => {
          acc[asset] = {
            supply: 0,
            borrow: 0,
          };
          return acc;
        },
        {} as Record<string, any>,
      );
    }

    return assetAddresses.reduce(
      (acc, asset, index) => {
        const result = interestRateDataResults[index];
        if (result && result.status === 'success') {
          acc[asset] = {
            supply: calculateApy(
              (reserveDataMap[asset] as any).currentLiquidityRate,
            ),
            borrow: calculateApy(
              (reserveDataMap[asset] as any).currentVariableBorrowRate,
            ),
          };
        } else {
          console.error(`Failed to get interest rate data for asset: ${asset}`);
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [interestRateDataResults]);

  const interestRateDataMap = useMemo(
    () => getInterestRateData(),
    [getInterestRateData],
  );

  return { interestRateDataMap, isLoading, isError };
}

interface Rates {
  variableRate: number;
  utilization: number;
}

export function useProtocolInterestRateModel(
  token: string,
  interestRateStrategyData: any,
  methods: any,
) {
  const rates: Rates[] = [];

  if (!interestRateStrategyData) return [];

  const params = methods.reduce(
    (acc: any, method: any, index: any) => {
      const result = interestRateStrategyData[index];
      if (result && result.status === 'success') {
        acc[method] = interestRateStrategyData[index].result;
      } else {
        console.error(
          `Failed to get interest rate data for ${token}, method: ${method}`,
        );
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const variableRateSlope1 = params['getVariableRateSlope1'];
  const variableRateSlope2 = params['getVariableRateSlope2'];
  const optimalUsageRatio = params['OPTIMAL_USAGE_RATIO'];
  const baseVariableBorrowRate = params['getBaseVariableBorrowRate'];

  const resolution = 200;
  const step = 100 / resolution;
  const formattedOptimalUtilizationRate = normalizeBN(
    optimalUsageRatio,
    25,
  ).toNumber();

  for (let i = 0; i <= resolution; i++) {
    const utilization = i * step;

    if (utilization === 0) {
      rates.push({
        variableRate: 0,
        utilization,
      });
    }
    // When hovering below optimal utilization rate, actual data
    else if (utilization < formattedOptimalUtilizationRate) {
      const theoreticalVariableAPY = normalizeBN(
        new BigNumber(baseVariableBorrowRate).plus(
          rayDiv(
            rayMul(variableRateSlope1, normalizeBN(utilization, -25)),
            optimalUsageRatio,
          ),
        ),
        27,
      ).toNumber();
      rates.push({
        variableRate: theoreticalVariableAPY,
        utilization,
      });
    }
    // When hovering above optimal utilization rate, hypothetical predictions
    else {
      const excess = rayDiv(
        normalizeBN(utilization, -25).minus(optimalUsageRatio),
        RAY.minus(optimalUsageRatio),
      );
      const theoreticalVariableAPY = normalizeBN(
        new BigNumber(baseVariableBorrowRate)
          .plus(variableRateSlope1)
          .plus(rayMul(variableRateSlope2, excess)),
        27,
      ).toNumber();
      rates.push({
        variableRate: theoreticalVariableAPY,
        utilization,
      });
    }
  }

  return rates;
}
