import { useState, useEffect } from 'react';
import CardItem from '../components/common/CardItem';
import SectionTitle from '../components/common/SectionTitle';
import { formatNumber } from '../utils/functions';
import Navbar from '../layouts/Navbar';
import PositionBar from '../components/dashboard/PositionBar';
import Modal from '../components/common/Modal';
import { useSwitchChain, useAccount, useWriteContract, useBlockNumber } from 'wagmi'
import ReactGA from 'react-ga4';

import { ModalType } from '../utils/types';

import { contracts, abis, networkChainId } from '../utils/tokens';
import { useUserPositionsData, useUserWalletBalance, useUserPortfolioHistory } from '../utils/userState';
import { getUserPoints } from '../utils/userPoints';
import MyChart from '../components/dashboard/Chart';
import Factor from '../components/dashboard/Factor';
import InfoItem from '../components/common/InfoItem';

function Dashboard() {
  ReactGA.send({ hitType: "pageview", page: "/dashboard" });

  const { data: hash, writeContractAsync } = useWriteContract()
  const { switchChain } = useSwitchChain()
  const { address, chainId, isConnected } = useAccount()
  const { data: blockNumber, error: blockNumberError} = useBlockNumber()

  if (blockNumberError){
    console.log(blockNumberError.name)
    alert(`RPC node error: ${blockNumberError.message} \n\nPlease try again later!`)
  }

  useEffect(() => {
    if (isConnected && chainId != networkChainId) {
      switchChain({ chainId: networkChainId });
    }
  }, [isConnected, chainId])

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
    healthFactor
  } = useUserPositionsData(isConnected, address)

  const { totalPoints, pointsIncrease, pointsPercentIncrease } = getUserPoints()
  const { walletBalanceValue } = useUserWalletBalance()
  const { historicalNetWorth } = useUserPortfolioHistory(address, isConnected)

  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [modalToken, setModalToken] = useState<string>("")
  const [modalType, setModalType] = useState<ModalType>('supply')
  const closeModal = () => setModalStatus(false);

  const sendToggleCollateralTx = (asset: string, isEnabled: boolean) => {
    writeContractAsync({
      address: contracts.pool,
      abi: abis.pool,
      functionName: "setUserUseReserveAsCollateral",
      args: [asset, !isEnabled]
    })
    console.log(hash)
  }

  return (
    <>
      <div className="flex flex-col">
        <Navbar
          pageTitle="Dashboard"
        />
        <div className="pt-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <CardItem
              className="px-4 lg:px-8 py-4 h-72 max-w-[480px] w-full overflow-hidden md:mb-0 mx-auto"
            >
              <div className="">
                <div className='flex gap-2 items-center'>
                  <SectionTitle
                    title="Health Factor"
                  />
                  <InfoItem
                    title={
                      <span>Health factor is a numerical value that represents the ratio of the value of a user's collateral to the value of their borrowed assets. <br />It is designed to give borrowers a clear understanding of the risk associated with their current positions.<br /> HF under 1.2 is generally considered low.</span>
                    }
                    className='w-[340px]' />

                </div>
                <div className='flex mt-12 text-center justify-center items-end'>
                  <Factor healthFactor={healthFactor} />
                </div>
              </div>
            </CardItem>
            <CardItem
              className="py-4 lg:py-6 px-4 lg:px-7 md:w-full"
            >
              <SectionTitle
                title="Your Positions"
                className='mb-8'
              />
              <div className='flex flex-col justify-between gap-5 px-5 w-full'>
                <div className='h-20'>
                  <span className='text-white mb-2'>Collateral deposited</span>
                  <PositionBar
                    available={totalSupplyUsd} total={totalSupplyUsd + walletBalanceValue} />
                </div>
                <div className='h-20'>
                  <span className='text-white mb-2'>Borrow</span>
                  <PositionBar
                    available={totalBorrowUsd} total={totalBorrowLimit} />
                </div>
              </div>
            </CardItem>
          </div>
          <CardItem
            className="py-4 lg:py-6 px-4 lg:px-7"
          >
            <div className="flex flex-col lg:flex-row gap-4 xl:gap-12 2xl:gap-24 justify-between items-center">
              <div className='flex gap-4 justify-between items-center w-full lg:flex-1'>
                <div className="flex flex-col gap-4">
                  <SectionTitle
                    title="Current Net Worth"
                  />
                  <p className="text-white text-[28px] font-medium font-lufga">
                    $
                    {formatNumber(totalBalanceUsd, 2)}
                  </p>
                  <p className={totalBalanceChange >= 0 ? "text-success text-sm font-lufga" : "text-red-500 text-sm font-lufga"}>
                    {`${totalBalanceChange >= 0 ? '+' : '-'}`}
                    $
                    {formatNumber(Math.abs(totalBalanceChange), 2)}
                    {' '}
                    (
                    {`${totalBalanceChangePercentage >= 0 ? '+' : '-'}`}
                    {formatNumber(Math.abs(totalBalanceChangePercentage), 2)}
                    %)
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <SectionTitle
                    title="Total APY"
                  />
                  <p className="text-white text-[28px] font-medium font-lufga">
                    {formatNumber(netApy, 1)}%
                  </p>
                  <p className="text-success text-sm font-lufga">
                    &nbsp;
                  </p>
                </div>
                <div className="flex flex-col gap-4 blur-xs">
                  <SectionTitle
                    title="Total Points"
                  />
                  <p className="text-white text-[28px] font-medium font-lufga">
                    {formatNumber(totalPoints, 2)}
                  </p>
                  <p className={pointsIncrease >= 0 ? "text-success text-sm font-lufga" : "text-red-500 text-sm font-lufga"}>
                    {`${pointsIncrease >= 0 ? '+' : '-'}`}
                    {formatNumber(Math.abs(pointsIncrease), 2)}
                    {' '}
                    (
                    {`${pointsPercentIncrease >= 0 ? '+' : '-'}`}
                    {formatNumber(Math.abs(pointsPercentIncrease), 2)}
                    %)
                  </p>
                </div>
              </div>
              <div className='w-full lg:w-[400px] xl:w-[500px] 2xl:w-[800px] h-[150px]'>
                <MyChart
                  data={historicalNetWorth} />
              </div>
            </div>
          </CardItem>
          <div className='lg:flex gap-5 justify-between '>
            <CardItem
              className="py-4 lg:py-6 px-2 md:px-4 xl:px-7 flex-1 mb-4 lg:mb-0"
            >
              <div className="max-h-[250px]">
                <p className="text-white font-lufga text-2xl pb-4">Supplied</p>
                <div className="text-center">
                  <div className="py-3 px-2 grid grid-cols-6 border-y-[1px] bg-grey border-[#212325]">
                    <div className="text-white font-lufga text-[11px]">Assets</div>
                    <div className="text-white font-lufga text-[11px]">Balance</div>
                    <div className="text-white font-lufga text-[11px]">Value</div>
                    <div className="text-white font-lufga text-[11px]">APR</div>
                    <div className="text-white font-lufga text-[11px]">Collateral</div>
                    <div className="text-white font-lufga text-[11px]"></div>
                  </div>
                  <div className='overflow-auto max-h-[200px]'>
                    {
                      (supplied || []).map((item: any, index: any) => (
                        <div className=" grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325] items-center"
                          key={index}
                        >
                          <div className="text-white font-lufga flex gap-2 justify-center">
                            <img className="w-4 sm:w-6 lg:w-4 xl:w-6" src={item.icon} alt="" />
                            <p className='text-xs sm:text-base lg:text-xs xl:text-base'>{item.assetName}</p>
                          </div>
                          <div className="text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base">{formatNumber(item.balance, 3)}</div>
                          <div className="text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base">${formatNumber(item.value, 2)}</div>
                          <div className="text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base">
                            {formatNumber(item.apr, 2)}
                            %
                          </div>
                          <div className={`text-xs sm:text-base lg:text-xs xl:text-base ${item.isCollateralEnabled ? "text-success font-lufga" : "text-secondary font-lufga"}`}>
                            <button onClick={
                              () => {
                                sendToggleCollateralTx(item.underlyingAsset, item.isCollateralEnabled)
                              }
                            }>
                              {item.isCollateralEnabled ? "✓" : "─"}
                            </button>
                          </div>
                          <button className="text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base"
                            onClick={
                              () => {
                                setModalStatus(true)
                                setModalToken(item.underlyingAsset)
                                setModalType('supply')
                              }
                            }>
                            Supply
                          </button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardItem>
            <CardItem className='py-4 lg:py-6 px-2 md:px-4 xl:px-7 flex-1'>
              <div className="max-h-[250px]">
                <p className="text-white font-lufga text-2xl pb-4">Borrowed</p>
                <div className="text-center">
                  <div className="py-3 px-2 grid grid-cols-6 border-y-[1px] bg-grey border-[#212325] items-center">
                    <div className="text-white font-lufga text-[11px]">Assets</div>
                    <div className="text-white font-lufga text-[11px]">Balance</div>
                    <div className="text-white font-lufga text-[11px]">Value</div>
                    <div className="text-white font-lufga text-[11px]">APR</div>
                    <div className="text-white font-lufga text-[11px]">Pool</div>
                    <div className="text-white font-lufga text-[11px]"></div>
                  </div>
                  <div className='overflow-auto max-h-[200px]'>
                    {
                      (borrowed || []).map((item: any, index: any) => (
                        <div className=" grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325] items-center"
                          key={index}
                        >
                          <div className="text-white font-lufga flex gap-2 justify-center">
                            <img className="w-4 sm:w-6 lg:w-4 xl:w-6" src={item.icon} alt="" />
                            <p className='text-xs sm:text-base lg:text-xs xl:text-base'>{item.assetName}</p>
                          </div>
                          <div className="text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base">{formatNumber(item.balance, 3)}</div>
                          <div className="text-white font-lufga text-xs sm:text-base lg:text-xs xl:text-base">${formatNumber(item.value, 2)}</div>
                          <div className="text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base">
                            {formatNumber(item.apr, 2)}
                            %
                          </div>
                          <div className="text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base">{item.pool || "Core"}</div>
                          <div>
                            <button className="text-success font-lufga text-xs sm:text-base lg:text-xs xl:text-base"
                              onClick={
                                () => {
                                  setModalStatus(true)
                                  setModalToken(item.underlyingAsset)
                                  setModalType("repay")
                                }
                              }>
                              Repay
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardItem>
          </div>
        </div>
      </div>
      {
        modalStatus &&
        <Modal
          token={modalToken}
          modalType={modalType}
          onClose={closeModal}
        />
      }
    </>
  );
}

export default Dashboard;
