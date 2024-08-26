import { useMemo, useCallback, useState, useEffect } from 'react';
import { useReadContracts, useReadContract } from 'wagmi'
import { normalizeBN, RAY, rayDiv, rayMul } from '@aave/math-utils';
import { BigNumber } from 'bignumber.js';

import { calculateApy } from './functions';
import { Reserve, ReservesData } from '../utils/types'
import { contracts, assetAddresses, abis, tokenToRateStrategyMap } from './tokens';

export function useProtocolReservesData(): ReservesData {
  const { data: reserveDataResults, isLoading, isError } = useReadContracts({
    contracts: assetAddresses.map(asset => ({
      abi: abis.pool,
      address: contracts.pool,
      functionName: 'getReserveData',
      args: [asset],
    }))
  })

  const getReservesData = useCallback(() => {
    if (!reserveDataResults) {
      return assetAddresses.reduce((acc, asset) => {
        acc[asset] = {
          aTokenAddress: "",
          accruedToTreasury: 0n,
          configuration: { data: 0n },
          currentLiquidityRate: 0n,
          currentStableBorrowRate: 0n,
          currentVariableBorrowRate: 0n,
          id: 0,
          interestRateStrategyAddress: "0x",
          isolationModeTotalDebt: 0n,
          lastUpdateTimestamp: 0,
          liquidityIndex: 0n,
          stableDebtTokenAddress: "",
          unbacked: 0n,
          variableBorrowIndex: 0n,
          variableDebtTokenAddress: ""
        }
        return acc
      }, {} as Record<string, Reserve>)
    }

    return assetAddresses.reduce((acc, asset, index) => {
      const result = reserveDataResults[index]
      if (result && result.status === 'success') {
        acc[asset] = result.result as Reserve
      } else {
        console.error(`Failed to get reserve data for asset: ${asset}`)
      }
      return acc
    }, {} as Record<string, Reserve>)
  }, [reserveDataResults, assetAddresses])

  const reserveDataMap = useMemo(() => getReservesData(), [getReservesData])

  return { reserveDataMap, isLoading, isError }
}

export function useProtocolPriceData() {
  const { data: priceDataResults, isLoading, isError } = useReadContracts({
    contracts: assetAddresses.map(asset => ({
      abi: abis.oracle,
      address: contracts.oracle,
      functionName: 'getAssetPrice',
      args: [asset],
    }))
  })

  const getPricesData = useCallback(() => {
    if (!priceDataResults) {
      return assetAddresses.reduce((acc, asset) => {
        acc[asset] = 0n;
        return acc
      }, {} as Record<string, bigint>)
    }

    return assetAddresses.reduce((acc, asset, index) => {
      const result = priceDataResults[index]
      if (result && result.status === 'success') {
        acc[asset] = result.result as bigint
      } else {
        console.error(`Failed to get price data for asset: ${asset}`);
      }
      return acc
    }, {} as Record<string, bigint>)
  }, [priceDataResults])

  const priceDataMap = useMemo(() => getPricesData(), [getPricesData])

  return { priceDataMap, isLoading, isError }
}

export function useProtocolInterestRate(){
  const { reserveDataMap } = useProtocolReservesData(); 
  const { data: interestRateDataResults, isLoading, isError } = useReadContracts({
    contracts: assetAddresses.map(asset => ({
      abi: abis.pool,
      address: contracts.pool,
      functionName: 'getReserveData',
      args: [asset],
    }))
  })

  const getInterestRateData = useCallback(() => {
    if (!interestRateDataResults){
      return assetAddresses.reduce((acc, asset) => {
        acc[asset] = {
          supply: 0,
          borrow: 0
        }
        return acc
      }, {} as Record<string, any>)
    }

    return assetAddresses.reduce((acc, asset, index) => {
      const result = interestRateDataResults[index]
      if (result && result.status === 'success') {

        acc[asset] = {
          supply: calculateApy(Number((reserveDataMap[asset] as any).currentLiquidityRate)),
          borrow: calculateApy(Number((reserveDataMap[asset] as any).currentVariableBorrowRate))
        }
      } else {
        console.error(`Failed to get interest rate data for asset: ${asset}`);
      }
      return acc
    }, {} as Record<string, any>)
  }, [interestRateDataResults])

  const interestRateDataMap = useMemo(() => getInterestRateData(), [getInterestRateData])

  return { interestRateDataMap, isLoading, isError }
}

export function useProtocolAssetReserveData(asset: string){
  const { data } = useReadContract(
    {
      abi: abis.protocolDataProvider,
      address: contracts.protocolDataProvider,
      functionName: 'getReserveData',
      args: [asset],
    } 
  )

  const dataAny = (data as any) || []

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
    lastUpdateTimestamp: dataAny[11]
  };
}

interface Rates {
  variableRate: number;
  utilization: number;
}

export function useProtocolInterestRateModel(token: string){
  const rates: Rates[] = [];

  const rateStrategyType = tokenToRateStrategyMap[token] || "volatileOne"
  const methods = ['getVariableRateSlope1', 'getVariableRateSlope2', 'OPTIMAL_USAGE_RATIO', 'getBaseStableBorrowRate']
  
  const { data: interestRateStrategyData } = useReadContracts({
    contracts: methods.map(method => ({
      abi: abis.rateStrategy,
      address: contracts.rateStrategies[rateStrategyType],
      functionName: method,
    }))
  })
  if (!interestRateStrategyData) return []

  const params = methods.reduce((acc, method, index) => {
    const result = interestRateStrategyData[index]
    if (result && result.status === 'success') {
      acc[method] = interestRateStrategyData[index].result
    } else {
      console.error(`Failed to get interest rate data for ${token}, method: ${method}`);
    }
    return acc
  }, {} as Record<string, any>)

  const variableRateSlope1 = params['getVariableRateSlope1'];
  const variableRateSlope2 = params['getVariableRateSlope2'];
  const optimalUsageRatio = params['OPTIMAL_USAGE_RATIO'];
  const baseVariableBorrowRate = params['getBaseStableBorrowRate']

  const resolution = 200;
  const step = 100 / resolution;
  const formattedOptimalUtilizationRate = normalizeBN(optimalUsageRatio, 25).toNumber();

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
          rayDiv(rayMul(variableRateSlope1, normalizeBN(utilization, -25)), optimalUsageRatio)
        ),
        27
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
        RAY.minus(optimalUsageRatio)
      );
      const theoreticalVariableAPY = normalizeBN(
        new BigNumber(baseVariableBorrowRate)
          .plus(variableRateSlope1)
          .plus(rayMul(variableRateSlope2, excess)),
        27
      ).toNumber();
      rates.push({
        variableRate: theoreticalVariableAPY,
        utilization,
      });
    }
  }
  
  return rates;
}

export function useInterestRateHistory(token: string){
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.hyperlend.finance/data/interestRateHistory?chain=arbitrum&token=' + token)
      .then(response => response.json())
      .then(json => {
        const values = json ? json.map((e: any) => ({
          timestamp: e.timestamp,
          liquidityRate: e[token].currentLiquidityRate,
          borrowRate: e[token].currentVariableBorrowRate
        })) : []
        setData(values)
      })
      .catch(error => console.error(error));
  }, []);
  
  return data || []
}