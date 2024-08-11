import ethIcon from '../assets/icons/coins/eth-icon.svg';
import usdcIcon from '../assets/icons/coins/usdc-icon.svg';
import usdtIcon from '../assets/icons/coins/usdt-icon.svg';
import wbtcIcon from '../assets/icons/coins/wbtc-icon.svg';

const contracts: any = {
  "provider": "0xE65D4B4E740Ad55a04B7dc5Ba2f458215350cc32",
  "pool": "0xAd3AAC48C09f955a8053804D8a272285Dfba4dD2",
  "oracle": "0x8033AD4F1613253566aD11C66A51eF09Ac8166Cf"
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

export { contracts, assetAddresses, tokenNameMap, tokenDecimalsMap, iconsMap, ltvMap  }