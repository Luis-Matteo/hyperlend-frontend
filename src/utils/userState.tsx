import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

import { calculateApy } from './functions';
import { UserReserveData, UserPositionData, UserPositionsData } from '../utils/types'
import { contracts, assetAddresses, tokenNameMap, tokenDecimalsMap, iconsMap, ltvMap, abis } from './tokens';

import { useProtocolReservesData, useProtocolPriceData } from './protocolState';

export function useUserPositionsData(): UserPositionsData {
  const { address, isConnected } = useAccount()
  const { reserveDataMap } = useProtocolReservesData()
  const { priceDataMap } = useProtocolPriceData()
  const { totalBalanceChange, totalBalanceChangePercentage } = useGetUserBalanceHistory(address)
  const { data: userReservesData } = useReadContract(
    {
      abi: abis.uiPoolDataProvider,
      address: contracts.uiPoolDataProvider,
      functionName: 'getUserReservesData',
      //use null address if wallet is not connected (fixes the white screen errror when connecting/disconnecting caused by "Rendered fewer hooks than expected")
      args: [contracts.poolAddressesProvider, address || "0x0000000000000000000000000000000000000000"],
    }
  )

  if (!isConnected || !address) {
    return {
      supplied: [],
      borrowed: [],
      totalSupplyUsd: 0,
      totalBorrowUsd: 0,
      totalBalanceUsd: 0,
      totalBorrowLimit: 0,
      healthFactor: 0,
      totalBalanceChange: 0,
      totalBalanceChangePercentage: 0
    }
  }

  const supplied: UserPositionData[] = userReservesData ? (userReservesData as any)['0'].map((e: UserReserveData) => {
    const balanceNormalized = Number(e.scaledATokenBalance) / Math.pow(10, tokenDecimalsMap[e.underlyingAsset]);
    const priceUsd = Number((priceDataMap as any)[e.underlyingAsset]) / Math.pow(10, 8);
    const valueUsd = priceUsd * balanceNormalized;
    const apr = calculateApy(Number(reserveDataMap[e.underlyingAsset]?.currentLiquidityRate || 0));

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
    const apr = calculateApy(Number(reserveDataMap[e.underlyingAsset]?.currentVariableBorrowRate || 0))

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

  return {
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

export function useUserWalletBalance() {
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
        } as any : undefined
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

  if (!isConnected || !address) {
    return { walletBalanceValue: 0 }
  }

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

export function useGetUserBalanceHistory(address: `0x${string}` | undefined) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3000/data/user/valueChange?chain=arbitrum&address=' + address)
      .then(response => response.json())
      .then(json => {
        setData({
          address: address,
          totalBalanceChange: json?.totalBalanceChange,
          totalBalanceChangePercentage: json?.totalBalanceChangePercentage
        })
      })
      .catch(error => console.error(error));
  }, []);

  return {
    totalBalanceChange: data?.totalBalanceChange || 0,
    totalBalanceChangePercentage: data?.totalBalanceChangePercentage || 0
  }
}

export function useUserPortfolioHistory(address: `0x${string}` | undefined){
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3000/data/user/historicalNetWorth?chain=arbitrum&address=' + address)
      .then(response => response.json())
      .then(json => {
        setData(json ? json.map((e: any) => e.usdValue) : [])
      })
      .catch(error => console.error(error));
  }, []);

  return {
    historicalNetWorth: data || [],
  }
}