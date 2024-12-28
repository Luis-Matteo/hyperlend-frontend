import { pointsIcon } from '../../assets';
import HeroCard from './HeroCard';
import HeroMobile from './HeroMobile';

const Hero = () => (
  <div className='w-full'>
    <div className='hidden lg:block w-[100%] h-[366px] py-8 px-6 rounded-2xl border border-1 border-[#CAEAE54D] bg-hero-pattern bg-cover bg-bottom'>
      <div className='flex flex-col justify-center align-middle items-start gap-5'>
        <div className='flex flex-col gap-2 justify-center align-middle items-start'>
          <div className='flex gap-3 justify-center'>
            <img src={pointsIcon} alt='' />
            <h5 className='text-[#AEEAB9] font-lufga font-normal text-[18px]'>
              Master Guardian
            </h5>
          </div>
          <div className='flex flex-col justify-center gap-0 items-start m-0 p-0'>
            <span className='text-[#CAEAE5] font-medium font-lufga text-[25px]  m-0 p-0 mb-[-15px]'>
              Welcome to HyperLend!
            </span>
            <h1 className='text-[#CAEAE5] font-lufga font-semibold text-[48px]  m-0 p-0'>
              Hello hyperlend.hl
            </h1>
          </div>
        </div>
        <div className='flex lg:flex-row gap-2 justify-start align-middle items-start w-[100%]'>
          <HeroCard
            title='Current balance'
            infoItem='Shows the total current balance,total increase in income, and the percentage increase'
            amount='$1,753,050'
            amountIncreased='+$22,568 '
            percentageIncreased='+1.28%'
            currentTitle='Current balance'
          />
          <HeroCard
            title='Total APY'
            infoItem='Shows the total APY,total increase in APY, and the percentage increase'
            percentage='18.7%'
            percentageIncreased='+1.3%'
          />
          <HeroCard
            title='Total Points'
            infoItem='Shows the total points,total increase in points, and the percentage increase'
            amount='421'
            amountIncreased='+12 '
            percentageIncreased='+3.89%'
          />
          <HeroCard
            title='Health Factor'
            infoItem='Shows the health factor'
            healthFactor='9,8'
          />
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
          amount='$1,753,050'
          amountIncreased='+$22,568 '
          percentageIncreased='+1.28%'
        />
      </div>
    </div>
    <div className='flex lg:hidden gap-2 md:gap-4 justify-start align-middle items-start w-[100%] py-3 '>
      <HeroCard
        title='Total Points'
        infoItem='Shows the total points,total increase in points, and the percentage increase'
        amount='421'
        amountIncreased='+12 '
        percentageIncreased='+3.89%'
      />
      <HeroCard
        title='Health Factor'
        infoItem='Shows the health factor'
        healthFactor='9.8'
      />

      <HeroCard
        title='Total APY'
        infoItem='Shows the total APY,total increase in APY, and the percentage increase'
        percentage='18.7%'
        percentageIncreased='+1.3%'
      />
    </div>
  </div>
);

export default Hero;
