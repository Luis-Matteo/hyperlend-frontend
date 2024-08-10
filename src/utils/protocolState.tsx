import { useAccount, useReadContract } from 'wagmi'
import PoolAbi from "../abis/PoolAbi.json"

const tokenNameMap: any = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "ETH",
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "USDT",
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "USDC",
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "WBTC"
}
const pool = "0xAd3AAC48C09f955a8053804D8a272285Dfba4dD2"

const assetAddresses = Object.keys(tokenNameMap);

function getInterestRate(){
  const { address, isConnected } = useAccount();
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

  const reserveDataMap = assetAddresses.reduce((acc, asset, index) => {
    acc[asset] = reserveDataResults[index].data;
    return acc;
  }, {} as Record<string, any>);



  let supplyInterest: any = {}
  let borrowInterest: any = {}
  for (let address of assetAddresses){
    supplyInterest[address] = (Math.pow((Number((reserveDataMap[address] as any).currentLiquidityRate) / 1e27) + 1, 365) - 1) * 100
    borrowInterest[address] = (Math.pow((Number((reserveDataMap[address] as any).currentVariableBorrowRate) / 1e27) + 1, 365) - 1) * 100
  }

  return {
    supplyInterest: supplyInterest,
    borrowInterest: borrowInterest
  }
}

export { getInterestRate }