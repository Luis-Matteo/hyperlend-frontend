import { formatAddress } from '../../utils/functions';
import leftArrow from '../../assets/icons/left-arrow.svg';

interface HistoryProps {
  toggleHistory: () => void;
}

const History = ({ toggleHistory }: HistoryProps) => {
  const earningHistory = [
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
    {
      wallet: '0x2338Ba3dB74F217b92dBE82f9bf4685503B24fC9',
      commission: 1094,
    },
  ];

  return (
    <>
      <div className='bg-[#1F2A29] rounded-md px-6 py-5 w-full '>
        <button
          className='flex gap-1 items-center'
          onClick={() => toggleHistory()}
        >
          <div className=''>
            <img src={leftArrow} alt='left' />
          </div>
          <p className='text-secondary font-lufga text-opacity-40 text-xs font-black px-2'>
            Back to Earnings
          </p>
        </button>
        <div className='mt-5 mb-1 py-3 bg-[#CAEAE5] bg-opacity-40 rounded-md flex justify-between items-center'>
          <p className='max-w-[140px] w-full text-center text-white text-xs font-medium font-lufga'>
            Wallets
          </p>
          <p className='w-full text-center text-white text-xs font-medium font-lufga'>
            Commission Generated
          </p>
        </div>
        <div className='max-h-[360px] h-full overflow-auto'>
          {(earningHistory || []).map((item, key) => (
            <div
              className='flex py-3 border-b-[1px] border-[#212325]'
              key={key}
            >
              <p className='max-w-[140px] w-full text-center text-white font-lufga'>
                {formatAddress(item.wallet)}
              </p>
              <p className='w-full text-center text-success font-lufga'>
                ${item.commission}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default History;


                  