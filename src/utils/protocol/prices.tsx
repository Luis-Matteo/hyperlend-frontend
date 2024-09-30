import { useMemo, useCallback } from 'react';
import { useReadContracts } from 'wagmi';

import { contracts, assetAddresses, abis } from '../config';

export function useProtocolPriceData() {
  const {
    data: priceDataResults,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: assetAddresses.map((asset) => ({
      abi: abis.oracle,
      address: contracts.oracle,
      functionName: 'getAssetPrice',
      args: [asset],
    })),
  });

  const getPricesData = useCallback(() => {
    if (!priceDataResults) {
      return assetAddresses.reduce(
        (acc, asset) => {
          acc[asset] = 0n;
          return acc;
        },
        {} as Record<string, bigint>,
      );
    }

    return assetAddresses.reduce(
      (acc, asset, index) => {
        const result = priceDataResults[index];
        if (result && result.status === 'success') {
          acc[asset] = result.result as bigint;
        } else {
          console.error(`Failed to get price data for asset: ${asset}`);
        }
        return acc;
      },
      {} as Record<string, bigint>,
    );
  }, [priceDataResults]);

  const priceDataMap = useMemo(() => getPricesData(), [getPricesData]);

  return { priceDataMap, isLoading, isError };
}
