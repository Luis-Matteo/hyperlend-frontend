import { useEffect, useMemo } from 'react';
import CardItem from '../../components/common/CardItem';
import { formatUnit, calculateApyIsolated } from '../../utils/functions';

import { useAccount, useSwitchChain } from 'wagmi';
import { ModalType } from '../../utils/types';

import {
  tokenNameMap,
  tokenFullNameMap,
  iconsMap,
  tokenDecimalsMap,
  stablecoinsList,
  networkChainId,
  tokenColorMap,
} from '../../utils/config';

import { useProtocolPairsData } from "../../utils/protocol/isolated/pairs";
import { useAssetPrice } from "../../utils/protocol/isolated/prices";

interface CoreTableProps {
  stable: boolean;
  searchText: string;
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
}

interface IsolatedPairInfo {
  asset: string;
  assetName: string,
  assetSymbol: string,
  assetIcon: string,
  collateralName: string,
  collateralSymbol: string,
  collateralIcon: string,
  totalAssets: number,
  totalAssetsUsd: number,
  supplyApy: number,
  totalBorrowed: number,
  totalBorrowedUsd: number,
  borrowApy: number,
  totalCollateral: number,
  totalCollateralUsd: number,
  availableLiquidity: number,
  availableLiquidityUsd: number,
  utilization: number,
  ltv: number,
}

  // pair: '',
  // asset: '',
  // collateral: '',
  // decimals: 0n,
  // exchangeRate: {
  //   oracle: '',
  //   highExchangeRate: 0n,
  //   lastTimestamp: 0n,
  //   lowExchangeRate: 0n,
  //   maxOracleDeviation: 0n,
  //   chainlinkAssetAddress: 0x,
  //   chainlinkCollateralAddress: 0x
  // },
  // interestRate: {
  //   lastBlock: 0,
  //   feeToProtocolRate: 0,
  //   lastTimestamp: 0n,
  //   ratePerSec: 0n,
  // },
  // ltv: 0n,
  // name: '',
  // symbol: '0',
  // totalAsset: 0n,
  // totalBorrow: 0n,
  // totalCollateral: 0n,

function IsolatedTable({}: CoreTableProps) {
  const account = useAccount();
  const { switchChain } = useSwitchChain();

  const pairs = useProtocolPairsData();

  // Extract all oracle addresses from pairs
  const oracleAddresses = useMemo(() => {
    if (!pairs || !pairs.pairsDataMap) return [];
    return Object.keys(pairs.pairsDataMap).flatMap(pair => [
      pairs.pairsDataMap[(pair as string)].exchangeRate.chainlinkAssetAddress,
      pairs.pairsDataMap[(pair as string)].exchangeRate.chainlinkCollateralAddress,
    ]);
  }, [pairs]);
  const { priceDataMap } = useAssetPrice(oracleAddresses);

  let markets: IsolatedPairInfo[] = []
  if (pairs && pairs.pairsDataMap) {
    const pairInfo = pairs.pairsDataMap;

    for (let pairAddress of Object.keys(pairs.pairsDataMap)){
      const pair = pairInfo[pairAddress]

      const assetPriceUsd = priceDataMap[pair.exchangeRate.chainlinkAssetAddress] || 0n;
      const collateralPriceUsd = priceDataMap[pair.exchangeRate.chainlinkCollateralAddress] || 0n;
      const assetPriceUsdNormalized = Number(assetPriceUsd) / Math.pow(10, 8);
      const collateralPriceUsdNormalized = Number(collateralPriceUsd) / Math.pow(10, 8);

      const totalAssets = Number(pair.totalAsset) / Math.pow(10, tokenDecimalsMap[pair.asset])
      const totalCollateral = Number(pair.totalCollateral) / Math.pow(10, tokenDecimalsMap[pair.collateral])
      const totalBorrow = Number(pair.totalBorrow) / Math.pow(10, tokenDecimalsMap[pair.asset])

      const UTIL_PREC = 100000n;
      const utilizationRateBn = pair.totalAsset == 0n ? 0n : (UTIL_PREC * pair.totalBorrow) / pair.totalAsset;
      const utilization = Number(utilizationRateBn) / Number(UTIL_PREC)
      
      const borrowApy = calculateApyIsolated(pair.interestRate.ratePerSec)
      const supplyApy = borrowApy * utilization * (1 - Number(pair.interestRate.feeToProtocolRate) / 100000)

      const availableLiquidity = Number(pair.availableLiquidity) / Math.pow(10, tokenDecimalsMap[pair.asset])
      const availableLiquidityUsd = availableLiquidity * assetPriceUsdNormalized

      markets.push({
        asset: pair.asset,
        assetName: tokenFullNameMap[pair.asset],
        assetSymbol: tokenNameMap[pair.asset],
        assetIcon: iconsMap[tokenNameMap[pair.asset]],
        collateralName: tokenFullNameMap[pair.collateral],
        collateralSymbol: tokenNameMap[pair.collateral],
        collateralIcon: iconsMap[tokenNameMap[pair.collateral]],
        totalAssets: totalAssets,
        totalAssetsUsd: totalAssets * assetPriceUsdNormalized,
        supplyApy: supplyApy,
        totalBorrowed: totalBorrow,
        totalBorrowedUsd: totalBorrow * assetPriceUsdNormalized,
        borrowApy: borrowApy,
        totalCollateral: totalCollateral,
        totalCollateralUsd: totalCollateral * collateralPriceUsdNormalized,
        availableLiquidity: availableLiquidity,
        availableLiquidityUsd: availableLiquidityUsd,
        utilization: utilization,
        ltv: Number(pair.ltv) / 1000,
      })
    }
  }

  useEffect(() => {
    if (account.isConnected && account.chainId != networkChainId) {
      switchChain({ chainId: networkChainId });
    }
  }, [account]);

  return (
    <>
      <CardItem className='md:py-6 md:px-7 hidden xl:block'>
        <div className='w-full'>
          <div className='py-3 px-2 border-y-[1px] bg-grey border-[#212325] flex justify-between xl:gap-2 2xl:gap-8'>
            <div className='flex flex-1 items-center gap-2'>
              <div className='text-white font-lufga text-[11px] w-[80px] 2xl:w-[120px]'>
                Asset
              </div>
              <div className='text-white font-lufga text-[11px] w-[80px] 2xl:w-[120px]'>
                Collateral
              </div>
              <div className='flex flex-1'>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[14%] text-center '>
                  Total Assets
                </p>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[12%] text-center '>
                  Supply APY
                </p>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[14%] text-center '>
                  Total Borrowed
                </p>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[12%] text-center '>
                  Borrow APY
                </p>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[16%] text-center '>
                  Total Collateral
                </p>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[18%] text-center '>
                  Available Liquidity
                </p>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[8%] text-center '>
                  Utilization
                </p>
                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[8%] text-center '>
                  LTV
                </p>
              </div>
            </div>
          </div>
          <div className='lg:max-h-[calc(100vh-346px)] xl:max-h-[calc(100vh-394px)] h-full overflow-auto hidden xl:block'>
            {(markets || []).map((item, key) => (
              <div
                className='flex justify-between items-center xl:gap-2 2xl:gap-8 py-[14px] px-2 border-b-[1px] border-[#212325] hover:bg-[#1F2A29] cursor-pointer'
                key={key}
              >
                <div className='flex flex-1 gap-2 items-center'>
                  <div className='flex items-center gap-2 h-full w-[80px] 2xl:w-[120px]'>
                    <img
                      src={item.assetIcon}
                      alt='symbol'
                      className='w-4 h-4 md:w-6 md:h-6'
                    />
                    <p className='text-xs md:text-base text-white font-lufga'>
                      {item.assetSymbol}
                    </p>
                  </div>
                  <div className='flex items-center gap-2 h-full w-[80px] 2xl:w-[120px]'>
                    <img
                      src={item.collateralIcon}
                      alt='symbol'
                      className='w-4 h-4 md:w-6 md:h-6'
                    />
                    <p className='text-xs md:text-base text-white font-lufga'>
                      {item.collateralSymbol}
                    </p>
                  </div>
                  <div className='flex flex-1 items-center gap-2'>
                    <div className='text-white font-lufga w-[14%] flex justify-center'>
                      <div className='text-sm'>
                        <p className=''>{formatUnit(item.totalAssets)}</p>
                        <p className=''>${formatUnit(item.totalAssetsUsd)}</p>
                      </div>
                    </div>
                    <div className='font-lufga w-[12%] flex justify-center'>
                      <p className='text-sm text-success'>
                        {item.supplyApy.toFixed(2)}%
                      </p>
                    </div>
                    <div className='text-white font-lufga w-[14%] flex justify-center'>
                      <div className='text-right text-sm'>
                        <p className=''>{formatUnit(item.totalBorrowed)}</p>
                        <p className=''>${formatUnit(item.totalBorrowedUsd)}</p>
                      </div>
                    </div>
                    <div className='font-lufga w-[12%] flex justify-center'>
                      <p className='text-sm text-success'>
                        {item.borrowApy.toFixed(2)}%
                      </p>
                    </div>
                    <div className='text-white font-lufga w-[16%] flex justify-center'>
                      <div className='text-right text-sm'>
                        <p className=''>{formatUnit(item.totalCollateral)}</p>
                        <p className=''>
                          ${formatUnit(item.totalCollateralUsd)}
                        </p>
                      </div>
                    </div>
                    <div className='text-white font-lufga w-[18%] flex justify-center'>
                      <div className='text-right text-sm'>
                        <p className=''>
                          {formatUnit(item.availableLiquidity)}
                        </p>
                        <p className=''>
                          ${formatUnit(item.availableLiquidityUsd)}
                        </p>
                      </div>
                    </div>
                    <div className='text-white font-lufga w-[8%] flex justify-center'>
                      <p className='text-sm'>{item.utilization}%</p>
                    </div>
                    <div className='text-white font-lufga w-[8%] flex justify-center'>
                      <p className='text-sm'>{item.ltv}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardItem>

      <div className='xl:hidden w-full flex flex-col gap-4'>
        {(markets || []).map((item, key) => (
          <CardItem className='' key={key}>
            <div className='flex flex-col hover:bg-[#1F2A29] cursor-pointer rounded-t-2xl'>
              <div
                className={`flex items-center gap-8 h-full p-[20px] rounded-t-2xl bg-gradient-to-t from-transparent to-[#f7931a40]`}
              >
                <div className='flex gap-2'>
                  <img src={item.assetIcon} alt='symbol' className='w-6 h-6' />
                  <p className=' text-white font-lufga'>{item.assetSymbol}</p>
                </div>
                <div className='flex gap-2'>
                  <img
                    src={item.collateralIcon}
                    alt='symbol'
                    className='w-6 h-6'
                  />
                  <p className=' text-white font-lufga'>
                    {item.collateralSymbol}
                  </p>
                </div>
              </div>
              <div className='flex flex-col gap-[30px] p-[24px] border-y-[1px] border-[#212325]'>
                {/* <p className='text-[#B1B5C3] font-medium font-lufga text-sm md:text-base '>
                                    Total Assets:{' '}
                                    <span className='text-white'>
                                        {formatUnit(item.totalAssets)}{' '}
                                    </span>
                                    <span className='text-xs'>
                                        (${formatUnit(item.totalAssetsUsd)})
                                    </span>
                                </p> */}
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
                      Total Assets
                    </p>
                    <p className='text-white font-medium font-lufga text-lg'>
                      {formatUnit(item.totalAssets)}{' '}
                      <span className='text-[#B1B5C3] text-xs'>
                        ${formatUnit(item.totalAssetsUsd)}
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
                      {formatUnit(item.availableLiquidity)}{' '}
                      <span className='text-[#B1B5C3] text-xs'>
                        ${formatUnit(item.availableLiquidityUsd)}
                      </span>
                    </p>
                  </div>
                </div>
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
                      Utilization
                    </p>
                    <p className='text-white font-medium font-lufga text-lg'>
                      {item.utilization}%
                    </p>
                  </div>
                  <div className='flex flex-col gap-[14px]'>
                    <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                      LTV
                    </p>
                    <p className='text-white font-medium font-lufga text-lg'>
                      {item.ltv}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='p-[24px]'>
              <button className='w-full py-2 text-secondary font-lufga rounded-xl font-bold hover:text-gray underline'>
                Details
              </button>
            </div>
          </CardItem>
        ))}
      </div>
    </>
  );
}

export default IsolatedTable;
