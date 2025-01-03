import { useEffect, useState } from 'react';

/**
 * Custom hook to fetch the HyperliquidNames primary name associated with a given address.
 * @param address - The Ethereum address to look up.
 */
export function useFetchPrimaryHlName(address?: `0x${string}`) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchPrimaryName = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://hlnames-rest-api.onrender.com/api/resolve/primary_name/${address}`,
          {
            method: 'GET',
            headers: {
              accept: '*/*',
              'X-API-Key': 'CPEPKMI-HUSUX6I-SE2DHEA-YYWFG5Y',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const json = await response.json();
        setData(json.primaryName);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryName();
  }, [address]);

  return { data, loading, error };
}
