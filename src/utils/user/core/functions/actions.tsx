import { erc20Abi } from 'viem';

import { contracts, abis } from '../../../config';

export async function protocolAction(
  actionType: string,
  token: string,
  userAddress: string,
  allowance: number,
  amount: number,
  bgIntAmount: bigint,
  writeContractAsync: any,
  publicClient: any,
  useMaxAmount: boolean,
) {
  try {
    if (actionType == 'supply' || actionType == 'repay') {
      if (allowance < amount) {
        const approveResult = await writeContractAsync({
          address: token as any,
          abi: erc20Abi,
          functionName: 'approve',
          args: [
            contracts.pool,
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
        });
        await publicClient.waitForTransactionReceipt({
          hash: approveResult.hash,
        });
      }
    }

    const functionParams: any = {
      supply: [token, bgIntAmount, userAddress, 0], //asset, amount, onBehalfOf, refCode
      withdraw: [token, bgIntAmount, userAddress], //asset, amount, to
      borrow: [token, bgIntAmount, 2, 0, userAddress], //asset, amount, interestRateMode (2 = variable), refCode, onBehalfOf
      repay: [token, bgIntAmount, 2, userAddress], //asset, amount, interestRateMode, onBehalfOf
    };

    if (useMaxAmount && (actionType == 'withdraw' || actionType == 'repay')) {
      functionParams[actionType][1] =
        '115792089237316195423570985008687907853269984665640564039457584007913129639935';
    }

    const txResult = await writeContractAsync({
      address: contracts.pool,
      abi: abis.pool,
      functionName: actionType,
      args: functionParams[actionType],
    });
    await publicClient.waitForTransactionReceipt({ hash: txResult.hash });
  } catch (error) {
    console.error('An error occurred in protocolAction:', error);
  }
}

export async function updateCollateralAction(
  token: string,
  currentCollateralStatus: boolean,
  writeContractAsync: any,
  publicClient: any,
) {
  try {
    const txResult = await writeContractAsync({
      address: contracts.pool,
      abi: abis.pool,
      functionName: 'setUserUseReserveAsCollateral',
      args: [token, !currentCollateralStatus],
    });
    await publicClient.waitForTransactionReceipt({ hash: txResult.hash });
  } catch (error) {
    console.error('An error occurred in updateCollateral:', error);
  }
}
