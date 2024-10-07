import ethIcon from '../assets/icons/coins/eth-icon.svg';
import usdcIcon from '../assets/icons/coins/usdc-icon.svg';
import usdtIcon from '../assets/icons/coins/usdt-icon.svg';
import wbtcIcon from '../assets/icons/coins/wbtc-icon.svg';

import arb from './chains/arb';
import hlTestnet from './chains/hlTestnet';

import UiPoolDataProviderV3Abi from '../abis/UiPoolDataProviderV3Abi.json';
import PoolAbi from '../abis/PoolAbi.json';
import OracleAbi from '../abis/OracleAbi.json';
import DataProviderAbi from '../abis/DataProviderAbi.json';
import rateStrategyAbi from '../abis/RateStrategyAbi.json';
import faucetAbi from '../abis/FaucetAbi.json';
import wrappedTokenGatewayV3Abi from '../abis/WrappedTokenGatewayV3Abi.json';
import variableDebtTokenAbi from '../abis/VariableDebtTokenAbi.json';

export const abis: Record<string, any> = {
  dataProvider: DataProviderAbi,
  uiPoolDataProvider: UiPoolDataProviderV3Abi,
  pool: PoolAbi,
  oracle: OracleAbi,
  protocolDataProvider: DataProviderAbi,
  rateStrategy: rateStrategyAbi,
  faucet: faucetAbi,
  wrappedTokenGatewayV3: wrappedTokenGatewayV3Abi,
  variableDebtToken: variableDebtTokenAbi,
};

export const iconsMap: any = {
  ETH: ethIcon,
  USDT: usdtIcon,
  USDC: usdcIcon,
  WBTC: wbtcIcon,
  MBTC: wbtcIcon,
};

export const stablecoinsList = ['USDC', 'USDT'];

const currentChainId: number = 998;

const networkConfigs: any = {
  42161: arb,
  998: hlTestnet,
};

export const chainName: string =
  networkConfigs[currentChainId].chainName || arb.chainName;
export const networkChainId: number =
  networkConfigs[currentChainId].networkChainId || arb.networkChainId;
export const contracts: any =
  networkConfigs[currentChainId].contracts || arb.contracts;
export const assetAddresses: string[] =
  networkConfigs[currentChainId].assetAddresses || arb.assetAddresses;
export const tokenNameMap: any =
  networkConfigs[currentChainId].tokenNameMap || arb.tokenNameMap;
export const tokenDecimalsMap: any =
  networkConfigs[currentChainId].tokenDecimalsMap || arb.tokenDecimalsMap;
export const ltvMap: any = networkConfigs[currentChainId].ltvMap || arb.ltvMap;
export const tokenFullNameMap: any =
  networkConfigs[currentChainId].tokenFullNameMap || arb.tokenFullNameMap;
export const liqMap: any = networkConfigs[currentChainId].liqMap || arb.liqMap;
export const tokenToRateStrategyMap: any =
  networkConfigs[currentChainId].tokenToRateStrategyMap ||
  arb.tokenToRateStrategyMap;
export const liqPenaltyMap: any =
  networkConfigs[currentChainId].liqPenaltyMap || arb.liqPenaltyMap;
export const wrappedTokens: any =
  networkConfigs[currentChainId].wrappedTokens || arb.wrappedTokens;
export const wrappedTokenProtocolTokens: any =
  networkConfigs[currentChainId].wrappedTokenProtocolTokens ||
  arb.wrappedTokenProtocolTokens;
export const tokenToGradient: any =
  networkConfigs[currentChainId].tokenToGradient || arb.tokenToGradient;
