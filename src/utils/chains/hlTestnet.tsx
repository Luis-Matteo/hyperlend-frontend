const networkChainId: number = 998;

const contracts: any = {
  protocolDataProvider: '0x4b23ceb59670108A569Bb69eC35386449d77C815',
  poolAddressesProvider: '0xa1d0ca19d6877cE4Bf51496305393aa28607012d',
  pool: '0x1e85CCDf0D098a9f55b82F3E35013Eda235C8BD8',
  oracle: '0xecbD8482C698B7b2706807A32d7FDf4E9a55C6A1',
  uiPoolDataProvider: '0x3B3E98B61AFB357b1AA7Ff8BD83BE5516906c659',
  rateStrategies: {
    volatileOne: '0xFf377dbB97c674Bfa201d8CdcAe597D1231317Ea',
    stableOne: '0xAEd164046AFB672EdD2350C974355d93a06142ad',
  },
  faucet: '0x941559AF458A9a0448b411a26047584b506283A7',
  wrappedTokenGatewayV3: '0xd2b21707d7a574D6A744FB600826770F9FBA6f80',
  //isolated pools
  isolatedPairRegistry: '0x274396Ec36D17dAbC018d9437D5a4C0D0fD503D0',
  uiDataProviderIsolated: '0x193ad71bc52548c65bA1c30a34E3092F58a1C5AD',
};

const tokenFullNameMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': 'MockBitcoin',
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': 'Ethereum',
//   '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': 'ThunderHead Staked HYPE',
};

const tokenNameMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': 'MBTC',
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': 'ETH',
//   '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': 'stHYPE',
};

const tokenToRateStrategyMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': 'volatileOne', //btc
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': 'volatileOne',
//   '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': 'volatileOne',
};

const assetAddresses = Object.keys(tokenNameMap);

const tokenDecimalsMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': 8,
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': 18,
//   '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': 18,
};

const ltvMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': 0.75,
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': 0.75,
//   '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': 0.5,
};

const liqMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': 0.8,
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': 0.8,
//   '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': 0.65,
};

const liqPenaltyMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': 0.1,
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': 0.1,
//   '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': 0.1,
};

const wrappedTokens = ['0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7'];

const wrappedTokenProtocolTokens: any = {
  dToken: '0xE5C5E18723991AF5D2a640f6C9667D48741429E6',
  hToken: '0x7992aa2353722E5947f393C0E892203604b9A194',
};

import backgroundGradientBlue from '../../assets/img/background-gradient.svg';
import backgroundGradientOrange from '../../assets/img/background-orange.svg';
import backgroundGradientStHype from '../../assets/img/background-sthype.svg';

const tokenToGradient: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458': backgroundGradientOrange,
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7': backgroundGradientBlue,
  '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616': backgroundGradientStHype,
};

const oraclesMap: any = {
  '0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458':
    '0x3437aE65ae0C2b80437E55c829fF6C895Eee061c',
  '0xe0bdd7e8b7bf5b15dcDA6103FCbBA82a460ae2C7':
    '0xc88F13B22443E6dDe99bc702F0130A8edee45174',
  '0xe2FbC9cB335A65201FcDE55323aE0F4E8A96A616':
    '0x2bd27d573d12D5843E983F716224C2b8e5aa0C5F',
};

const excludeIsolatedPairs = [
  '0xB1ed098b6b7Ae18b0Aa822c90a1E0371c7fDb96D', //old ETH-stHYPE
  '0xf1039C557e8B599dc26e0CCdA24De015Fb59Ec6f', //old stHYPE-ETH
];

const hlTestnet: any = {
  chainName: 'hyperEvmTestnet',
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
  wrappedTokens: wrappedTokens,
  wrappedTokenProtocolTokens: wrappedTokenProtocolTokens,
  tokenToGradient: tokenToGradient,
  oraclesMap: oraclesMap,
  excludeIsolatedPairs: excludeIsolatedPairs,
};

export default hlTestnet;
