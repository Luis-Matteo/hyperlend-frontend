import { erc20Abi, parseGwei } from 'viem';

import { contracts, wrappedTokenProtocolTokens, abis } from '../../../config';

const functionNames: any = {
  supply: 'depositETH',
  withdraw: 'withdrawETH',
  borrow: 'borrowETH',
  repay: 'repayETH',
};

export async function wrappedTokenAction(
  action: string,
  token: string,
  bgIntAmount: bigint,
  address: string,
  hTokenAllowance: number,
  dTokenAllowance: number,
  writeContractAsync: any,
  publicClient: any,
  useMaxAmount: boolean,
) {
  try {
    if (action === 'withdraw') {
      if (hTokenAllowance <= Number(bgIntAmount)) {
        const approveResult = await writeContractAsync({
          address: wrappedTokenProtocolTokens[token].hToken,
          abi: erc20Abi,
          functionName: 'approve',
          args: [
            contracts.wrappedTokenGatewayV3[token],
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
          maxFeePerGas: parseGwei('0.1'),
        });
        await publicClient.waitForTransactionReceipt({
          hash: approveResult,
        });
      }
    } else if (action === 'borrow') {
      if (dTokenAllowance <= Number(bgIntAmount)) {
        const approveResult = await writeContractAsync({
          address: wrappedTokenProtocolTokens[token].dToken,
          abi: abis.variableDebtToken,
          functionName: 'approveDelegation',
          args: [
            contracts.wrappedTokenGatewayV3[token],
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
          maxFeePerGas: parseGwei('0.1'),
        });
        await publicClient.waitForTransactionReceipt({
          hash: approveResult,
        });
      }
    }

    if (bgIntAmount == 0n) {
      throw new Error('ZERO_AMOUNT');
    }

    const functionParams: any = {
      supply: [token, address, 0],
      withdraw: [token, bgIntAmount, address],
      borrow: [token, bgIntAmount, 2, 0],
      repay: [token, bgIntAmount, 2, address],
    };

    if (useMaxAmount && (action == 'withdraw' || action == 'repay')) {
      functionParams[action][1] =
        115792089237316195423570985008687907853269984665640564039457584007913129639935n;
      bgIntAmount = bgIntAmount * 102n / 100n; //it's recommended to send an _amount slightly higher than the current borrowed amount, will be refunded
    }

    const txResult = await writeContractAsync({
      address: contracts.wrappedTokenGatewayV3[token],
      abi: abis.wrappedTokenGatewayV3,
      functionName: functionNames[action],
      args: functionParams[action],
      value:
        action === 'supply' || action === 'repay'
          ? bgIntAmount
          : (0 as any as bigint),
      maxFeePerGas: parseGwei('0.1'),
    });

    await publicClient.waitForTransactionReceipt({ hash: txResult });
  } catch (error) {
    console.log(bgIntAmount)
    console.error('An error occurred in wrappedTokenAction:', error);
  }
}
