import { useState, useEffect } from 'react';
import MarketControl from '../components/markets/MarketControl';
import CardItem from '../components/common/CardItem';
import { formatNumber, formatUnit } from '../utils/functions';
import Navbar from '../layouts/Navbar';
import Modal from '../components/common/Modal';
import { useSwitchChain, useAccount } from 'wagmi'
import ReactGA from 'react-ga4';

import { decodeConfig, filterString } from '../utils/functions';
import { AssetDetail, ModalType } from '../utils/types';
import { tokenNameMap, tokenFullNameMap, iconsMap, tokenDecimalsMap, stablecoinsList, networkChainId } from '../utils/tokens';

import { useProtocolReservesData, useProtocolAssetReserveData, useProtocolPriceData, useProtocolInterestRate } from '../utils/protocolState';
import { Link } from 'react-router-dom';
import InfoItem from '../components/common/InfoItem';
import { assetsInfos } from '../utils/constants';

function Overview() {
  ReactGA.send({ hitType: "pageview", page: "/markets" });

  const { switchChain } = useSwitchChain()
  const account = useAccount()

  useEffect(() => {
    if (account.isConnected && account.chainId != networkChainId) {
      switchChain({ chainId: networkChainId });
    }
  }, [account])

  const [status, setStatus] = useState<string>('core');
  const [stable, setStable] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const closeModal = () => setModalStatus(false);

  const [modalType, setModalType] = useState<ModalType>('supply')
  const [selectedToken, setSelectedToken] = useState<string>()

  const { reserveDataMap } = useProtocolReservesData();
  const { priceDataMap } = useProtocolPriceData()
  const { interestRateDataMap } = useProtocolInterestRate()

  const getAssets = () => {
    let assets: AssetDetail[] = []
    for (let token of Object.keys(reserveDataMap)) {
      const protocolAssetReserveData = useProtocolAssetReserveData(token);

      if (stable && !stablecoinsList.includes(tokenNameMap[token])) continue;
      if (searchText.length > 0 && !(filterString(tokenNameMap[token], searchText) || filterString(tokenFullNameMap[token], searchText))) continue;

      const configuration = decodeConfig(reserveDataMap[token].configuration.data);
      const tokenPrice = Number(priceDataMap[token]) / Math.pow(10, 8)
      const totalSuppliedTokens = Number(protocolAssetReserveData.totalAToken) / Math.pow(10, tokenDecimalsMap[token])
      const totalBorrowedTokens = Number(protocolAssetReserveData.totalVariableDebt) / Math.pow(10, tokenDecimalsMap[token])

      assets.push({
        name: tokenFullNameMap[token],
        symbol: tokenNameMap[token],
        underlyingAsset: token,
        icon: iconsMap[tokenNameMap[token]],
        totalSupplied: totalSuppliedTokens,
        totalSuppliedUsd: tokenPrice * totalSuppliedTokens,
        totalBorrowed: totalBorrowedTokens,
        totalBorrowedUsd: tokenPrice * totalBorrowedTokens,
        totalLiquidityToken: totalSuppliedTokens - totalBorrowedTokens,
        totalLiquidtyUsd: (tokenPrice * totalSuppliedTokens) - (tokenPrice * totalBorrowedTokens),
        supplyApy: interestRateDataMap[token].supply,
        borrowApy: interestRateDataMap[token].borrow,
        isCollateral: configuration.ltv > 0,
        ltv: configuration.ltv / 100,
        isStable: stablecoinsList.includes(tokenNameMap[token])
      })
    }
    return assets;
  }

  return (
    <>
      <div className="w-full">
        <Navbar
          pageTitle="Markets"
        />
        <MarketControl
          status={status}
          setStatus={setStatus}
          stable={stable}
          setStable={setStable}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <CardItem
          className="md:py-6 md:px-7 flex-1 w-full overflow-x-auto"
        >
          <div className='lg:w-[1496px]'>
            <div className="py-3 px-2 border-y-[1px] bg-grey border-[#212325] hidden lg:grid grid-cols-11 gap-2">
              <div className="text-white font-lufga text-[11px] col-span-2">Asset</div>
              {
                (assetsInfos || []).map((item, key) => (
                  <div className="flex gap-2 items-center" key={key}>
                    <p className='text-white font-lufga text-[11px] whitespace-nowrap'>{item.title}</p>
                    <InfoItem
                      title={<span>{item.tooltip}</span>}
                      className='w-[300px]' />
                  </div>
                ))
              }
              <div></div>
              <div></div>
            </div>
            <div className="lg:max-h-[calc(100vh-346px)] xl:max-h-[calc(100vh-394px)] h-full overflow-auto hidden lg:block">
              {
                (getAssets() || []).map((item, key) => (
                  <div
                    className="grid grid-cols-11 items-center py-[14px] px-2.5 border-b-[1px] border-[#212325] hover:bg-[#1F2A29] cursor-pointer"
                    key={key}
                  >
                    <Link
                      className="col-span-9 grid grid-cols-9 gap-2 items-center"
                      to={`${item.underlyingAsset}`}
                    >
                      <div className="flex items-center gap-2 col-span-2 h-full">
                        <img src={item.icon} alt="symbol" className="w-4 h-4 md:w-6 md:h-6" />
                        <p className='text-xs md:text-base text-white font-lufga'>{item.symbol}</p>
                      </div>
                      <div className="text-white font-lufga">
                        <p className="">
                          {formatUnit(item.totalSupplied)}
                        </p>
                        <p className="">
                          ${formatUnit(item.totalSuppliedUsd)}
                        </p>
                      </div>
                      <div className="text-white font-lufga">{formatNumber(item.supplyApy, 2)}%</div>
                      <div className="text-white font-lufga">
                        <p className="">
                          {formatUnit(item.totalBorrowed)}
                        </p>
                        <p className="">
                          ${formatUnit(item.totalBorrowedUsd)}
                        </p>
                      </div>
                      <div className="text-white font-lufga">{formatNumber(item.borrowApy, 2)}%</div>
                      <div className="text-white font-lufga">
                        <p className="">
                          {formatUnit(item.totalLiquidityToken)}
                        </p>
                        <p className="">
                          ${formatUnit(item.totalLiquidtyUsd)}
                        </p>
                      </div>
                      <div className="text-white font-lufga">{
                        item.isCollateral ? <div className="text-success">✓</div> : "─"
                      }</div>
                      <div className="text-white font-lufga">{formatNumber(item.ltv, 2)}%</div>
                    </Link>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 col-span-2">
                      <button
                        className="w-full py-2 bg-secondary font-lufga rounded-xl font-bold hover:"
                        onClick={
                          () => {
                            setModalStatus(true)
                            setModalType('supply')
                            setSelectedToken(item.underlyingAsset)
                          }
                        }
                      >
                        Supply
                      </button>
                      <button
                        className="w-full py-2 bg-secondary font-lufga rounded-xl font-bold"
                        onClick={
                          () => {
                            setModalStatus(true)
                            setModalType('borrow')
                            setSelectedToken(item.underlyingAsset)
                          }
                        }
                      >
                        Borrow
                      </button>
                    </div>
                  </div>
                ))

              }
            </div>
          </div>
          <div className="lg:hidden w-full">
            {
              (getAssets() || []).map((item, key) => (
                <div
                  className="items-center py-[14px] px-2.5 border-b-[1px] border-gray-light hover:bg-[#1F2A29] cursor-pointer"
                  key={key}
                >
                  <Link
                    className="flex flex-col gap-1"
                    to={`${item.underlyingAsset}`}
                  >
                    <div className="flex items-center gap-2 col-span-2 h-full">
                      <img src={item.icon} alt="symbol" className="w-6 h-6" />
                      <p className=' text-white font-lufga'>{item.symbol}</p>
                    </div>
                    <div className='flex gap-2 items-center justify-between border-b-[1px] border-gray'>
                      <p className='text-white font-lufga text-sm md:text-base '>Total Supplied</p>
                      <div className='flex flex-col gap-1 items-end'>
                        <p className="text-white font-lufga text-sm md:text-base">
                          {formatUnit(item.totalSupplied)}
                        </p>
                        <p className="text-white font-lufga text-sm md:text-base">
                          ${formatUnit(item.totalSuppliedUsd)}
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-2 items-center justify-between border-b-[1px] border-gray'>
                      <p className='text-white font-lufga text-sm md:text-base'>Supply APY</p>
                      <p className="text-white font-lufga text-sm md:text-base">{formatUnit(item.supplyApy)}</p>
                    </div>
                    <div className='flex gap-2 items-center justify-between border-b-[1px] border-gray'>
                      <p className='text-white font-lufga text-sm md:text-base'>Total Borrowed</p>
                      <div className='flex flex-col gap-1 items-end'>
                        <p className="text-white font-lufga text-sm md:text-base">
                          {formatUnit(item.totalBorrowed)}
                        </p>
                        <p className="text-white font-lufga text-sm md:text-base">
                          ${formatUnit(item.totalBorrowedUsd)}
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-2 items-center justify-between border-b-[1px] border-gray'>
                      <p className='text-white font-lufga text-sm md:text-base'>Borrow APY</p>
                      <p className="text-white font-lufga text-sm md:text-base">{formatUnit(item.borrowApy)}</p>
                    </div>
                    <div className='flex gap-2 items-center justify-between border-b-[1px] border-gray'>
                      <p className='text-white font-lufga text-sm md:text-base'>Available Liquidity</p>
                      <div className='flex flex-col gap-1 items-end'>
                        <p className="text-white font-lufga text-sm md:text-base">
                          {formatUnit(item.totalLiquidityToken)}
                        </p>
                        <p className="text-white font-lufga text-sm md:text-base">
                          ${formatUnit(item.totalLiquidtyUsd)}
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-4 items-center justify-between'>
                      <div className='flex justify-between items-center w-full'>
                        <p className='text-white font-lufga text-sm md:text-base'>Collateral</p>
                        <div className="text-white font-lufga">{
                          item.isCollateral ? <div className="text-success">✓</div> : "─"
                        }</div>
                      </div>
                      <div className='flex justify-between items-center w-full'>
                        <p className='text-white font-lufga text-sm md:text-base'>LTV</p>
                        <p className="text-white font-lufga text-sm md:text-base">{formatNumber(item.ltv, 2)}%</p>
                      </div>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-4 col-span-2">
                    <button
                      className="w-full py-2 bg-secondary font-lufga rounded-xl font-bold hover:"
                      onClick={
                        () => {
                          setModalStatus(true)
                          setModalType('supply')
                          setSelectedToken(item.underlyingAsset)
                        }
                      }
                    >
                      Supply
                    </button>
                    <button
                      className="w-full py-2 bg-secondary font-lufga rounded-xl font-bold"
                      onClick={
                        () => {
                          setModalStatus(true)
                          setModalType('borrow')
                          setSelectedToken(item.underlyingAsset)
                        }
                      }
                    >
                      Borrow
                    </button>
                  </div>
                </div>
              ))
            }
          </div >
        </CardItem >
      </div >
      {
        modalStatus &&
        <Modal
          token={selectedToken || ""}
          modalType={modalType}
          onClose={closeModal} />
      }
    </>
  );
}

export default Overview;
