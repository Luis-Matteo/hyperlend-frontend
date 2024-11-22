import { useState, useEffect, useRef } from 'react';
import {
  useSwitchChain,
  useAccount,
  useWriteContract,
  useBlockNumber,
} from 'wagmi';
import ReactGA from 'react-ga4';

import Modal from '../components/common/Modal';
import CardItem from '../components/common/CardItem';
import InfoItem from '../components/common/InfoItem';
import SectionTitle from '../components/common/SectionTitle';

import Navbar from '../layouts/Navbar';
import Factor from '../components/dashboard/Factor';
import MyChart from '../components/dashboard/Chart';
import PositionBar from '../components/dashboard/PositionBar';

import { formatNumber } from '../utils/functions';
import { ModalType } from '../utils/types';

import { getUserPoints } from '../utils/user/points';
import { contracts, abis, networkChainId } from '../utils/config';
import { useUserPositionsData } from '../utils/user/positions';
import { useUserWalletValueUsd } from '../utils/user/wallet';
import { useUserPortfolioHistory } from '../utils/user/history';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from '../provider/ConfirmProvider';

function Dashboard() {
  ReactGA.send({ hitType: 'pageview', page: '/dashboard' });

  const { guided, closeGuide, nextStep } = useConfirm();
  const navigate = useNavigate()
  const { data: hash, writeContractAsync } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const { address, chainId, isConnected } = useAccount();
  const { error: blockNumberError } = useBlockNumber();

  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [modalToken, setModalToken] = useState<string>('');
  const [modalType, setModalType] = useState<ModalType>('supply');
  const closeModal = () => setModalStatus(false);

  if (blockNumberError) {
    console.log(blockNumberError.name);
    alert(
      `RPC node error: ${blockNumberError.message} \n\nPlease try again later!`,
    );
  }

  useEffect(() => {
    if (isConnected && chainId != networkChainId) {
      switchChain({ chainId: networkChainId });
    }
  }, [isConnected, chainId]);

  const {
    supplied,
    borrowed,
    totalBalanceUsd,
    totalSupplyUsd,
    totalBorrowUsd,
    totalBorrowLimit,
    totalBalanceChange,
    totalBalanceChangePercentage,
    netApy,
    healthFactor,
  } = useUserPositionsData(isConnected, address);

  const { totalPoints, pointsIncrease, pointsPercentIncrease } =
    getUserPoints();
  const { walletBalanceValue } = useUserWalletValueUsd();
  const { historicalNetWorth } = useUserPortfolioHistory(address, isConnected);

  const sendToggleCollateralTx = (asset: string, isEnabled: boolean) => {
    writeContractAsync({
      address: contracts.pool,
      abi: abis.pool,
      functionName: 'setUserUseReserveAsCollateral',
      args: [asset, !isEnabled],
    });
    console.log(hash);
  };

  const divRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [divDimensions, setDivDimensions] = useState<
    { width: number; height: number }[]
  >([
    { width: 0, height: 0 },
    { width: 0, height: 0 },
    { width: 0, height: 0 },
    { width: 0, height: 0 },
  ]);

  // Update widths and heights
  const updateDimensions = () => {
    const newDimensions = divRefs.map((ref) => ({
      width: ref.current?.offsetWidth || 0,
      height: ref.current?.offsetHeight || 0,
    }));
    setDivDimensions(newDimensions);
  };

  console.log(divDimensions);
  useEffect(() => {
    // Update the dimensions immediately when the component mounts
    updateDimensions();

    // Add resize event listener to update dimensions during window resizing
    window.addEventListener('resize', updateDimensions);

    // Clean up event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <>
      <div className='flex flex-col'>
        <Navbar pageTitle='Dashboard' />
        <div className='pt-8 flex flex-col gap-4 relative'>
          <div className='flex flex-col md:flex-row gap-4 justify-between'>
            <CardItem
              ref={divRefs[0]}
              className={`px-4 lg:px-8 py-4 h-72 max-w-[480px] w-full overflow-hidden md:mb-0 mx-auto ${guided > 0 && guided !== 1 ? 'lg:blur-[8px]' : ''}`}
            >
              <div className=''>
                <div className='flex gap-2 items-center'>
                  <SectionTitle title='Health Factor' />
                  <InfoItem
                    title={
                      <span>
                        Health factor is a numerical value that represents the
                        ratio of the value of a user's collateral to the value
                        of their borrowed assets. <br />
                        It is designed to give borrowers a clear understanding
                        of the risk associated with their current positions.
                        <br /> HF under 1.2 is generally considered low.
                      </span>
                    }
                    className='w-[340px]'
                  />
                </div>
                <div className='flex mt-12 text-center justify-center items-end'>
                  <Factor healthFactor={healthFactor} />
                </div>
              </div>
            </CardItem>

            <CardItem
              ref={divRefs[1]}
              className={`py-4 lg:py-6 px-4 lg:px-7 md:w-full ${guided > 0 && guided !== 2 ? 'lg:blur-[8px]' : ''}`}
            >
              <SectionTitle
                title='Your Positions'
                className='mb-8 font-lufga'
              />
              <div className='flex flex-col justify-between gap-5 px-5 w-full'>
                <div className='h-20 font-lufga'>
                  <span className='text-white mb-2'>Collateral deposited</span>
                  <PositionBar
                    available={totalSupplyUsd}
                    total={totalSupplyUsd + walletBalanceValue}
                  />
                </div>
                <div className='h-20 font-lufga'>
                  <span className='text-white mb-2'>Borrow</span>
                  <PositionBar
                    available={totalBorrowUsd}
                    total={totalBorrowLimit}
                  />
                </div>
              </div>
            </CardItem>
          </div>
          <CardItem
            ref={divRefs[2]}
            className={`py-4 lg:py-6 px-4 lg:px-7 order-first lg:order-none ${guided > 0 && guided !== 3 ? 'lg:blur-[8px]' : ''}`}
          >
            <div className='flex flex-col lg:flex-row gap-4 xl:gap-12 2xl:gap-24 justify-between items-center'>
              <div className='flex gap-4 justify-between items-center w-full lg:flex-1'>
                <div className='flex flex-col gap-4'>
                  <SectionTitle title='Current Net Worth' />
                  <p className='text-white text-[28px] font-medium font-lufga'>
                    ${formatNumber(totalBalanceUsd, 2)}
                  </p>
                  <p
                    className={
                      totalBalanceChange >= 0
                        ? 'text-success text-sm font-lufga'
                        : 'text-red-500 text-sm font-lufga'
                    }
                  >
                    {`${totalBalanceChange >= 0 ? '+' : '-'}`}$
                    {formatNumber(Math.abs(totalBalanceChange), 2)} (
                    {`${totalBalanceChangePercentage >= 0 ? '+' : '-'}`}
                    {formatNumber(Math.abs(totalBalanceChangePercentage), 2)}
                    %)
                  </p>
                </div>
                <div className='flex flex-col gap-4'>
                  <SectionTitle title='Total APY' />
                  <p className='text-white text-[28px] font-medium font-lufga'>
                    {formatNumber(netApy, 1)}%
                  </p>
                  <p className='text-success text-sm font-lufga'>&nbsp;</p>
                </div>
                <div className='flex flex-col gap-4 blur-xs'>
                  <SectionTitle title='Total Points' />
                  <p className='text-white text-[28px] font-medium font-lufga'>
                    {formatNumber(totalPoints, 2)}
                  </p>
                  <p
                    className={
                      pointsIncrease >= 0
                        ? 'text-success text-sm font-lufga'
                        : 'text-red-500 text-sm font-lufga'
                    }
                  >
                    {`${pointsIncrease >= 0 ? '+' : '-'}`}
                    {formatNumber(Math.abs(pointsIncrease), 2)} (
                    {`${pointsPercentIncrease >= 0 ? '+' : '-'}`}
                    {formatNumber(Math.abs(pointsPercentIncrease), 2)}
                    %)
                  </p>
                </div>
              </div>
              <div className='w-full lg:w-[400px] xl:w-[500px] 2xl:w-1/2 h-[150px]'>
                <MyChart data={historicalNetWorth} />
              </div>
            </div>
          </CardItem>
          <div
            ref={divRefs[3]}
            className={`lg:flex gap-5 justify-between ${guided > 0 && guided !== 4 ? 'lg:blur-[8px]' : ''}`}
          >
            <CardItem className='py-4 lg:py-6 px-2 md:px-4 xl:px-7 flex-1 mb-4 lg:mb-0'>
              <div className='max-h-[250px]'>
                <p className='text-white font-lufga text-2xl pb-4'>Supplied</p>
                <div className='text-center'>
                  <div className='py-3 px-2 grid grid-cols-6 border-y-[1px] bg-grey border-[#212325]'>
                    <div className='text-white font-lufga text-[11px]'>
                      Assets
                    </div>
                    <div className='text-white font-lufga text-[11px]'>
                      Balance
                    </div>
                    <div className='text-white font-lufga text-[11px]'>
                      Value
                    </div>
                    <div className='text-white font-lufga text-[11px]'>APR</div>
                    <div className='text-white font-lufga text-[11px]'>
                      Collateral
                    </div>
                    <div className='text-white font-lufga text-[11px]'></div>
                  </div>
                  <div className='overflow-auto max-h-[200px]'>
                    {(supplied || []).map((item: any, index: any) => (
                      <button
                        className='w-full grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325] items-center hover:bg-[#1F2A29]'
                        key={index}
                        onClick={() => navigate(`/markets/${item.underlyingAsset}`)}

                      >
                        <div className='text-white font-lufga flex gap-2 justify-center'>
                          <img
                            className='w-4 sm:w-6 lg:w-4 xl:w-6'
                            src={item.icon}
                            alt=''
                          />
                          <p className='text-xs sm:text-base lg:text-xs xl:text-base'>
                            {item.assetName}
                          </p>
                        </div>
                        <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                          {formatNumber(item.balance, 3)}
                        </div>
                        <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                          ${formatNumber(item.value, 2)}
                        </div>
                        <div className='text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                          {formatNumber(item.apr, 2)}%
                        </div>
                        <div
                          className={`text-xs sm:text-base lg:text-xs xl:text-base ${item.isCollateralEnabled ? 'text-success font-lufga' : 'text-secondary font-lufga'}`}
                        >
                          <button
                            onClick={() => {
                              sendToggleCollateralTx(
                                item.underlyingAsset,
                                item.isCollateralEnabled,
                              );
                            }}
                          >
                            {item.isCollateralEnabled ? '✓' : '─'}
                          </button>
                        </div>
                        <button
                          className='w-full py-2 bg-secondary font-lufga rounded-xl font-bold'
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalStatus(true);
                            setModalToken(item.underlyingAsset);
                            setModalType('supply');
                          }}
                        >
                          Supply
                        </button>
                      </button>
                      // </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardItem>
            <CardItem className='py-4 lg:py-6 px-2 md:px-4 xl:px-7 flex-1'>
              <div className='max-h-[250px]'>
                <p className='text-white font-lufga text-2xl pb-4'>Borrowed</p>
                <div className='text-center'>
                  <div className='py-3 px-2 grid grid-cols-6 border-y-[1px] bg-grey border-[#212325] items-center'>
                    <div className='text-white font-lufga text-[11px]'>
                      Assets
                    </div>
                    <div className='text-white font-lufga text-[11px]'>
                      Balance
                    </div>
                    <div className='text-white font-lufga text-[11px]'>
                      Value
                    </div>
                    <div className='text-white font-lufga text-[11px]'>APR</div>
                    <div className='text-white font-lufga text-[11px]'>
                      Pool
                    </div>
                    <div className='text-white font-lufga text-[11px]'></div>
                  </div>
                  <div className='overflow-auto max-h-[200px]'>
                    {(borrowed || []).map((item: any, index: any) => (
                      <button
                        className='w-full grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325] items-center hover:bg-[#1F2A29]'
                        key={index}
                        onClick={() => navigate(`/markets/${item.underlyingAsset}`)}
                      >
                        <div className='text-white font-lufga flex gap-2 justify-center'>
                          <img
                            className='w-4 sm:w-6 lg:w-4 xl:w-6'
                            src={item.icon}
                            alt=''
                          />
                          <p className='text-xs sm:text-base lg:text-xs xl:text-base'>
                            {item.assetName}
                          </p>
                        </div>
                        <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                          {formatNumber(item.balance, 3)}
                        </div>
                        <div className='text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                          ${formatNumber(item.value, 2)}
                        </div>
                        <div className='text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                          {formatNumber(item.apr, 2)}%
                        </div>
                        <div className='text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base'>
                          {item.pool || 'Core'}
                        </div>
                        <div>
                          <button
                            className='w-full py-2 bg-secondary font-lufga rounded-xl font-bold'
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalStatus(true);
                              setModalToken(item.underlyingAsset);
                              setModalType('repay');
                            }}
                          >
                            Repay
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardItem>
          </div>
          {guided === 1 && (
            <div
              className='hidden lg:block absolute -translate-x-1/2'
              style={{
                top: divDimensions[0].height + 32,
                left: divDimensions[0].width / 2,
              }}
            >
              <div className='flex flex-col items-center relative z-10 -top-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='w-0.5 h-12 bg-secondary'></div>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
              </div>
              <div className='bg-primary px-4 py-3 inline-block relative -top-4 rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Check Your Health Factor
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  Keep this high to reduce liquidation risk.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary text-opacity-30 font-lufga'
                  >
                    Skip All
                  </button>
                  <button
                    onClick={nextStep}
                    className='text-secondary text-opacity-50 font-lufga'
                  >
                    Next ({guided}/4)
                  </button>
                </div>
              </div>
            </div>
          )}
          {guided === 2 && (
            <div
              className='hidden lg:flex justify-end absolute '
              style={{
                right: divDimensions[1].width - 16,
              }}
            >
              <div className='bg-primary max-w-[260px] px-4 py-3 block relative -top-4 rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Deposit Collateral
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  The assets you've provided as collateral to secure your loans
                  on the platform.
                </p>
                <p className='font-lufga text-[13px] text-secondary mt-3'>
                  Borrow
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  The assets you've borrowed using your deposited collateral.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary text-opacity-30 font-lufga'
                  >
                    Skip All
                  </button>
                  <button
                    onClick={nextStep}
                    className='text-secondary text-opacity-50 font-lufga'
                  >
                    Next ({guided}/4)
                  </button>
                </div>
              </div>
              <div className='flex items-center relative z-10 mt-24 -top-2 -left-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='h-0.5 w-12 bg-secondary'></div>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
              </div>
            </div>
          )}
          {guided === 3 && (
            <div
              className='hidden lg:block absolute max-w-[260px] -translate-x-1/2'
              style={{
                top: divDimensions[0].height - 128,
                left: divDimensions[2].width / 3,
              }}
            >
              <div className='bg-primary max-w-[260px] px-4 py-3 block rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Monitor Your Net Worth
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  Track your balance and APY changes over time.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary text-opacity-30 font-lufga'
                  >
                    Skip All
                  </button>
                  <button
                    onClick={nextStep}
                    className='text-secondary text-opacity-50 font-lufga'
                  >
                    Next ({guided}/4)
                  </button>
                </div>
              </div>
              <div className='flex flex-col items-center relative z-10 -top-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='w-0.5 h-12 bg-secondary'></div>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
              </div>
            </div>
          )}
          {guided === 4 && (
            <div
              className='hidden lg:block absolute max-w-[260px] -translate-x-1/2'
              style={{
                top: divDimensions[0].height + divDimensions[1].height - 212,
                left: divDimensions[2].width / 2,
              }}
            >
              <div className='bg-primary max-w-[260px] px-4 py-3 block rounded-md text-left'>
                <p className='font-lufga text-[13px] text-secondary'>
                  Monitor Your Net Worth
                </p>
                <p className='font-lufga text-[11px] text-secondary'>
                  Track your balance and APY changes over time.
                </p>
                <div className='flex justify-center gap-12 mt-3'>
                  <button
                    onClick={closeGuide}
                    className='text-secondary font-lufga'
                  >
                    Complete
                  </button>
                </div>
              </div>
              <div className='flex flex-col items-center relative z-10 -top-2'>
                <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                <div className='w-0.5 h-6 bg-secondary' />
                <div className='w-60 h-0.5 bg-secondary' />
                <div className='flex justify-between w-full'>
                  <div className='flex flex-col items-center'>
                    <div className='w-0.5 h-8 bg-secondary' />
                    <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary'></div>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div className='w-0.5 h-8 bg-secondary' />
                    <div className='w-4 h-4 rounded-full bg-transparent border-2 border-secondary' />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {modalStatus && (
        <Modal token={modalToken} modalType={modalType} onClose={closeModal} />
      )}
    </>
  );
}

export default Dashboard;
