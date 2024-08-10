import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

import ethIcon from '../assets/icons/coins/eth-icon.svg';
import usdcIcon from '../assets/icons/coins/usdc-icon.svg';
import usdtIcon from '../assets/icons/coins/usdt-icon.svg';
import wbtcIcon from '../assets/icons/coins/wbtc-icon.svg';

import UiPoolDataProviderV3Abi from "../abis/UiPoolDataProviderV3Abi.json"
import PoolAbi from "../abis/PoolAbi.json"
import OracleAbi from "../abis/OracleAbi.json"

const provider = "0xE65D4B4E740Ad55a04B7dc5Ba2f458215350cc32"
const pool = "0xAd3AAC48C09f955a8053804D8a272285Dfba4dD2"
const oracle = "0x8033AD4F1613253566aD11C66A51eF09Ac8166Cf"

const tokenNameMap: any = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "ETH",
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "USDT",
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "USDC",
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "WBTC"
}

const tokenDecimalsMap: any = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": 18,
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": 6,
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": 6,
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": 8
}

const iconsMap: any = {
  "ETH": ethIcon,
  "USDT": usdtIcon,
  "USDC": usdcIcon,
  "WBTC": wbtcIcon
}

const ltvMap: any = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": 0.75,
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": 0.8,
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": 0.8,
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": 0.75
}

const assetAddresses = Object.keys(tokenNameMap);

function getUserReserves(){
    const { address, isConnected } = useAccount();
    const { data } = useReadContract(
      isConnected && address
      ?
      {
        abi: UiPoolDataProviderV3Abi,
        address: "0x0b3bF4D76C035E1CcedE18F9195De98c41c5dDf0",
        functionName: 'getUserReservesData',
        args: [provider, address],
      } : undefined
    );

    const reserveDataResults = assetAddresses.map(asset => 
      useReadContract(
        isConnected && address
        ?
        {
          abi: PoolAbi,
          address: pool,
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
          address: oracle,
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
        address: oracle,
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
