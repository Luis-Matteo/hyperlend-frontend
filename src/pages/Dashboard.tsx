import CardItem from '../components/common/CardItem';
import SetionTitle from '../components/common/SetionTitle';
import { formatNumber } from '../utils/functions';
import graphMockImage from '../assets/img/graph-mock.svg';
import Navbar from '../layouts/Navbar';
import PositionBar from '../components/dashboard/PositionBar';
import { useState } from 'react';
import Modal from '../components/lend-borrow/Modal';

import { getUserReserves, getUserWalletBalance } from '../utils/userState';
import { getUserPoints } from '../utils/userPoints';

function Dashboard() {
  const { 
    supplied, borrowed, totalBalance, totalSupply, totalBorrow, totalBorrowLimit, totalBalanceChange, totalBalanceChangePercentage 
  } = getUserReserves()
  const { totalPoints, currentPoints, pointsPercent } = getUserPoints()

  const { walletBalanceValue } = getUserWalletBalance()

  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [modalToken, setModalToken] = useState<string>("")
  const [modalSide, setModalSide] = useState<boolean>(true)
  const closeModal = () => setModalStatus(false);

  return (
    <>
    <div className="flex flex-col">
      <Navbar
        pageTitle="Dashboard"
      />
      <div className="pt-12 flex flex-col gap-4">
        <div className="flex gap-4 justify-between">
          <CardItem
            className="py-4 px-5 w-2/5"
          >
            <div className="">
              <SetionTitle
                title="Health Factor"
              />
            </div>
          </CardItem>
          <CardItem
            className="py-4 px-5 w-3/5"
          >
            <div className="">
              <SetionTitle
                title="Your Position"
              />
              <div className='flex flex-col gap-5 w-[90%] m-auto'>
                <div className='h-20'>
                  <span className='text-white mb-2'>Collateral deposited</span>
                  <PositionBar
                    available={totalSupply} total={totalSupply + walletBalanceValue} />
                </div>
                <div className='h-20'>
                  <span className='text-white mb-2'>Borrow</span>
                  <PositionBar
                    available={totalBorrow} total={totalBorrowLimit}/>
                </div>
              </div>
            </div>

          </CardItem>
        </div>
        <CardItem
          className="py-6 px-7"
        >

          <div className="flex gap-32 justify-between">
            <div className="flex flex-col gap-4">
              <SetionTitle
                title="Current Balance"
              />
              <p className="text-white text-[28px] font-medium font-lufga">
                $
                {formatNumber(totalBalance, 2)}
              </p>
              <p className="text-success text-sm font-lufga">
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
              <SetionTitle
                title="Total Points"
              />
              <p className="text-white text-[28px] font-medium font-lufga">
                {formatNumber(totalPoints, 2)}
              </p>
              <p className="text-success text-sm font-lufga">
                {`${currentPoints >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(currentPoints), 2)}
                {' '}
                (
                {`${pointsPercent >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(pointsPercent), 2)}
                %)
              </p>
            </div>
            <div className="">
              <img src={graphMockImage} alt="" />
            </div>
          </div>
        </CardItem>
        <div className='flex gap-5 justify-between'>
          <CardItem
            className="py-6 px-7 flex-1"
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
                          { item.isCollateralEnabled ? "✓" : "─"}
                        </div>
                        <button className="text-success font-lufga"
                        onClick={
                          () => {
                            setModalStatus(true)
                            setModalToken(item.underlyingAsset)
                            setModalSide(true)
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
                              setModalSide(false)
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
        isSupply={modalSide}
        onClose={closeModal}
      />
    }
    </>
  );
}

export default Dashboard;
