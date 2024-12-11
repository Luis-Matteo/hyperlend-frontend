interface Hypervault {
  id: number;
  tag: 'new' | 'hot' | 'risk';
  slug: string;
  assetSymbol: string;
  assetIcon: string;
  collateralSymbol: string;
  collateralIcon: string;
  apy: number;
  tvl: number;
  name: string;
  icon: string;
  title: string;
  content: string;
}

export type { Hypervault };
