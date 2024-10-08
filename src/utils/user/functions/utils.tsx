import { tokenDecimalsMap, wrappedTokens, liqMap } from '../../config';
import { normalizeDecimalsAmount, decodeConfig } from '../../functions';

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
  token: string,
  userPositionsData: any,
  userAccountData: any,
  priceDataMap: any,
  assetReserveData: any,
  reserveDataMap: any,
  userEthBalance: any,
  userWalletTokenBalance: any,
  actionType: string,
): any {
  if (!userAccountData) userAccountData = [0, 0, 0, 0, 0]
  
  const params = {
    token: token,
    userPositionsData: userPositionsData,
    userAccountData: userAccountData,
    priceDataMap: priceDataMap,
    assetReserveData: assetReserveData,
    reserveDataMap: reserveDataMap,
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
  const supplyCap = decodeConfig(
    params.reserveDataMap[params.token].configuration.data,
  ).supplyCap;
  const totalSupplied =
    Number(params.assetReserveData.totalAToken) /
    Math.pow(10, tokenDecimalsMap[params.token]);
  const userAmount = normalizeDecimalsAmount(
    wrappedTokens.includes(params.token)
      ? Number(params.userEthBalance?.value)
      : Number(params.userWalletTokenBalance),
    params.token,
    tokenDecimalsMap,
  );

  return totalSupplied + userAmount > supplyCap
    ? supplyCap - totalSupplied
    : userAmount;
}

function getAvailableWithdraw(params: any) {
  const [totalCollateralBase, totalDebtBase, , , currentLiquidationThreshold] =
    params.userAccountData;

  const totalSupplied =
    Number(params.assetReserveData.totalAToken) /
    Math.pow(10, tokenDecimalsMap[params.token]);
  const totalBorrowed =
    Number(params.assetReserveData.totalVariableDebt) /
    Math.pow(10, tokenDecimalsMap[params.token]);
  const availableLiquidity = totalSupplied - totalBorrowed;

  const supplied = params.userPositionsData.supplied.find(
    (e: any) => e.underlyingAsset == params.token,
  );
  const tokenPriceUsd =
    Number(params.priceDataMap[params.token]) / Math.pow(10, 8);
  const userBalanceToken = supplied?.balance;
  const userBalanceValueUsd = userBalanceToken * tokenPriceUsd;

  if (userBalanceToken == 0) return 0;

  const maxWithdrawableUsd =
    (Number(totalCollateralBase) -
      Number(totalDebtBase) / (Number(currentLiquidationThreshold) / 10000)) /
    Math.pow(10, 8);
  const maxWithdrawableAmountUsd =
    maxWithdrawableUsd > userBalanceValueUsd
      ? userBalanceValueUsd
      : maxWithdrawableUsd;

  const maxWithdrawableAmountToken = maxWithdrawableAmountUsd / tokenPriceUsd;
  return maxWithdrawableAmountToken > availableLiquidity
    ? availableLiquidity
    : maxWithdrawableAmountToken;
}

function getAvailableBorrow(params: any): any {
  const borrowCap = decodeConfig(
    params.reserveDataMap[params.token].configuration.data,
  ).borrowCap;

  const totalSupplied =
    Number(params.assetReserveData.totalAToken) /
    Math.pow(10, tokenDecimalsMap[params.token]);
  const totalBorrowed =
    Number(params.assetReserveData.totalVariableDebt) /
    Math.pow(10, tokenDecimalsMap[params.token]);
  const availableLiquidity = totalSupplied - totalBorrowed;

  const tokenPrice = params.priceDataMap[params.token]; //10**8 decimals from oracle
  const [, , availableBorrowsBase] = params.userAccountData; //in usd, 10**8 decimals
  const availableBorrowBaseToken =
    Number(availableBorrowsBase) / Number(tokenPrice);

  const availableAfterCap =
    borrowCap != 0 && totalBorrowed + availableBorrowBaseToken > borrowCap
      ? borrowCap - totalBorrowed
      : availableBorrowBaseToken;

  return availableAfterCap > availableLiquidity
    ? availableLiquidity
    : availableAfterCap;
}

function getAvailableRepay(params: any) {
  const borrowedBalance =
    params.userPositionsData.borrowed.find(
      (e: any) => e.underlyingAsset == params.token,
    )?.balance || 0;
  if (borrowedBalance == 0) return 0;

  const userBalance = normalizeDecimalsAmount(
    wrappedTokens.includes(params.token)
      ? Number(params.userEthBalance?.value)
      : Number(params.userWalletTokenBalance),
    params.token,
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
  const tokenPriceUsd = Number(priceDataMap[token]) / Math.pow(10, 8);
  const amountUsd =
    amount *
    tokenPriceUsd *
    (actionType == 'repay' || actionType == 'withdraw' ? -1 : 1);

  const newTotalBorrow =
    actionType == 'borrow' || actionType == 'repay'
      ? (userPositionsData?.totalBorrowUsd || 0) + amountUsd
      : userPositionsData?.totalBorrowUsd || 0;

  const newTotalThreshold =
    actionType == 'supply' || actionType == 'withdraw'
      ? (userPositionsData?.totalLiquidationThreshold || 0) +
        amountUsd * liqMap[token]
      : userPositionsData?.totalLiquidationThreshold || 0;

  const newHealth =
    newTotalBorrow > 0 ? newTotalThreshold / newTotalBorrow : Infinity;

  return newHealth;
}
