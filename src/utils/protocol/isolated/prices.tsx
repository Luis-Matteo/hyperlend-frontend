import { useMemo, useCallback } from 'react';
import { useReadContracts } from 'wagmi';

import { abis } from '../../config';

export function useAssetPrice(chainlinkOracles: `0x${string}`[]) {
  const {
    data: priceDataResults,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: chainlinkOracles.map((oracle) => ({
      abi: abis.chainlink,
      address: oracle,
      functionName: 'latestRoundData',
      args: [],
    })),
  });

  const getPricesData = useCallback(() => {
    if (!priceDataResults) {
      return {}
    }

    return chainlinkOracles.reduce(
      (acc, asset, index) => {
        const result = priceDataResults[index];
        if (result && result.status === 'success') {
          acc[asset] = (result.result as any)[1] as bigint;
        } else {
          console.error(`Failed to get price data from oracle: ${asset}`);
        }
        return acc;
      },
      {} as Record<string, bigint>,
    );
  }, [priceDataResults]);

  const priceDataMap = useMemo(() => getPricesData(), [getPricesData]);

  return { priceDataMap, isLoading, isError };
}
