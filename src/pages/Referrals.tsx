import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { toggleModalOpen } from '../store/sidebarSlice';
import logo from '../assets/icons/logo.svg';

import Main from '../components/referrals/Main';
import Earnings from '../components/referrals/Earnings';
import History from '../components/referrals/History';
import xmarkIcon from '../assets/icons/xmark-icon.svg';

function Referrals() {
  const dispatch = useDispatch();
  const [page, setPage] = useState<string>('refer');
  const [history, setHistory] = useState<boolean>(false);

  const onClose = () => {
    dispatch(toggleModalOpen());
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

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
          className='relative px-10 py-8 bg-primary-light rounded-2xl shadow-4xl'
        >
          <button className='absolute right-8 top-8'
            onClick={onClose}>
            <img className='' src={xmarkIcon} alt='close' />
          </button>
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
                <button /*onClick={() => setPage('earn')}*/>
                  <p
                    className={`text-xs font-lufga font-black transition-colors duration-300 ease-in-out ${page === 'earn' ? 'text-secondary' : 'text-secondary text-opacity-40'}`}
                  >
                    🔒 My Earnings
                  </p>
                  <hr
                    className={`px-40 my-4 border transition-colors duration-300 ease-in-out ${page === 'earn' ? 'text-white' : 'text-[#546764]'}`}
                  />
                </button>
              </>
            }
            {page === 'refer' ? (
              <>
                <Main />
              </>
            ) : (
              <>
                {!history ? (
                  <Earnings
                    toggleHistory={() => {
                      setHistory(!history);
                    }}
                  />
                ) : (
                  <History
                    toggleHistory={() => {
                      setHistory(!history);
                    }}
                  />
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
