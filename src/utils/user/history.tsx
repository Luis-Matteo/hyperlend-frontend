import { useState, useEffect } from 'react';

import { padArray } from '../functions';
import { chainName } from '../config';

interface IUserBalanceHistory {
  totalBalanceChange: number;
  totalBalanceChangePercentage: number;
}

interface IUserPortfolioHistory {
  historicalNetWorth: number[];
}

export function useGetUserBalanceHistory(address: `0x${string}` | undefined) {
  const [data, setData] = useState<IUserBalanceHistory>({
    totalBalanceChange: 0,
    totalBalanceChangePercentage: 0,
  });

  useEffect(() => {
    fetch(
      'https://api.hyperlend.finance/data/user/valueChange?chain=' +
        chainName +
        '&address=' +
        address,
    )
      .then((response) => response.json())
      .then((json) => {
        setData({
          totalBalanceChange: json?.totalBalanceChange || 0,
          totalBalanceChangePercentage: json?.totalBalanceChangePercentage || 0,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return data;
}

export function useUserPortfolioHistory(
  address: `0x${string}` | undefined,
  isConnected: boolean,
) {
  const [data, setData] = useState<IUserPortfolioHistory>({
    historicalNetWorth: [],
  });

  useEffect(() => {
    fetch(
      'https://api.hyperlend.finance/data/user/historicalNetWorth?chain=' +
        chainName +
        '&address=' +
        address,
    )
      .then((response) => response.json())
      .then((json) => {
        json.sort((a: any, b: any) => a.timestamp - b.timestamp);
        setData({
          historicalNetWorth: padArray(
            json ? json.map((e: any) => e.usdValue) : [],
            168,
            0,
          ),
        });
      })
      .catch((error) => console.error(error));
  }, [address, isConnected]);

  return data;
}
