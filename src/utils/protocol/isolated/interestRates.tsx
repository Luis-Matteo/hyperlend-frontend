import { useMemo, useCallback } from 'react';
import { useReadContracts } from 'wagmi';
import { normalizeBN, RAY, rayDiv, rayMul } from '@aave/math-utils';
import { BigNumber } from 'bignumber.js';

import { contracts, abis, tokenToRateStrategyMap } from '../../config';

export function useProtocolInterestRate(reserveDataMap: any) {
  const getInterestRateData = useCallback(() => {
    if (!reserveDataMap) {
      return {};
    }

    const newObject: Record<string, any> = {};
    Object.keys(reserveDataMap).forEach((key) => {
      newObject[key] = {
        supply:
          (Number(reserveDataMap[key].interestRate.ratePerSec) *
            (60 * 60 * 24 * 365)) /
          1e16,
        borrow:
          (Number(reserveDataMap[key].interestRate.ratePerSec) *
            (60 * 60 * 24 * 365)) /
          1e16,
      };
    });
    return newObject;
  }, [reserveDataMap]);

  const interestRateDataMap = useMemo(
    () => getInterestRateData(),
    [reserveDataMap],
  );

  return { interestRateDataMap };
}

interface Rates {
  variableRate: number;
  utilization: number;
}

export function useProtocolInterestRateModel(token: string) {
  const rates: Rates[] = [];

  const rateStrategyType = tokenToRateStrategyMap[token] || 'volatileOne';
  const methods = [
    'getVariableRateSlope1',
    'getVariableRateSlope2',
    'OPTIMAL_USAGE_RATIO',
    'getBaseVariableBorrowRate',
  ];

  const { data: interestRateStrategyData } = useReadContracts({
    contracts: methods.map((method) => ({
      abi: abis.rateStrategy,
      address: contracts.rateStrategies[rateStrategyType],
      functionName: method,
    })),
  });
  if (!interestRateStrategyData) return [];

  const params = methods.reduce(
    (acc, method, index) => {
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
