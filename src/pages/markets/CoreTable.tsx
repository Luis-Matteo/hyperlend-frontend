import { useEffect, useMemo } from 'react';
import CardItem from '../../components/common/CardItem';
import { decodeConfig, formatNumber, formatUnit } from '../../utils/functions';
import InfoItem from '../../components/common/InfoItem';
import {
  tokenNameMap,
  tokenFullNameMap,
  iconsMap,
  tokenDecimalsMap,
  stablecoinsList,
  networkChainId,
  tokenColorMap,
} from '../../utils/config';

import { useProtocolPriceData } from '../../utils/protocol/core/prices';
import { useProtocolInterestRate } from '../../utils/protocol/core/interestRates';
import { useProtocolAssetReserveData } from '../../utils/protocol/core/reserves';
import { useProtocolReservesData } from '../../utils/protocol/core/reserves';
import { useAccount, useSwitchChain } from 'wagmi';
import { AssetDetail, ModalType } from '../../utils/types';
import { filterString } from '../../utils/functions';
import { Link } from 'react-router-dom';

interface CoreTableProps {
  stable: boolean;
  searchText: string;
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
}
function CoreTable({
  stable,
  searchText,
  setModalStatus,
  setModalType,
  setSelectedToken,
}: CoreTableProps) {
  const { reserveDataMap } = useProtocolReservesData();
  const { priceDataMap } = useProtocolPriceData();
  const { interestRateDataMap } = useProtocolInterestRate();

  const protocolAssetReserveDataMap = Object.keys(reserveDataMap).reduce(
    (acc, token) => {
      acc[token] = useProtocolAssetReserveData(token);
      return acc;
    },
    {} as Record<string, any>,
  );

  const account = useAccount();
  const { switchChain } = useSwitchChain();

  const getAssets = () => {
    let assets: AssetDetail[] = [];
    for (let token of Object.keys(reserveDataMap)) {
      const protocolAssetReserveData = protocolAssetReserveDataMap[token];

      if (stable && !stablecoinsList.includes(tokenNameMap[token])) continue;
      if (
        searchText.length > 0 &&
        !(
          filterString(tokenNameMap[token], searchText) ||
          filterString(tokenFullNameMap[token], searchText)
        )
      )
        continue;

      const configuration = decodeConfig(
        reserveDataMap[token].configuration.data,
      );
      const tokenPrice = Number(priceDataMap[token]) / Math.pow(10, 8);
      const totalSuppliedTokens =
        Number(protocolAssetReserveData.totalAToken) /
        Math.pow(10, tokenDecimalsMap[token]);
      const totalBorrowedTokens =
        Number(protocolAssetReserveData.totalVariableDebt) /
        Math.pow(10, tokenDecimalsMap[token]);

      const totalSuppliedUsd = tokenPrice * totalSuppliedTokens;
      const totalBorrowedUsd = tokenPrice * totalBorrowedTokens;
      const totalLiquidityToken = totalSuppliedTokens - totalBorrowedTokens;
      const totalLiquidityUsd =
        tokenPrice * totalSuppliedTokens - tokenPrice * totalBorrowedTokens;

      assets.push({
        name: tokenFullNameMap[token],
        symbol: tokenNameMap[token],
        underlyingAsset: token,
        icon: iconsMap[tokenNameMap[token]],
        totalSupplied: isNaN(totalSuppliedTokens) ? 0 : totalSuppliedTokens,
        totalSuppliedUsd: isNaN(totalSuppliedUsd) ? 0 : totalSuppliedUsd,
        totalBorrowed: isNaN(totalBorrowedTokens) ? 0 : totalBorrowedTokens,
        totalBorrowedUsd: isNaN(totalBorrowedUsd) ? 0 : totalBorrowedUsd,
        totalLiquidityToken: isNaN(totalLiquidityToken)
          ? 0
          : totalLiquidityToken,
        totalLiquidtyUsd: isNaN(totalLiquidityUsd) ? 0 : totalLiquidityUsd,
        supplyApy: interestRateDataMap[token].supply,
        borrowApy: interestRateDataMap[token].borrow,
        isCollateral: configuration.ltv > 0,
        ltv: configuration.ltv / 100,
        isStable: stablecoinsList.includes(tokenNameMap[token]),
        color:
          `to-[#${tokenColorMap[tokenNameMap[token]]}40]` || 'to-[#f7931a40]',
      });
    }
    return assets;
  };

  const assets = useMemo(
    () => getAssets(),
    [reserveDataMap, priceDataMap, interestRateDataMap, stable, searchText],
  );

  useEffect(() => {
    if (account.isConnected && account.chainId != networkChainId) {
      switchChain({ chainId: networkChainId });
    }
  }, [account]);

  console.log(assets);
  return (
    <>
      <CardItem className='md:py-6 md:px-7 hidden xl:block'>
        <div className='w-full'>
          <div className='py-3 px-2 border-y-[1px] bg-grey border-[#212325] flex justify-between xl:gap-2 2xl:gap-8'>
            <div className='flex flex-1 items-center gap-2'>
              <div className='text-white font-lufga text-[11px] w-[80px] 2xl:w-[20%]'>
                Asset
              </div>
              <div className='flex gap-2 items-center w-[13%]'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap'>
                  Total Supplied
                </p>
                <InfoItem
                  title={<span>Total hyperlend deposits for each asset.</span>}
                  className='w-[300px]'
                />
              </div>
              <div className='flex gap-2 items-center w-[11%]'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap'>
                  Supply APY
                </p>
                <InfoItem
                  title={
                    <span>
                      A percentage you will earn on deposits over a year.
                    </span>
                  }
                  className='w-[300px]'
                />
              </div>
              <div className='flex gap-2 items-center w-[13%]'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap'>
                  Total Borrowed
                </p>
                <InfoItem
                  title={<span>Total hyperlend borrows for each asset.</span>}
                  className='w-[300px]'
                />
              </div>
              <div className='flex gap-2 items-center w-[11%]'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap'>
                  Borrow APY
                </p>
                <InfoItem
                  title={
                    <span>
                      A percentage you will pay on borrows over a year.
                    </span>
                  }
                  className='w-[300px]'
                />
              </div>
              <div className='flex gap-2 items-center w-[16%]'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap'>
                  Available Liquidity
                </p>
                <InfoItem
                  title={
                    <span>
                      The amount of tokens available to borrow for each asset.
                    </span>
                  }
                  className='w-[300px]'
                />
              </div>
              <div className='flex gap-2 items-center w-[9%]'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap'>
                  Collateral
                </p>
                <InfoItem
                  title={
                    <span>
                      Signals if you can borrow using this asset as a
                      collateral.
                    </span>
                  }
                  className='w-[300px]'
                />
              </div>
              <div className='flex gap-2 items-center w-[]'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap'>
                  LTV
                </p>
                <InfoItem
                  title={
                    <span>
                      The amount you can borrow against your collateral. e.g.
                      80% LTV means you can borrow up to 80% of the collateral
                      value.
                    </span>
                  }
                  className='w-[300px]'
                />
              </div>
            </div>
            <div className='w-[120px] 2xl:w-[240px]'></div>
          </div>
          <div className='lg:max-h-[calc(100vh-346px)] xl:max-h-[calc(100vh-394px)] h-full overflow-auto hidden xl:block'>
            {(assets || []).map((item, key) => (
              <div
                className='flex justify-between items-center xl:gap-2 2xl:gap-8 py-[14px] px-2.5 border-b-[1px] border-[#212325] hover:bg-[#1F2A29] cursor-pointer'
                key={key}
              >
                <Link
                  className='flex flex-1 gap-2 items-center'
                  to={`${item.underlyingAsset}`}
                >
                  <div className='flex items-center gap-2 h-full w-[80px] 2xl:w-[20%]'>
                    <img
                      src={item.icon}
                      alt='symbol'
                      className='w-4 h-4 md:w-6 md:h-6'
                    />
                    <p className='text-xs md:text-base text-white font-lufga'>
                      {item.symbol}
                    </p>
                  </div>
                  <div className='text-white font-lufga w-[13%] text-sm'>
                    <p className=''>{formatUnit(item.totalSupplied)}</p>
                    <p className=''>${formatUnit(item.totalSuppliedUsd)}</p>
                  </div>
                  <div className='text-white font-lufga w-[11%] text-sm'>
                    {formatNumber(item.supplyApy, 2)}%
                  </div>
                  <div className='text-white font-lufga w-[13%] text-sm'>
                    <p className=''>{formatUnit(item.totalBorrowed)}</p>
                    <p className=''>${formatUnit(item.totalBorrowedUsd)}</p>
                  </div>
                  <div className='text-white font-lufga w-[11%] text-sm'>
                    {formatNumber(item.borrowApy, 2)}%
                  </div>
                  <div className='text-white font-lufga w-[16%] text-sm'>
                    <p className=''>{formatUnit(item.totalLiquidityToken)}</p>
                    <p className=''>${formatUnit(item.totalLiquidtyUsd)}</p>
                  </div>
                  <div className='text-white font-lufga w-[9%] text-sm'>
                    {item.isCollateral ? (
                      <div className='text-success'>✓</div>
                    ) : (
                      '─'
                    )}
                  </div>
                  <div className='text-white font-lufga text-sm'>
                    {formatNumber(item.ltv, 2)}%
                  </div>
                </Link>

                <div className='grid xl:grid-cols-1 2xl:grid-cols-2 gap-2 xl:w-[120px] 2xl:w-[240px] '>
                  <button
                    className='w-full py-2 bg-secondary font-lufga rounded-xl font-bold hover:'
                    onClick={() => {
                      setModalStatus(true);
                      setModalType('supply');
                      setSelectedToken(item.underlyingAsset);
                    }}
                  >
                    Supply
                  </button>
                  <button
                    className='w-full py-2 bg-secondary font-lufga rounded-xl font-bold'
                    onClick={() => {
                      setModalStatus(true);
                      setModalType('borrow');
                      setSelectedToken(item.underlyingAsset);
                    }}
                  >
                    Borrow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardItem>

      <div className='xl:hidden w-full flex flex-col gap-4'>
        {(assets || []).map((item, key) => (
          <CardItem className='' key={key}>
            <Link
              className='flex flex-col hover:bg-[#1F2A29] cursor-pointer rounded-t-2xl'
              to={`${item.underlyingAsset}`}
            >
              <div
                className={`flex items-center gap-2 col-span-2 h-full p-[20px] rounded-t-2xl bg-gradient-to-t from-transparent ${item.color}`}
              >
                <img src={item.icon} alt='symbol' className='w-6 h-6' />
                <p className=' text-white font-lufga'>{item.symbol}</p>
              </div>
              <div className='flex flex-col gap-[30px] p-[24px] border-y-[1px] border-[#212325]'>
                <p className='text-[#B1B5C3] font-medium font-lufga text-sm md:text-base '>
                  Total Supplied:{' '}
                  <span className='text-white'>
                    {formatUnit(item.totalSupplied)}{' '}
                  </span>
                  <span className='text-xs'>
                    (${formatUnit(item.totalSuppliedUsd)})
                  </span>
                </p>
                <div className='grid grid-cols-2 gap-[30px]'>
                  <div className='flex flex-col gap-[14px]'>
                    <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                      Supply APY
                    </p>
                    <p className='text-white font-medium font-lufga text-lg'>
                      {formatUnit(item.supplyApy)}%
                    </p>
                  </div>
                  <div className='flex flex-col gap-[14px]'>
                    <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                      Total Borrowed
                    </p>
                    <p className='text-white font-medium font-lufga text-lg'>
                      {formatUnit(item.totalBorrowed)}{' '}
                      <span className='text-[#B1B5C3] text-xs'>
                        ${formatUnit(item.totalBorrowedUsd)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-[30px]'>
                  <div className='flex flex-col gap-[14px]'>
                    <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                      Borrow APY
                    </p>
                    <p className='text-success font-medium font-lufga text-lg'>
                      {formatUnit(item.borrowApy)}%
                    </p>
                  </div>
                  <div className='flex flex-col gap-[14px]'>
                    <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                      Available Liquidity
                    </p>
                    <p className='text-white font-medium font-lufga text-lg'>
                      {formatUnit(item.totalLiquidityToken)}{' '}
                      <span className='text-[#B1B5C3] text-xs'>
                        ${formatUnit(item.totalLiquidtyUsd)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <div className='grid grid-cols-2 gap-4 p-[24px]'>
              <button
                className='w-full py-2 text-secondary font-lufga rounded-xl font-bold hover:text-gray'
                onClick={() => {
                  setModalStatus(true);
                  setModalType('supply');
                  setSelectedToken(item.underlyingAsset);
                }}
              >
                Supply
              </button>
              <button
                className='w-full py-2 text-secondary font-lufga rounded-xl font-bold hover:text-gray'
                onClick={() => {
                  setModalStatus(true);
                  setModalType('borrow');
                  setSelectedToken(item.underlyingAsset);
                }}
              >
                Borrow
              </button>
            </div>
          </CardItem>
        ))}
      </div>
    </>
  );
}

export default CoreTable;
