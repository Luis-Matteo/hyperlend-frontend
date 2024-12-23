interface SupplyTransaction {
  id: number;
  asset: string;
  balance: number;
  assetIcon: string;
  value: number;
  isCollateralEnabled: boolean;
  apr: number;
  status: string;
}
interface SupplyTransactionMobile {
  id: number;
  asset: string;
  assetIcon: string;
  value: number;
  apr: number;
}
interface BorrowTransaction {
  id: number;
  asset: string;
  balance: number;
  assetIcon: string;
  value: number;
  pool: string;
  apr: number;
  status: string;
}
interface BorrowTransactionMobile {
  id: number;
  asset: string;
  assetIcon: string;
  value: number;
  apr: number;
}

export type {
  SupplyTransaction,
  BorrowTransaction,
  SupplyTransactionMobile,
  BorrowTransactionMobile,
};
