const networkChainId: number = 998

const contracts: any = {
  "protocolDataProvider": "0x4b23ceb59670108A569Bb69eC35386449d77C815",
  "poolAddressesProvider": "0xa1d0ca19d6877cE4Bf51496305393aa28607012d",
  "pool": "0x1e85CCDf0D098a9f55b82F3E35013Eda235C8BD8",
  "oracle": "0xecbD8482C698B7b2706807A32d7FDf4E9a55C6A1",
  "uiPoolDataProvider": "0x3B3E98B61AFB357b1AA7Ff8BD83BE5516906c659",
  "rateStrategies": {
    "volatileOne": "0xFf377dbB97c674Bfa201d8CdcAe597D1231317Ea",
    "stableOne": "0xAEd164046AFB672EdD2350C974355d93a06142ad"
  },
  "faucet": "0x941559AF458A9a0448b411a26047584b506283A7"
}

const tokenFullNameMap: any = {
  "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458": "MockBitcoin"
}

const tokenNameMap: any = {
  "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458": "MBTC"
}

const tokenToRateStrategyMap: any = {
  "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458": "volatileOne" //btc
}

const assetAddresses = Object.keys(tokenNameMap);

const tokenDecimalsMap: any = {
  "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458": 8
}

const ltvMap: any = {
  "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458": 0.75
}

const liqMap: any = {
  "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458": 0.8
}

const liqPenaltyMap: any = {
  "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458": 0.1
}

const hlTestnet: any = {
  chainName: "hyperEvmTestnet",
  networkChainId: networkChainId,
  contracts: contracts,
  tokenFullNameMap: tokenFullNameMap,
  tokenNameMap: tokenNameMap,
  tokenToRateStrategyMap: tokenToRateStrategyMap,
  assetAddresses: assetAddresses,
  tokenDecimalsMap: tokenDecimalsMap,
  ltvMap: ltvMap,
  liqMap: liqMap,
  liqPenaltyMap: liqPenaltyMap
}

export default hlTestnet