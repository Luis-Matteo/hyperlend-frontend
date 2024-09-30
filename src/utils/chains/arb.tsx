const networkChainId: number = 42161;

const contracts: any = {
  protocolDataProvider: '0x824A4309686C74C3369Ab2273A6f2ced629422e2',
  poolAddressesProvider: '0xE65D4B4E740Ad55a04B7dc5Ba2f458215350cc32',
  pool: '0xAd3AAC48C09f955a8053804D8a272285Dfba4dD2',
  oracle: '0x8033AD4F1613253566aD11C66A51eF09Ac8166Cf',
  uiPoolDataProvider: '0x0b3bF4D76C035E1CcedE18F9195De98c41c5dDf0',
  rateStrategies: {
    volatileOne: '0x7d028b7b61eA887FC942f1b5cb8245d6f1189582',
    stableOne: '0xa18DE0E9fd605be95026130FDFb592431Fc7a9B7',
  },
};

const tokenFullNameMap: any = {
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 'Ethereum',
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 'Tether',
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 'USD Coin',
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 'Bitcoin',
};

const tokenNameMap: any = {
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 'ETH',
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 'USDT',
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 'USDC',
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 'WBTC',
};

const tokenToRateStrategyMap: any = {
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 'volatileOne', //weth
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 'stableOne', //usdt
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 'stableOne', //usdc
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 'volatileOne', //wbtc
};

const assetAddresses = Object.keys(tokenNameMap);

const tokenDecimalsMap: any = {
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 18,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 6,
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 6,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 8,
};

const ltvMap: any = {
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 0.75,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 0.8,
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 0.8,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 0.75,
};

const liqMap: any = {
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 0.8,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 0.85,
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 0.85,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 0.8,
};

const liqPenaltyMap: any = {
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 0.1,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 0.1,
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 0.1,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 0.1,
};

const arb: any = {
  chainName: 'arbitrum',
  networkChainId: networkChainId,
  contracts: contracts,
  tokenFullNameMap: tokenFullNameMap,
  tokenNameMap: tokenNameMap,
  tokenToRateStrategyMap: tokenToRateStrategyMap,
  assetAddresses: assetAddresses,
  tokenDecimalsMap: tokenDecimalsMap,
  ltvMap: ltvMap,
  liqMap: liqMap,
  liqPenaltyMap: liqPenaltyMap,
};

export default arb;
