import CustomTitle from '../common/CustomTitle';

type HeroSideCardProps = {
  title: string;
  amount?: string | number;
  percentage?: string;
  amountIncreased?: string;
  percentageIncreased?: string;
  infoItem?: string;
  titleOne: string;
  amountOne?: string | number;
  percentageOne?: string;
  amountIncreasedOne?: string;
  percentageIncreasedOne?: string;
  infoItemOne?: string;
};
const HeroSideCardMobile = ({
  title,
  amount,
  amountIncreased,
  percentageIncreased,
  infoItem,
  percentage,
  titleOne,
  amountOne,
  amountIncreasedOne,
  percentageIncreasedOne,
  infoItemOne,
  percentageOne,
}: HeroSideCardProps) => (
  <div className='sm:w-[100%] lg:w[100%] xl:w-[270px] flex justify-around rounded-lg items-center border border-1 border-[#CAEAE54D] py-4 px-5'>
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
    <div className='rounded-lg bg-[#071311] flex flex-col justify-center items-start'>
      <CustomTitle
        title={titleOne}
        titleStyles='text-[#E1E1E1] text-xs font-lufga font-light italic'
        infoItem={infoItemOne}
      />

      {amountOne ? (
        <span className='text-[#FFFFFF] font-lufga font-medium text-[28px]'>
          {amountOne}
        </span>
      ) : (
        <span className='text-[#FFFFFF] font-lufga font-medium text-[28px]'>
          {percentageOne}
        </span>
      )}
      <span className='text-[#2DC24E] font-lufga font-normal text-[14px]'>
        {amountIncreasedOne}({percentageIncreasedOne})
      </span>
    </div>
  </div>
);

export default HeroSideCardMobile;
