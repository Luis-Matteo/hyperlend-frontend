import { earningsIcon } from '../../assets';
import HeroSideCard from './HeroSideCard';
import { Link } from 'react-router-dom';
import HeroSideCardMobile from './HeroSideCardMobile';

const HeroSidebar = () => (
  <div className='h-[100%] sm:w-[100%]  lg:w-auto flex flex-col justify-end px-4 py-9 gap-3  rounded-md border border-1 border-[#CAEAE54D] bg-[#071311]'>
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
        amount='$1,753,050'
        amountIncreased='+$33,132'
        percentageIncreased='+1.89%'
      />
      <HeroSideCard
        title='Total Borrowed'
        infoItem='shows the total amount borrowed,the total increase in deposits and the percentage increase'
        amount='$153,370'
        amountIncreased='+$1,855'
        percentageIncreased='+1.21%'
      />
    </div>
    <div className='lg:flex xl:hidden'>
      <HeroSideCardMobile
        title='Total Deposited'
        infoItem='shows the total amount deposited,the total increase in deposits and the percentage increase'
        amount='$1,753,050'
        amountIncreased='+$33,132'
        percentageIncreased='+1.89%'
        titleOne='Total Borrowed'
        infoItemOne='shows the total amount borrowed,the total increase in deposits and the percentage increase'
        amountOne='$153,370'
        amountIncreasedOne='+$1,855'
        percentageIncreasedOne='+1.21%'
      />
    </div>
  </div>
);

export default HeroSidebar;
