import { erc20Abi } from 'viem';

import { 
  contracts, 
  wrappedTokenProtocolTokens, 
  abis 
} from "../../config";

const functionNames: any = {
  supply: 'depositETH',
  withdraw: 'withdrawETH',
  borrow: 'borrowETH',
  repay: 'repayETH'
}

export async function wrappedTokenAction(
  action: string,
  token: string,
  bgIntAmount: bigint,
  address: string,
  hTokenAllowance: number,
  dTokenAllowance: number,
  writeContractAsync: any,
  publicClient: any 
) {
  try {
    if (action === "withdraw") {
      if (hTokenAllowance < Number(bgIntAmount)) {
        const approveResult = await writeContractAsync({
          address: wrappedTokenProtocolTokens.hToken,
          abi: erc20Abi,
          functionName: "approve",
          args: [contracts.wrappedTokenGatewayV3, bgIntAmount],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveResult.hash });
      }
    } else if (action === "borrow") {
      if (dTokenAllowance < Number(bgIntAmount)) {
        const approveResult = await writeContractAsync({
          address: wrappedTokenProtocolTokens.dToken,
          abi: abis.variableDebtToken,
          functionName: "approveDelegation",
          args: [contracts.wrappedTokenGatewayV3, bgIntAmount],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveResult.hash });
      }
    }

    const functionParams: any = {
      supply: [token, address, 0],
      withdraw: [token, bgIntAmount, address],
      borrow: [token, bgIntAmount, 2, 0],
      repay: [token, bgIntAmount, 2, address],
    };

    const txResult = await writeContractAsync({
      address: contracts.wrappedTokenGatewayV3,
      abi: abis.wrappedTokenGatewayV3,
      functionName: functionNames[action],
      args: functionParams[action],
      value: action === "supply" ? bgIntAmount : (0 as any as bigint),
    });

    await publicClient.waitForTransactionReceipt({ hash: txResult.hash });
  } catch (error) {
    console.error("An error occurred in wrappedTokenAction:", error);
  }
}
