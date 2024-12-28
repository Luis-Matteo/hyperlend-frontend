
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
  currentTitle?:string
};
const HeroCard = ({
  title,
  amount,
  amountIncreased,
  percentageIncreased,
  infoItem,
  percentage,
  healthFactor,
  currentTitle
}: HeroCardProps) => (
  <div
    className={`h-[130px] rounded-lg w-[100%] md:w-auto lg:w-auto bg-[#071311] border border-1 border-[#CAEAE54D] py-2 px-1 md:py-3 md:px-3  lg:py-6 lg:px-6 flex flex-col justify-center ${title === 'Current balance' ? 'pr-12 ' : 'pr-1 lg:pr-6'} items-center lg:items-start xl:items-start gap-1`}
  >
    <CustomTitle
        title={title}
        titleStyles='text-[#E1E1E1] text-xs font-lufga font-light italic  text-nowrap'
        infoItem={infoItem}
        currentTitle={currentTitle}
      />
    <div
      className={`flex flex-col justify-center ${title === 'Health Factor' ? 'items-center' : 'items-start'} px-0`}
    >
      {title === 'Health Factor' && (
        <div className='flex flex-col justify-center items-center w-full p-0'>
          <div className='w-[91px] h-[46px] relative'>
            <img src={healthFactorImage} alt='' />
          </div>
          <span className='text-[#E1E1E1] font-lufga font-medium text-[28px] mt-[-20px]'>
            {healthFactor}
          </span>
        </div>
      )}
      {amount ? (
        <span className='text-[#E1E1E1] font-lufga font-medium text-[28px]'>
          {amount}
        </span>
      ) : (
        <span className='text-[#E1E1E1] font-lufga font-medium text-[28px]'>
          {percentage}
        </span>
      )}
      {title !== 'Health Factor' && (
        <span className='text-[#2DC24E] font-lufga font-normal text-[14px] text-nowrap'>
          {amountIncreased}({percentageIncreased})
        </span>
      )}
    </div>
  </div>
);

export default HeroCard;
