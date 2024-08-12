import { useMemo, useCallback } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi'

import { Reserve, ReservesData } from '../utils/types'

import { contracts, assetAddresses, abis } from './tokens';

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
    if (!reserveDataResults) return {}

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
    if (!priceDataResults) return {}

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
    if (!interestRateDataResults) return {}

    return assetAddresses.reduce((acc, asset, index) => {
      const result = interestRateDataResults[index]
      if (result && result.status === 'success') {
        acc[asset] = {
          supplyInterest: (Math.pow((Number((reserveDataMap[asset] as any).currentLiquidityRate) / 1e27) + 1, 365) - 1) * 100,
          borrowInterest: (Math.pow((Number((reserveDataMap[asset] as any).currentVariableBorrowRate) / 1e27) + 1, 365) - 1) * 100
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
