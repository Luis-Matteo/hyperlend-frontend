import { useState, useEffect, useMemo, useCallback } from 'react';

import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

import { Reserve, UserReserveData, UserPositionData, UserPositionsData } from '../utils/types'
import { contracts, assetAddresses, tokenNameMap, tokenDecimalsMap, iconsMap, ltvMap, abis } from './tokens';

import { useProtocolReservesData, useProtocolPriceData, useProtocolInterestRate } from './protocolState';

export function useUserPositionsData(): UserPositionsData | null {
  const { reserveDataMap } = useProtocolReservesData()
  const { priceDataMap } = useProtocolPriceData()

  const userReservesData = useUserReservesData()

  const supplied: UserPositionData[] = userReservesData ? (userReservesData as any)['0'].map((e: UserReserveData) => {
    const balanceNormalized = Number(e.scaledATokenBalance) / Math.pow(10, tokenDecimalsMap[e.underlyingAsset]);
    const priceUsd = Number((priceDataMap as any)[e.underlyingAsset]) / Math.pow(10, 8);
    const valueUsd = priceUsd * balanceNormalized;
    const apr =(Math.pow(Number(reserveDataMap[e.underlyingAsset].currentLiquidityRate) / 1e27 + 1, 365) - 1) *100;

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
  }).filter((item: UserPositionData) => item.balance > 0) : [];

  const borrowed: UserPositionData[] = userReservesData ? (userReservesData as any)['0'].map((e: UserReserveData) => {
    const balanceNormalized = Number(e.scaledVariableDebt) / Math.pow(10, tokenDecimalsMap[e.underlyingAsset]);
    const priceUsd = Number((priceDataMap as any)[e.underlyingAsset]) / Math.pow(10, 8);
    const valueUsd = priceUsd * balanceNormalized;
    const apr =(Math.pow(Number(reserveDataMap[e.underlyingAsset].currentVariableBorrowRate) / 1e27 + 1, 365) - 1) *100;

    return {
      underlyingAsset: e.underlyingAsset,
      assetName: tokenNameMap[e.underlyingAsset],
      balance: Number(e.scaledVariableDebt) / Math.pow(10, 6),
      value: valueUsd,
      apr: apr,
      icon: iconsMap[tokenNameMap[e.underlyingAsset]],
      isCollateralEnabled: null
    }
  }).filter((item: UserPositionData) => item.balance > 0) : []

  const totalSupply = supplied.reduce((partialSum: number, a: any) => partialSum + a.value, 0);
  const totalBorrow = borrowed.reduce((partialSum: number, a: any) => partialSum + a.value, 0);
  const totalBorrowLimit = supplied.reduce((partialSum: number, a: any) => partialSum + (a.value * ltvMap[a.underlyingAsset]), 0);

  return  {
    supplied: supplied,
    borrowed: borrowed,

    totalSupplyUsd: totalSupply,
    totalBorrowUsd: totalBorrow,
    totalBalanceUsd: totalSupply - totalBorrow,

    totalBalanceChange: 0,
    totalBalanceChangePercentage: 0,
    totalBorrowLimit: totalBorrowLimit,

    healthFactor: totalBorrow / totalBorrowLimit
  }
}

export function useUserReservesData(){
  const { address, isConnected } = useAccount();
  const { data } = useReadContract(
    isConnected && address ?
    {
      abi: abis.uiPoolDataProvider,
      address: contracts.uiPoolDataProvider,
      functionName: 'getUserReservesData',
      args: [contracts.dataProvider, address],
    } : undefined
  )
  return data;
}

export function useUserWalletBalance(){
  const { address, isConnected } = useAccount();

  const balanceDataResults = assetAddresses.map(asset => 
    useReadContract(
      isConnected && address
      ?
      {
        abi: erc20Abi,
        address: asset,
        functionName: 'balanceOf',
        args: [address],
      } as any: undefined
    )
  )

  const priceDataResults = assetAddresses.map(asset => 
    useReadContract(
      isConnected && address
      ?
      {
        abi: abis.oracle,
        address: contracts.oracle,
        functionName: 'getAssetPrice',
        args: [asset],
      } : undefined
    )
  )

  const balanceDataMap = assetAddresses.reduce((acc, asset, index) => {
    acc[asset] = balanceDataResults[index].data;
    return acc;
  }, {} as Record<string, any>);

  const priceDataMap = assetAddresses.reduce((acc, asset, index) => {
    acc[asset] = priceDataResults[index].data;
    return acc;
  }, {} as Record<string, any>);

  const walletBalanceValue = assetAddresses.reduce((partialSum: number, a: any) => partialSum + (Number(priceDataMap[a]) / Math.pow(10, 8)) * (Number(balanceDataMap[a]) / Math.pow(10, tokenDecimalsMap[a])), 0);

  return {
    walletBalanceValue: walletBalanceValue
  }
}