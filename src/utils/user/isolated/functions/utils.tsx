import { tokenDecimalsMap, wrappedTokens, liqMap } from '../../../config';
import { normalizeDecimalsAmount, decodeConfig } from '../../../functions';

//return precision for token amount worth $0.01
export function getTokenPrecision(token: string, priceDataMap: any): any {
  const minAmountStr = (
    1 /
    (Number(priceDataMap[token]) / Math.pow(10, 8)) /
    100
  )
    .toFixed(20)
    .toString(); //amount of token, worth $0.01
  const match = minAmountStr.replace('.', '').match(/^0+/);
  return match ? match[0].length : 2;
}

//calculate current users available balance based on action type
export function calculateAvailableBalance(
  asset: string,
  collateral: string,
  assetUsdPrice: number,
  collateralUsdPrice: number,
  ltv: number,
  userPositionsData: any,
  userAccountData: any,
  priceDataMap: any,
  userEthBalance: any,
  userWalletTokenBalance: any,
  actionType: string,
): any {
  if (!userAccountData) userAccountData = [0, 0, 0, 0, 0];

  const params = {
    asset: asset,
    collateral: collateral,
    assetUsdPrice: assetUsdPrice,
    collateralUsdPrice: collateralUsdPrice,
    ltv: ltv,
    userPositionsData: userPositionsData,
    userAccountData: userAccountData,
    priceDataMap: priceDataMap,
    userEthBalance: userEthBalance,
    userWalletTokenBalance: userWalletTokenBalance,
    actionType: actionType,
  };

  switch (actionType) {
    case 'supply':
      return getAvailableSupply(params);
    case 'withdraw':
      return getAvailableWithdraw(params);
    case 'borrow':
      return getAvailableBorrow(params);
    case 'repay':
      return getAvailableRepay(params);
  }
}

function getAvailableSupply(params: any) {
  const userAmount = normalizeDecimalsAmount(
    Number(params.userWalletTokenBalance),
    params.asset,
    tokenDecimalsMap,
  );

  return userAmount;
}

function getAvailableWithdraw(params: any) {
  const userAmount = normalizeDecimalsAmount(
    Number(params.userAccountData.userAssets),
    params.asset,
    tokenDecimalsMap,
  );
  
  return userAmount;
}

function getAvailableBorrow(params: any): any {
  const availableLiquidity = (Number(params.userAccountData.userCollateral) / Math.pow(10, Number(params.userAccountData.decimals))) * params.collateralUsdPrice * Number(params.ltv) / 100000 / params.assetUsdPrice;

  return availableLiquidity * 0.995 //0.5% lower to give some space if price changes/rounding errors
}

function getAvailableRepay(params: any) {
  const borrowedBalance =
    (Number(params.userAccountData.userBorrow) / Math.pow(10, Number(params.userAccountData.decimals))) || 0;
  if (borrowedBalance == 0) return 0;

  const userBalance = normalizeDecimalsAmount(
    Number(params.userWalletTokenBalance),
    params.asset,
    tokenDecimalsMap,
  );

  return borrowedBalance > userBalance ? userBalance : borrowedBalance;
}

export function calculatePredictedHealthFactor(
  token: string,
  amount: number,
  actionType: string,
  priceDataMap: any,
  userPositionsData: any,
): any {
  // const tokenPriceUsd = Number(priceDataMap[token]) / Math.pow(10, 8);
  // const amountUsd =
  //   amount *
  //   tokenPriceUsd *
  //   (actionType == 'repay' || actionType == 'withdraw' ? -1 : 1);

  // const newTotalBorrow =
  //   actionType == 'borrow' || actionType == 'repay'
  //     ? (userPositionsData?.totalBorrowUsd || 0) + amountUsd
  //     : userPositionsData?.totalBorrowUsd || 0;

  // const newTotalThreshold =
  //   actionType == 'supply' || actionType == 'withdraw'
  //     ? (userPositionsData?.totalLiquidationThreshold || 0) +
  //       amountUsd * liqMap[token]
  //     : userPositionsData?.totalLiquidationThreshold || 0;

  // const newHealth =
  //   newTotalBorrow > 0 ? newTotalThreshold / newTotalBorrow : Infinity;

  return 0;
}
