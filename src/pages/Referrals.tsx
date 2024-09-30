import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { toggleModalOpen } from '../store/sidebarSlice';
import logo from '../assets/icons/logo.svg';
import mountainImage from '../assets/img/mountain.svg';
import { copyToClipboard, formatAddress } from '../utils/functions';
import leftArrow from '../assets/icons/left-arrow.svg';
import ProgressBar from '../components/common/PercentBar';
import MyChart from '../components/dashboard/Chart';

function Referrals() {
  const dispatch = useDispatch();
  const [page, setPage] = useState<string>('refer');
  const [history, setHistory] = useState<boolean>(false);
  const [day, setDay] = useState<number>(30);
  const [isCopy, setIsCopy] = useState(false);
  const mockLink = 'https://hyperlend.finance/?ref=wagami';
  const onClose = () => {
    dispatch(toggleModalOpen());
  };
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    if (isCopy) {
      setTimeout(() => setIsCopy(false), 2000);
    }
  }, [isCopy]);

  const days = [30, 14, 7];
  const data = [
    100000, 100358, 101006, 102529, 102295, 102060, 103640, 104407, 103938,
    104480, 104017, 103551, 103793, 101880, 100155, 99592, 98580, 98894, 97986,
    96574, 98039, 97813, 97881, 96456, 95912, 96023, 94872, 95247, 94647, 94355,
    93753, 95606, 95592, 94534, 95357, 94136, 94345, 92385, 91057, 91254, 91992,
    92164, 92048, 91747, 90269, 89549, 89088, 90145, 90489, 88726, 89050, 88665,
    87988, 88600, 89631, 90562, 89723, 89413, 89745, 90720, 90241, 90055, 88949,
    87753, 88565, 89922, 89850, 90853, 91215, 90570, 90931, 92469, 92433, 93998,
    91378, 92200, 92287, 91988, 92080, 90092, 89873, 90230, 91708, 91189, 90381,
    89879, 90795, 91123, 90593, 91107, 91204, 92172, 91470, 91143, 90751, 89287,
    89583, 89844, 89849, 89615, 88199, 87779, 87436, 86634, 86473, 86877, 88763,
    88937, 89195, 89120, 87202, 87175, 87235, 89699, 89506, 89808, 89773, 88604,
    89747, 90499, 91290, 90381, 91784, 90382, 90969, 93159, 92169, 91602, 91702,
    91198, 89648, 89716, 88654, 89128, 88208, 89758, 88975, 88653, 89466, 88235,
    88463, 89770, 88163, 88347, 88607, 89389, 88152, 86832, 87353, 87650, 87901,
    88247, 87567, 87800, 88093, 87378, 89244, 89718, 88527, 89183, 88209, 88996,
    90154, 89334, 90297, 90710, 91532, 93429,
  ];
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
  console.log(day);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClickOutside}
        className='fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm'
      >
        <motion.div
          initial={{ scale: 0, rotate: '12.5deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          exit={{ scale: 0, rotate: '0deg' }}
          className='px-10 py-8 bg-primary-light rounded-2xl shadow-4xl'
        >
          <div className='flex flex-col justify-center items-center gap-3 mb-7'>
            <img src={logo} alt='logo' />
            <p className='font-lufga text-xl font-black text-secondary'>
              Refer & Earn
            </p>
          </div>
          <div className='px-14 py-8 bg-primary rounded-xl'>
            {
              <>
                <button onClick={() => setPage('refer')}>
                  <p
                    className={`text-xs font-lufga font-black transition-colors duration-300 ease-in-out ${page === 'refer' ? 'text-secondary' : 'text-secondary text-opacity-40 hover:text-white'}`}
                  >
                    Refer Frens
                  </p>
                  <hr
                    className={`px-40 my-4 border transition-colors duration-300 ease-in-out ${page === 'refer' ? 'text-white' : 'text-[#546764]'}`}
                  />
                </button>
                <button onClick={() => setPage('earn')}>
                  <p
                    className={`text-xs font-lufga font-black transition-colors duration-300 ease-in-out ${page === 'earn' ? 'text-secondary' : 'text-secondary text-opacity-40 hover:text-white'}`}
                  >
                    My Earnings
                  </p>
                  <hr
                    className={`px-40 my-4 border transition-colors duration-300 ease-in-out ${page === 'earn' ? 'text-white' : 'text-[#546764]'}`}
                  />
                </button>
              </>
            }
            {page === 'refer' ? (
              <>
                <div className='relative h-56 w-full rounded-md px-7 py-5 bg-secondary mb-10'>
                  <div className=''>
                    <p className='font-black text-xl leading-8'>
                      Refer Your Frens
                    </p>
                    <p className='font-light mt-3'>
                      Access instant loans using your
                      <br /> crypto holdings as collateral.
                    </p>
                  </div>
                  <div className='absolute right-0 bottom-0'>
                    <img src={mountainImage} alt='mountain' />
                  </div>
                </div>
                <div className='flex justify-between gap-2'>
                  <p className='text-secondary py-2 px-5 bg-[#1F2A29] rounded-full w-full'>
                    {mockLink}
                  </p>
                  <button
                    className={`py-2 w-[130px] bg-secondary text-xs font-black rounded-full whitespace-nowrap transition-colors duration-300 ${isCopy ? 'text-success' : ''}`}
                    onClick={() => {
                      copyToClipboard(mockLink), setIsCopy(true);
                    }}
                    type='button'
                  >
                    {isCopy ? 'Copied' : 'Copy Url'}
                  </button>
                </div>
              </>
            ) : (
              <>
                {!history ? (
                  <div className='flex flex-col gap-5 w-full items-center'>
                    <div className='flex gap-5 w-full '>
                      <div className='flex flex-col gap-5 w-full'>
                        <div className='bg-[#1F2A29] rounded-md p-2 flex justify-between items-end w-full'>
                          <div className='px-2'>
                            <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
                              Available Credit
                            </p>
                            <p className='text-secondary font-lufga text-xl font-black my-2'>
                              $10,494.93
                            </p>
                          </div>
                          <button
                            className='inline-block px-7 py-3 bg-secondary text-xs font-black rounded-lg'
                            type='button'
                          >
                            Claim
                          </button>
                        </div>
                        <div className='bg-[#1F2A29] rounded-md p-2 flex justify-between items-end'>
                          <div className='px-2'>
                            <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
                              Lifetime Earnings
                            </p>
                            <p className='text-secondary font-lufga text-xl font-black my-2'>
                              $104,494.93
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='bg-[#1F2A29] rounded-md p-2 w-full'>
                        <div className='px-2 w-full'>
                          <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
                            Commission Tier
                          </p>
                          <p className='text-secondary font-lufga text-2xl font-black mt-2 mb-6'>
                            Tier 1
                          </p>
                          <p className='text-secondary font-lufga text-opacity-40 text-xs font-black mb-3'>
                            Commission Tier
                          </p>
                          <ProgressBar progress={60} className='h-[7px]' />
                        </div>
                      </div>
                    </div>
                    <div className='bg-[#1F2A29] rounded-md p-2 w-full'>
                      <div className='px-2 flex justify-between items-center'>
                        <p className='text-secondary font-lufga text-opacity-40 text-xs font-black'>
                          Referral Earnings
                        </p>
                        <div className='flex gap-2'>
                          {(days || []).map((item) => (
                            <button
                              className='px-4 py-1 bg-[#081916] rounded-full'
                              key={item}
                              onClick={() => setDay(item)}
                            >
                              <p className='text-[#797979] text-xs font-lufga'>
                                {item}d
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className='h-[120px]'>
                        <MyChart data={data} />
                      </div>
                    </div>
                    <div className='bg-[#1F2A29] rounded-md p-2 w-full flex justify-between items-center'>
                      <p className='text-secondary font-lufga text-opacity-40 text-xs font-black px-2'>
                        Referral History
                      </p>
                      <button
                        className='px-8 py-3 bg-secondary bg-opacity-40 rounded-md mx-2 text-xs font-black'
                        onClick={() => setHistory(true)}
                      >
                        View History
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='bg-[#1F2A29] rounded-md px-6 py-5 w-full '>
                    <button
                      className='flex gap-1 items-center'
                      onClick={() => setHistory(false)}
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
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Referrals;
