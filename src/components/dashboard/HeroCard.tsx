import { healthFactorImage } from '../../assets';
import CustomTitle from '../common/CustomTitle';

type HeroCardProps = {
  title: string;
  amount?: string | number;
  percentage?: string;
  amountIncreased?: string;
  percentageIncreased?: string;
  infoItem?: string;
  healthFactor?: string;
};
const HeroCard = ({
  title,
  amount,
  amountIncreased,
  percentageIncreased,
  infoItem,
  percentage,
  healthFactor,
}: HeroCardProps) => (
  <div
    className={`rounded-lg w-full lg:w-auto bg-[#071311] border border-1 border-[#CAEAE54D] py-6 px-[10px] flex flex-col justify-center ${title === 'Current balance' ? 'pr-12' : 'flex-1'} ${title === 'Health Factor' ? 'items-center' : 'items-start'}`}
  >
    <CustomTitle
      title={title}
      titleStyles='text-[#E1E1E1] text-xs font-lufga font-light italic  text-nowrap'
      infoItem={infoItem}
    />
    {title === 'Health Factor' && (
      <div className='flex flex-col justify-center items-center w-full p-0'>
        <div className='w-[60px]'>
          <img src={healthFactorImage} alt='' />
        </div>
        <span className='text-[#FFFFFF] font-lufga font-medium text-[28px] mt-[-10px]'>
          {healthFactor}
        </span>
      </div>
    )}
    {amount ? (
      <span className='text-[#FFFFFF] font-lufga font-medium text-[28px]'>
        {amount}
      </span>
    ) : (
      <span className='text-[#FFFFFF] font-lufga font-medium text-[28px]'>
        {percentage}
      </span>
    )}
    {title !== 'Health Factor' && (
      <span className='text-[#2DC24E] font-lufga font-normal text-[14px]'>
        {amountIncreased}({percentageIncreased})
      </span>
    )}
  </div>
);

export default HeroCard;
