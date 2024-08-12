// types.ts
export interface NavLink {
    id: string;
    title: string;
    url: string;
    icon?: string;
    disabled: boolean;
}

interface Configuration {
  data: bigint;
}

export interface Reserve {
  aTokenAddress: string;
  accruedToTreasury: bigint;
  configuration: Configuration;
  currentLiquidityRate: bigint;
  currentStableBorrowRate: bigint;
  currentVariableBorrowRate: bigint;
  id: number;
  interestRateStrategyAddress: string;
  isolationModeTotalDebt: bigint;
  lastUpdateTimestamp: number;
  liquidityIndex: bigint;
  stableDebtTokenAddress: string;
  unbacked: bigint;
  variableBorrowIndex: bigint;
  variableDebtTokenAddress: string;
  availableLiquidityUSD: number
}

export interface UserReserveData {
  principalStableDebt: bigint;
  scaledATokenBalance: bigint;
  scaledVariableDebt: bigint;
  stableBorrowLastUpdateTimestamp: bigint;
  stableBorrowRate: bigint;
  underlyingAsset: string;
  usageAsCollateralEnabledOnUser: boolean;
}

export interface UserPositionData {
  underlyingAsset: string;
  assetName: string;
  balance: number;
  value: number;
  price: number;
  apr: number;
  icon: string;
  isCollateralEnabled?: boolean
}

export interface UserPositionsData {
  supplied: UserPositionData[];
  borrowed: UserPositionData[];
  totalSupplyUsd: number;
  totalBorrowUsd: number;
  totalBalanceUsd: number;
  totalBalanceChange: number;
  totalBalanceChangePercentage: number;
  totalBorrowLimit: number;
  healthFactor: number;
}

export type ModalType = "supply" | "withdraw" | "borrow" | "repay";

export interface ModalProps {
  token: string,
  modalType: ModalType,
  onClose: () => void;
}

export interface ReservesData {
  reserveDataMap: Record<string, Reserve>;
  isLoading: boolean;
  isError: boolean;
}