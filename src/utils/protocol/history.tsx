import { useState, useEffect } from 'react';

import { chainName } from '../config';

export function useInterestRateHistory(token: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(
      'https://api.hyperlend.finance/data/interestRateHistory?chain=' +
        chainName +
        '&token=' +
        token,
    )
      .then((response) => response.json())
      .then((json) => {
        let values = json
          ? json.map((e: any) => ({
              timestamp: e.timestamp,
              liquidityRate: e[token].currentLiquidityRate,
              borrowRate: e[token].currentVariableBorrowRate,
            }))
          : [];
        values.sort((a: any, b: any) => a.timestamp - b.timestamp);

        setData(values);
      })
      .catch((error) => console.error(error));
  }, []);

  return data || [];
}
