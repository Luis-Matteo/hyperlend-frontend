
import { borrowIcon, depositIcon } from '../../assets';
import CustomIcon from '../common/CustomIcon';
import CustomTitle from '../common/CustomTitle';

type HeroSideCardProps = {
  title: string;
  amount?: string | number;
  percentage?: string;
  amountIncreased?: string;
  percentageIncreased?: string;
  infoItem?: string;
};
const HeroSideCard = ({
  title,
  amount,
  amountIncreased,
  percentageIncreased,
  infoItem,
  percentage,
}: HeroSideCardProps) => (
  <div className='sm:w-[100%] lg:w[100%] xl:w-[280px] flex justify-between gap-4 rounded-lg items-center border border-1 border-[#CAEAE54D] py-4 px-4'>
    <div className='rounded-lg bg-[#071311] flex flex-col justify-center items-start'>
      <CustomTitle
        title={title}
        titleStyles='text-[#E1E1E1] text-xs font-lufga font-light italic'
        infoItem={infoItem}
      />

      {amount ? (
        <span className='text-[#FFFFFF] font-lufga font-medium text-[28px]'>
          {amount}
        </span>
      ) : (
        <span className='text-[#FFFFFF] font-lufga font-medium text-[28px]'>
          {percentage}
        </span>
      )}
      <span className='text-[#2DC24E] font-lufga font-normal text-[14px]'>
        {amountIncreased}({percentageIncreased})
      </span>
    </div>

    {title === 'Total Deposited' ? (
      <CustomIcon
        mainDivStyles='rounded-full border border-1 border-[#CAEAE51A] bg-[#CAEAE50D] p-4'
        iconImage={depositIcon}
        width='20px'
        height='20px'
      />
    ) : (
      <CustomIcon
        mainDivStyles='rounded-full border border-1 border-[#CAEAE51A] bg-[#FF00040D] p-4'
        iconImage={borrowIcon}
        width='20px'
        height='20px'
      />
    )}
  </div>
);

export default HeroSideCard;
