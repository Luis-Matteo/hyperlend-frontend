import { tokenDecimalsMap, wrappedTokens, liqMap } from '../../config'

//return borrow users borrow limit in current token
export function getBorrowLimitInToken(
  token: string,
  priceDataMap: any,
  userPositionsData: any,
  assetReserveData: any
): any {
  // TODO: enforce protocol borrow cap
  // const borrowCap = decodeConfig(reserveDataMap[token].configuration.data).borrowCap
  const tokenPriceUsd = Number(priceDataMap[token]) / Math.pow(10, 8);
  const borrowAvailableTokens =
    (userPositionsData?.totalBorrowLimit || 0) / tokenPriceUsd;
  const availableInPool =
    Number(assetReserveData.totalAToken) /
    Math.pow(10, tokenDecimalsMap[token]);
  return borrowAvailableTokens > availableInPool
    ? availableInPool
    : borrowAvailableTokens * 0.85;
}

//return precision for token amount worth $0.01
export function getTokenPrecision(
  token: string,
  priceDataMap: any
): any {
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
  priceDataMap: any,
  assetReserveData: any,
  userEthBalance: any,
  userWalletTokenBalance: any,
  actionType: string
): any {
  const userTokenSuppliedPosition = userPositionsData?.supplied.find(
    (e: any) => e.underlyingAsset == token,
  );
  const userTokenBorrowedPosition = userPositionsData?.borrowed.find(
    (e: any) => e.underlyingAsset == token,
  );

  const userBorrowLimitToken = getBorrowLimitInToken(
    token,
    priceDataMap,
    userPositionsData,
    assetReserveData
  );

  const userBalance = wrappedTokens.includes(token) ? userEthBalance?.value : userWalletTokenBalance;

  switch (actionType) {
    case 'supply':
      // TODO: enforce protocol supply cap
      const normalizedWalletBalance =
        (Number(userBalance) || 0) /
        Math.pow(10, tokenDecimalsMap[token]);
      return normalizedWalletBalance;
    case 'withdraw':
      return userTokenSuppliedPosition?.balance || 0;
    case 'borrow':
      return userBorrowLimitToken;
    case 'repay':
      return userTokenBorrowedPosition?.balance || 0;
  } 
}

export function calculatePredictedHealthFactor(
  token: string,
  amount: number,
  actionType: string,
  priceDataMap: any,
  userPositionsData: any
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