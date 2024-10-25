import logo from '../../assets/img/share-img/logo.svg';
import circleImage from '../../assets/img/share-img/circle.svg'

type ShareImageProps = {
  catImage: string;
  circularImage: string;
  username: string;
  symbol: string;
  apy: string;
  dailyEarnings: string;
  tokenIcon: string;
}

function ShareImg(
  { catImage,
    circularImage,
    username,
    symbol,
    apy,
    dailyEarnings,
    tokenIcon,
  }: ShareImageProps

) {

  return (
    <div>
      <div className='pl-[20px] flex bg-[#CAEAE5] w-[100%] h-auto rounded-md'>
        <div className='my-[25px] flex flex-col w-[30%] z-10'>
          <div className='w-[160%] sm:w-[150%]'>
            <div className='flex items-center justify-start w-full gap-1'>
              <div className="relative">
                <img src={circleImage} alt='circle' className='w-[28px] aspect-square' />
                <img src={circularImage} alt='circle' className='w-[20px] rounded-full aspect-square absolute top-[4px] left-[4px]' />
              </div>
              <div className='font-lufga text-[7px] font-[300]'>
                Meet {username}
              </div>
            </div>
            <div className='flex items-center mt-3 gap-1'>
              <div className='flex items-center gap-1'>
                <img src={tokenIcon} className='w-[14px]' alt='ether' />
                <p className='font-lufga text-[8px]'>{symbol}</p>
              </div>
              <div className='font-lufga text-[8px] bg-black font-[500] text-[#CAEAE5] px-1 rounded-sm'>${dailyEarnings}/Day</div>
            </div>

            <div className='text-[36px] sm:text-[40px] font-nexa font-[900] text-left'>
              {apy}%
            </div>

            <div className='font-lufga text-[5px] font-[400] text-left'>
              Unlock powerful yields trough our secure lending protocol.
            </div>

            <div className='font-lufga text-[8px] text-left font-[800]'>
              hyperlend.finance
            </div>

            <div className='flex items-center mt-5'>
              <img src={logo} alt='logo' className='w-fit' />
            </div>
          </div>
        </div>
        <div className='w-[70%] flex justify-end overflow-hidden rounded-md'>
          <img src={catImage} className="max-h-[219px]" alt='cat' />
        </div>
      </div>
    </div>
  );
}


export default ShareImg;
