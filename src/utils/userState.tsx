import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

import { calculateApy } from './functions';
import { UserReserveData, UserPositionData, UserPositionsData } from '../utils/types'
import { contracts, assetAddresses, tokenNameMap, tokenDecimalsMap, iconsMap, ltvMap, abis } from './tokens';

import { useProtocolReservesData, useProtocolPriceData } from './protocolState';

export function useUserPositionsData(): UserPositionsData | null {
  const { address } = useAccount()
  const { reserveDataMap } = useProtocolReservesData()
  const { priceDataMap } = useProtocolPriceData()

  const userReservesData = useUserReservesData()

  const supplied: UserPositionData[] = userReservesData ? (userReservesData as any)['0'].map((e: UserReserveData) => {
    const balanceNormalized = Number(e.scaledATokenBalance) / Math.pow(10, tokenDecimalsMap[e.underlyingAsset]);
    const priceUsd = Number((priceDataMap as any)[e.underlyingAsset]) / Math.pow(10, 8);
    const valueUsd = priceUsd * balanceNormalized;
    const apr = calculateApy(Number(reserveDataMap[e.underlyingAsset].currentLiquidityRate));

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
    const apr = calculateApy(Number(reserveDataMap[e.underlyingAsset].currentVariableBorrowRate))

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

  const { totalBalanceChange, totalBalanceChangePercentage } = useGetUserBalanceHistory(address)

  return  {
    supplied: supplied,
    borrowed: borrowed,

    totalSupplyUsd: totalSupply,
    totalBorrowUsd: totalBorrow,
    totalBalanceUsd: totalSupply - totalBorrow,
    totalBorrowLimit: totalBorrowLimit,
    healthFactor: totalBorrowLimit / totalBorrow,

    totalBalanceChange: totalBalanceChange,
    totalBalanceChangePercentage: totalBalanceChangePercentage,
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
      args: [contracts.poolAddressesProvider, address],
    } : undefined
  )
  return data;
}

export function useUserWalletBalance(){
  const { address, isConnected } = useAccount();

  if (!isConnected){
    return { walletBalanceValue: 0 }
  }

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

export function useGetUserBalanceHistory(address: `0x${string}` | undefined){
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // fetch('https://api.hyperlend.finance.com/userBalanceHistory?address=' + address)
    //   .then(response => response.json())
    //   .then(json => setData(json))
    //   .catch(error => console.error(error));
    setData({
      totalBalanceChange: 0,
      totalBalanceChangePercentage: 0
    })
  }, []);

  return {
    totalBalanceChange: data?.totalBalanceChange || 0,
    totalBalanceChangePercentage: data?.totalBalanceChangePercentage || 0
  }
}