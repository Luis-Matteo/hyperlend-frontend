import CustomTitle from '../common/CustomTitle';

type HeroCardProps = {
  title: string;
  amount?: string | number;
  percentage?: string;
  amountIncreased?: string;
  percentageIncreased?: string;
  infoItem?: string;
};
const HeroMobile = ({
  title,
  amount,
  amountIncreased,
  percentageIncreased,
  infoItem,
}: HeroCardProps) => (
  <div
    className={`rounded-lg w-[100%] md:w-[65%] bg-[#071311] border border-1 border-[#CAEAE54D] py-6 pl-6 flex flex-col justify-center  items-start  bg-hero-pattern bg-cover bg-inherit bg-no-repeat bg-right`}
  >
    <div className='flex flex-col justify-center  items-start'>
      <CustomTitle
        title={title}
        titleStyles='text-[#E1E1E1] text-xs font-lufga font-light italic'
        infoItem={infoItem}
      />
      <span className='text-[#FFFFFF] font-lufga font-medium text-[28px]'>
        {amount}
      </span>

      <span className='text-[#2DC24E] font-lufga font-normal text-[14px]'>
        {amountIncreased}({percentageIncreased})
      </span>
    </div>
  </div>
);

export default HeroMobile;
