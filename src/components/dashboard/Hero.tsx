import { pointsIcon } from '../../assets';
import { formatNumber } from '../../utils/functions';
import { UserPositionsData } from '../../utils/types';
import HeroCard from './HeroCard';
import HeroMobile from './HeroMobile';
import { IPoints } from '../../utils/user/points';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import EditNameModal from '../common/EditNameModal';

interface IHero {
  name: string;
  userPositionsData: UserPositionsData;
  userPointsData: IPoints;
}
const rank = null;
const Hero = ({ name, userPositionsData, userPointsData }: IHero) => {
  const [editNameModalOpen, setEditNameModalOpen] = useState(false);

  console.log(name);

  return (
    <div className='w-full'>
      <EditNameModal
        isOpen={editNameModalOpen}
        setIsOpen={setEditNameModalOpen}
      />
      <div className='hidden lg:block  w-full rounded-2xl  border border-1 border-[#CAEAE54D]'>
        <div className='w-[100%] h-[366px] py-8 px-6 rounded-2xl bg-hero-pattern bg-cover bg-bottom'>
          <div className='flex flex-col justify-center align-middle items-start gap-5'>
            <div className='flex flex-col gap-2 justify-center align-middle items-start'>
              <div className='flex gap-3 justify-center'>
                <img src={pointsIcon} alt='' />
                <h5 className='text-[#AEEAB9] font-lufga font-normal text-[18px]'>
                  {!rank ? 'Master Guardian' : rank}
                </h5>
              </div>
              <div className='flex flex-col justify-center gap-0 items-start m-0 p-0'>
                <span className='text-[#CAEAE5] font-thin font-lufga text-[22px]  m-0 p-0 '>
                  Welcome to HyperLend!
                </span>
                <Button
                  className='flex items-center gap-x-2 rounded-md'
                  onClick={() => setEditNameModalOpen(true)}
                >
                  <span>Choose Username</span>
                  <ArrowRight size={16} />
                </Button>
                {/* <h1 className='text-[#CAEAE5] font-lufga font-semibold text-[48px]  m-0 p-0'>
                Hello {name}
              </h1> */}
              </div>
            </div>
            <div className='flex lg:flex-row gap-2 justify-start align-middle items-start w-[100%]'>
              <HeroCard
                title='Current balance'
                infoItem='Shows the total current balance,total increase in income, and the percentage increase'
                amount={`$${formatNumber(userPositionsData.totalBalanceUsd, 2)}`}
                amountIncreased={`$${formatNumber(userPositionsData.totalBalanceChange, 2)}`}
                percentageIncreased={`${formatNumber(userPositionsData.totalBalanceChangePercentage, 2)}%`}
                currentTitle='Current balance'
              />
              <HeroCard
                title='Total APY'
                infoItem='Shows the total APY,total increase in APY, and the percentage increase'
                percentage={`${formatNumber(userPositionsData.netApy, 2)}%`}
                percentageIncreased={`${formatNumber(userPositionsData.apyChangePercentage, 2)}%`}
              />
              <HeroCard
                title='Total Points'
                infoItem='Shows the total points,total increase in points, and the percentage increase'
                amount={`${userPointsData.totalPoints}`}
                amountIncreased={`+${userPointsData.pointsIncrease}`}
                percentageIncreased={`+${userPointsData.pointsPercentIncrease}%`}
              />
              <HeroCard
                title='Health Factor'
                infoItem='Shows the health factor'
                healthFactor={formatNumber(userPositionsData.healthFactor, 2)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* ==================HERO MOBILE============================================================================================== */}
      <div className='sm:block  lg:hidden w-[100%]  py-8 '>
        <div className='flex flex-col justify-center align-middle items-start gap-5'>
          <div className='flex flex-col gap-2 justify-center align-middle items-start'>
            <div className='flex gap-1 justify-center'>
              <img src={pointsIcon} alt='' />
              <h5 className='text-[#AEEAB9] font-lufga font-normal text-[18px]'>
                Master Guardian
              </h5>
            </div>
            <div className='flex flex-col justify-center items-start m-0 p-0'>
              <h5 className='text-[#CAEAE5] font-lufga font-thin text-[25px]  m-0 p-0'>
                Welcome to HyperLend
              </h5>
              <h1 className='text-[#CAEAE5] font-lufga font-bold text-[38px]  m-0 p-0'>
                Hello gmeow.hl
              </h1>
            </div>
          </div>
          <HeroMobile
            title='Current balance'
            infoItem='Shows the total current balance,total increase in income, and the percentage increase'
            amount={`$${formatNumber(userPositionsData.totalBalanceUsd, 2)}`}
            amountIncreased={`$${formatNumber(userPositionsData.totalBalanceChange, 2)}`}
            percentageIncreased={`${formatNumber(userPositionsData.totalBalanceChangePercentage, 2)}%`}
          />
        </div>
      </div>
      <div className='flex lg:hidden gap-2 md:gap-4 justify-start align-middle items-start w-[100%] py-3 '>
        <HeroCard
          title='Total Points'
          infoItem='Shows the total points,total increase in points, and the percentage increase'
          amount={`${userPointsData.totalPoints}`}
          amountIncreased={`+${userPointsData.pointsIncrease}`}
          percentageIncreased={`+${userPointsData.pointsPercentIncrease}%`}
        />
        <HeroCard
          title='Health Factor'
          infoItem='Shows the health factor'
          healthFactor={formatNumber(userPositionsData.healthFactor, 2)}
        />

        <HeroCard
          title='Total APY'
          infoItem='Shows the total APY,total increase in APY, and the percentage increase'
          percentage={`${formatNumber(userPositionsData.netApy, 2)}%`}
          percentageIncreased={`${formatNumber(userPositionsData.apyChangePercentage, 2)}%`}
        />
      </div>
    </div>
  );
};

export default Hero;
