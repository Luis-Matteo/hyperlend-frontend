import { useReadContract } from 'wagmi';

import { contracts, abis } from '../../config';

export function useUserAccountData(pair: string, address?: string) {
  const { data: userAccountData, refetch } = useReadContract({
    abi: abis.uiDataProviderIsolated,
    address: contracts.uiDataProviderIsolated,
    functionName: 'getUserData',
    args: [address || '0x0000000000000000000000000000000000000000', pair],
    query: {
      refetchInterval: 10000,
    },
  });

  return { userAccountData, refetch };
}
