import { earningsIcon } from '../../assets';
import HeroSideCard from './HeroSideCard';
import { Link } from 'react-router-dom';
import HeroSideCardMobile from './HeroSideCardMobile';
import { UserPositionsData } from '../../utils/types';
import { formatNumber, formatUnit } from '../../utils/functions';

interface IHeroSidebar {
  userPositionsData: UserPositionsData;
}

const HeroSidebar = ({ userPositionsData }: IHeroSidebar) => (
  <div className='h-[100%] sm:w-[100%]  lg:w-auto flex flex-col justify-end px-4 py-9 gap-3  rounded-2xl border border-1 border-[#CAEAE54D] bg-[#071311]'>
    <div className='flex justify-between items-center'>
      <span className='text-[#E1E1E1] text-xs font-lufga font-light italic'>
        Your Position
      </span>
      <Link to='/daily-earnings'>
        <div className='flex flex-row justify-center align-bottom items-start gap-2 p-1'>
          <span className='text-[#E1E1E1] text-xs font-lufga font-light underline'>
            Daily Earnings
          </span>
          <img src={earningsIcon} alt='' />
        </div>
      </Link>
    </div>
    <div className=' md:hidden lg:hidden xl:flex flex-col gap-2 hidden'>
      <HeroSideCard
        title='Total Deposited'
        infoItem='shows the total amount deposited,the total increase in deposits and the percentage increase'
        amount={`$${formatNumber(userPositionsData.totalSupplyUsd, 2)}`}
        amountIncreased={`$${formatUnit(userPositionsData.supplyInterestDaily, 3)}/day`}
      />
      <HeroSideCard
        title='Total Borrowed'
        infoItem='shows the total amount borrowed,the total increase in deposits and the percentage increase'
        amount={`$${formatNumber(userPositionsData.totalBorrowUsd, 2)}`}
        amountIncreased={`-$${formatUnit(userPositionsData.borrowInterestDaily, 3)}/day`}
      />
    </div>
    <div className='lg:flex xl:hidden'>
      <HeroSideCardMobile
        title='Total Deposited'
        infoItem='shows the total amount deposited, the total increase in deposits and the percentage increase'
        amount={`$${formatNumber(userPositionsData.totalSupplyUsd, 2)}`}
        amountIncreased={`$${formatUnit(userPositionsData.supplyInterestDaily, 3)}/day`}
        titleOne='Total Borrowed'
        infoItemOne='shows the total amount borrowed,the total increase in deposits and the percentage increase'
        amountOne={`$${formatNumber(userPositionsData.totalBorrowUsd, 2)}`}
        amountIncreasedOne={`-$${formatUnit(userPositionsData.borrowInterestDaily, 3)}/day`}
      />
    </div>
  </div>
);

export default HeroSidebar;
