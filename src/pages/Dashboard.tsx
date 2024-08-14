import { useState, useEffect } from 'react';
import CardItem from '../components/common/CardItem';
import SectionTitle from '../components/common/SectionTitle';
import { formatNumber } from '../utils/functions';
import Navbar from '../layouts/Navbar';
import PositionBar from '../components/dashboard/PositionBar';
import Modal from '../components/common/Modal';
import { useSwitchChain, useAccount, useWriteContract } from 'wagmi'

import { ModalType } from '../utils/types';

import { contracts, abis } from '../utils/tokens';
import { useUserPositionsData, useUserWalletBalance, useUserPortfolioHistory } from '../utils/userState';
import { getUserPoints } from '../utils/userPoints';
import MyChart from '../components/dashboard/Chart';
import Gauge from '../components/dashboard/Gauge';

function Dashboard() {
  const { data: hash, writeContractAsync } = useWriteContract()
  const { switchChain } = useSwitchChain()
  const { address, chainId, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && chainId != 42161) {
      switchChain({ chainId: 42161 });
    }
  }, [isConnected, chainId])

  const {
    supplied, borrowed,
    totalBalanceUsd, totalSupplyUsd, totalBorrowUsd,
    totalBorrowLimit, totalBalanceChange, totalBalanceChangePercentage, netApy
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
          <div className="md:flex gap-4 justify-between">
            <CardItem
              className="py-4 px-5 md:w-2/5 mb-4 md:mb-0"
            >
              <div className="">
                <SectionTitle
                  title="Health Factor"
                />
                <div className='flex text-center justify-center items-center'>
                  <Gauge value={1.2} maxValue={10} size={300} strokeWidth={15} />
                </div>
              </div>
            </CardItem>
            <CardItem
              className="py-4 px-5 md:w-3/5"
            >
              <div className="">
                <SectionTitle
                  title="Your Positions"
                />
                <div className='flex flex-col gap-5 w-[90%] m-auto'>
                  <div className='h-20'>
                    <span className='text-white mb-2'>Collateral</span>
                    <PositionBar
                      available={totalSupplyUsd} total={totalSupplyUsd + walletBalanceValue} />
                  </div>
                  <div className='h-20'>
                    <span className='text-white mb-2'>Borrow</span>
                    <PositionBar
                      available={totalBorrowUsd} total={totalBorrowLimit} />
                  </div>
                </div>
              </div>
            </CardItem>
          </div>
          <CardItem
            className="py-6 px-7"
          >

            <div className="flex gap-4 justify-between items-center">
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
              <div className=''>
                <MyChart data={historicalNetWorth} />
              </div>
            </div>
          </CardItem>
          <div className='lg:flex gap-5 justify-between '>
            <CardItem
              className="py-6 px-7 flex-1 mb-4 lg:mb-0"
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
                  <div className='overflow-auto max-h-[170px]'>
                    {
                      (supplied || []).map((item: any, index: any) => (
                        <div className=" grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325]"
                          key={index}
                        >
                          <div className="text-white font-lufga flex justify-center"><img src={item.icon} alt="" /> &nbsp; {item.assetName}</div>
                          <div className="text-white font-lufga">{formatNumber(item.balance, 3)}</div>
                          <div className="text-white font-lufga">${formatNumber(item.value, 2)}</div>
                          <div className="text-success font-lufga">
                            {formatNumber(item.apr, 2)}
                            %
                          </div>
                          <div className={item.isCollateralEnabled ? "text-success font-lufga" : "text-secondary font-lufga"}>
                            <button onClick={
                              () => {
                                sendToggleCollateralTx(item.underlyingAsset, item.isCollateralEnabled)
                              }
                            }>
                              {item.isCollateralEnabled ? "✓" : "─"}
                            </button>
                          </div>
                          <button className="text-success font-lufga"
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
            <CardItem className='py-6 px-7 flex-1'>
              <div className="max-h-[250px]">
                <p className="text-white font-lufga text-2xl pb-4">Borrowed</p>
                <div className="text-center">
                  <div className="py-3 px-2 grid grid-cols-6 border-y-[1px] bg-grey border-[#212325]">
                    <div className="text-white font-lufga text-[11px]">Assets</div>
                    <div className="text-white font-lufga text-[11px]">Balance</div>
                    <div className="text-white font-lufga text-[11px]">Value</div>
                    <div className="text-white font-lufga text-[11px]">APR</div>
                    <div className="text-white font-lufga text-[11px]">Pool</div>
                    <div className="text-white font-lufga text-[11px]"></div>
                  </div>
                  <div className='overflow-auto max-h-[170px]'>
                    {
                      (borrowed || []).map((item: any, index: any) => (
                        <div className=" grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325]"
                          key={index}
                        >
                          <div className="text-white font-lufga flex justify-center"><img src={item.icon} alt="" /> &nbsp; {item.assetName}</div>
                          <div className="text-white font-lufga">{formatNumber(item.balance, 3)}</div>
                          <div className="text-white font-lufga">${formatNumber(item.value, 2)}</div>
                          <div className="text-success font-lufga">
                            {formatNumber(item.apr, 2)}
                            %
                          </div>
                          <div className="text-success font-lufga">{item.pool || "Core"}</div>
                          <div>
                            <button className="text-success font-lufga"
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
