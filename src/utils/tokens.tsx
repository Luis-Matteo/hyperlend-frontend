import ethIcon from '../assets/icons/coins/eth-icon.svg';
import usdcIcon from '../assets/icons/coins/usdc-icon.svg';
import usdtIcon from '../assets/icons/coins/usdt-icon.svg';
import wbtcIcon from '../assets/icons/coins/wbtc-icon.svg';

import UiPoolDataProviderV3Abi from "../abis/UiPoolDataProviderV3Abi.json"
import PoolAbi from "../abis/PoolAbi.json"
import OracleAbi from "../abis/OracleAbi.json"
import DataProviderAbi from "../abis/DataProviderAbi.json"

const contracts: any = {
  "protocolDataProvider": "0x824A4309686C74C3369Ab2273A6f2ced629422e2",
  "poolAddressesProvider": "0xE65D4B4E740Ad55a04B7dc5Ba2f458215350cc32",
  "pool": "0xAd3AAC48C09f955a8053804D8a272285Dfba4dD2",
  "oracle": "0x8033AD4F1613253566aD11C66A51eF09Ac8166Cf",
  "uiPoolDataProvider": "0x0b3bF4D76C035E1CcedE18F9195De98c41c5dDf0"
}

const abis: Record<string, any> = {
  "dataProvider": DataProviderAbi,
  "uiPoolDataProvider": UiPoolDataProviderV3Abi,
  "pool": PoolAbi,
  "oracle": OracleAbi,
  "protocolDataProvider": DataProviderAbi
}

const tokenFullNameMap: any = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "Ethereum",
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "Tether",
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "USD Coin",
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "Bitcoin"
}

const tokenNameMap: any = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "ETH",
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "USDT",
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "USDC",
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "WBTC"
}

const assetAddresses = Object.keys(tokenNameMap);

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

const liqMap: any = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": 0.8,
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": 0.85,
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": 0.85,
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": 0.8
}

export const stablecoinsList = ["USDC", "USDT"]

export { contracts, assetAddresses, tokenNameMap, tokenDecimalsMap, iconsMap, ltvMap, abis, tokenFullNameMap, liqMap }