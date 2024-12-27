import { erc20Abi, parseGwei } from 'viem';

import { abis } from '../../../config';

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
  pairAddress: string,
) {
  try {
    if (
      !userAddress ||
      userAddress == '0x0000000000000000000000000000000000000000'
    )
      throw new Error('Missing user address');

    if (
      actionType == 'supply' ||
      actionType == 'repay' ||
      actionType == 'addCollateral'
    ) {
      if (allowance < amount) {
        const approveResult = await writeContractAsync({
          address: token as any,
          abi: erc20Abi,
          functionName: 'approve',
          args: [
            pairAddress,
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
          maxFeePerGas: parseGwei('0.1'),
        });
        await publicClient.waitForTransactionReceipt({
          hash: approveResult.hash,
        });
      }
    }

    const functionParams: any = {
      deposit: [bgIntAmount, userAddress], //amount, receiver
      withdraw: [bgIntAmount, userAddress, userAddress], //amount, receiver, owner
      borrowAsset: [bgIntAmount, 0, userAddress], //_borrowAmount, _collateralAmount, receiver
      repayAsset: [bgIntAmount, userAddress], //shares, borrower
      addCollateral: [bgIntAmount, userAddress], //uint256 _collateralAmount, address _borrower
      removeCollateral: [bgIntAmount, userAddress], //uint256 _collateralAmount, address _receiver
    };

    if (useMaxAmount && (actionType == 'withdraw' || actionType == 'repay')) {
      // functionParams[actionType][1] =
      //   '115792089237316195423570985008687907853269984665640564039457584007913129639935';
    }

    if (bgIntAmount == 0n){
      throw new Error("ZERO_AMOUNT")
    }

    const functionNameConvert: any = {
      supply: 'deposit',
      withdraw: 'withdraw',
      repay: 'repayAsset',
      borrow: 'borrowAsset',
      addCollateral: 'addCollateral',
      removeCollateral: 'removeCollateral',
    };

    const txResult = await writeContractAsync({
      address: pairAddress,
      abi: abis.isolatedPool,
      functionName: functionNameConvert[actionType],
      args: functionParams[functionNameConvert[actionType]],
      maxFeePerGas: parseGwei('0.1'),
    });
    await publicClient.waitForTransactionReceipt({ hash: txResult.hash });
  } catch (error) {
    console.error('An error occurred in protocolAction:', error);
  }
}
