import CardItem from '../components/common/CardItem';
import SetionTitle from '../components/common/SetionTitle';
import { formatNumber } from '../utils/functions';
import { supplied, borrowed, status, position } from '../utils/mock';
import graphMockImage from '../assets/img/graph-mock.svg';
import Navbar from '../layouts/Navbar';
import ethIcon from '../assets/icons/eth-icon.svg';
import PositionBar from '../components/dashboard/PositionBar';

function Dashboard() {
  return (
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
                    available={position.collateral.available} total={position.collateral.total} />
                </div>
                <div className='h-20'>
                  <span className='text-white mb-2'>Borrow</span>
                  <PositionBar
                    available={position.borrow.available} total={position.borrow.total}/>
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
                {formatNumber(status.currentBalance, 2)}
              </p>
              <p className="text-success text-sm font-lufga">
                {`${status.currentPrice >= 0 ? '+' : '-'}`}
                $
                {formatNumber(Math.abs(status.currentPrice), 2)}
                {' '}
                (
                {`${status.pricePercent >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(status.pricePercent), 2)}
                %)
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <SetionTitle
                title="Total Points"
              />
              <p className="text-white text-[28px] font-medium font-lufga">
                $
                {formatNumber(status.totalPoints, 2)}
              </p>
              <p className="text-success text-sm font-lufga">
                {`${status.currentPoints >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(status.currentPoints), 2)}
                {' '}
                (
                {`${status.pointsPercent >= 0 ? '+' : '-'}`}
                {formatNumber(Math.abs(status.pointsPercent), 2)}
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
                    (supplied || []).map((item, index) => (
                      <div className=" grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325]"
                        key={index}
                      >
                        <div className="text-white font-lufga flex justify-center"><img src={ethIcon} alt="" />ETH</div>
                        <div className="text-white font-lufga">{formatNumber(item.balance, 3)}</div>
                        <div className="text-white font-lufga">${formatNumber(item.value, 2)}</div>
                        <div className="text-success font-lufga">
                          {formatNumber(item.arp, 2)}
                          %
                        </div>
                        <div className="text-success font-lufga">
                          {/* {`${item.feesEarned >= 0 ? '+' : '-'}`}
                        $
                        {formatNumber(Math.abs(item.feesEarned), 4)} */}
                        </div>
                        <div className="text-success font-lufga">Supply</div>
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
                    (borrowed || []).map((item, index) => (
                      <div className=" grid grid-cols-6 py-[14px] px-2.5 border-b-[1px] border-[#212325]"
                        key={index}
                      >
                        <div className="text-white font-lufga flex justify-center"><img src={ethIcon} alt="" />ETH</div>
                        <div className="text-white font-lufga">{formatNumber(item.balance, 3)}</div>
                        <div className="text-white font-lufga">${formatNumber(item.value, 2)}</div>
                        <div className="text-success font-lufga">
                          {formatNumber(item.arp, 2)}
                          %
                        </div>
                        <div className="text-success font-lufga">{item.pool}</div>
                        <div className="text-success font-lufga">Repay</div>
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
  );
}

export default Dashboard;
