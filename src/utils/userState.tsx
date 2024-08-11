import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

import UiPoolDataProviderV3Abi from "../abis/UiPoolDataProviderV3Abi.json"
import PoolAbi from "../abis/PoolAbi.json"
import OracleAbi from "../abis/OracleAbi.json"

import { contracts, assetAddresses, tokenNameMap, tokenDecimalsMap, iconsMap, ltvMap } from './tokens';

function getUserReserves(){
    const { address, isConnected } = useAccount();
    const { data } = useReadContract(
      isConnected && address
      ?
      {
        abi: UiPoolDataProviderV3Abi,
        address: "0x0b3bF4D76C035E1CcedE18F9195De98c41c5dDf0",
        functionName: 'getUserReservesData',
        args: [contracts.provider, address],
      } : undefined
    );

    const reserveDataResults = assetAddresses.map(asset => 
      useReadContract(
        isConnected && address
        ?
        {
          abi: PoolAbi,
          address: contracts.pool,
          functionName: 'getReserveData',
          args: [asset],
        } : undefined
      )
    )

    const priceDataResults = assetAddresses.map(asset => 
      useReadContract(
        isConnected && address
        ?
        {
          abi: OracleAbi,
          address: contracts.oracle,
          functionName: 'getAssetPrice',
          args: [asset],
        } : undefined
      )
    )

    const reserveDataMap = assetAddresses.reduce((acc, asset, index) => {
      acc[asset] = reserveDataResults[index].data;
      return acc;
    }, {} as Record<string, any>);

    const priceDataMap = assetAddresses.reduce((acc, asset, index) => {
      acc[asset] = priceDataResults[index].data;
      return acc;
    }, {} as Record<string, any>);

    let supply = data ? (data as any)['0'].map((e: any) => {
      return {
        underlyingAsset: e.underlyingAsset,
        assetName: tokenNameMap[e.underlyingAsset],
        balance: Number(e.scaledATokenBalance) / Math.pow(10, 6),
        value: (Number(priceDataMap[e.underlyingAsset]) / Math.pow(10, 8)) * (Number(e.scaledATokenBalance) / Math.pow(10, tokenDecimalsMap[e.underlyingAsset])),
        apr: (Math.pow((Number((reserveDataMap[e.underlyingAsset] as any).currentLiquidityRate) / 1e27) + 1, 365) - 1) * 100,
        collateral: -948561,
        icon: iconsMap[tokenNameMap[e.underlyingAsset]]
      }
    }) : []

    supply = supply.filter((e: any) => {
      return e.balance > 0;
    });

    let borrow = data ? (data as any)['0'].map((e: any) => {
      return {
        underlyingAsset: e.underlyingAsset,
        assetName: tokenNameMap[e.underlyingAsset],
        balance: Number(e.scaledVariableDebt) / Math.pow(10, 6),
        value: (Number(priceDataMap[e.underlyingAsset]) / Math.pow(10, 8)) * (Number(e.scaledVariableDebt) / Math.pow(10, tokenDecimalsMap[e.underlyingAsset])),
        apr: (Math.pow((Number((reserveDataMap[e.underlyingAsset] as any).currentVariableBorrowRate) / 1e27) + 1, 365) - 1) * 100,
        collateral: -948561,
        icon: iconsMap[tokenNameMap[e.underlyingAsset]]
      }
    }) : []

    borrow = borrow.filter((e: any) => {
      return e.balance > 0;
    });

    const totalSupply = supply.reduce((partialSum: number, a: any) => partialSum + a.value, 0);
    const totalBorrow = borrow.reduce((partialSum: number, a: any) => partialSum + a.value, 0);

    const totalBorrowLimit = supply.reduce((partialSum: number, a: any) => partialSum + (a.value * ltvMap[a.underlyingAsset]), 0);

    return {
      supplied: supply,
      borrowed: borrow,
      totalSupply: totalSupply,
      totalBorrow: totalBorrow,
      totalBalance: totalSupply - totalBorrow,
      totalBalanceChange: 89,
      totalBalanceChangePercentage: 77.12,
      totalBorrowLimit: totalBorrowLimit
    }
}

function getUserWalletBalance(){
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
        abi: OracleAbi,
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

export { getUserWalletBalance, getUserReserves };
