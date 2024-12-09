import React, { useState } from 'react';
import CardItem from '../common/CardItem';
import magnifyIcon from '../../assets/icons/magnify-icon.svg';
import { motion } from 'framer-motion';
import { hypervaultStatus } from '../../utils/constants/hypervault';
import downArrowIcon from '../../assets/icons/down-arrow.svg';

type HypervaultProps = {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  sort: 'highest' | 'lowest';
  setSort: React.Dispatch<React.SetStateAction<'highest' | 'lowest'>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};
function HypervaultControl({
  status,
  setStatus,
  sort,
  setSort,
  searchText,
  setSearchText,
}: HypervaultProps) {
  const [mobileSearch, setMobileSearch] = useState<boolean>(false);
  const [mobileStatus, setMobileStatus] = useState<boolean>(false);
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const onClose = () => {
    setMobileSearch((prev) => !prev);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='md:pt-8 pb-4'
    >
      <CardItem className='py-3 px-2 md:px-6 flex justify-between items-center gap-2'>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className='bg-[#081916] rounded-full p-1 2xl:block hidden'
        >
          {hypervaultStatus.map((item) => (
            <motion.button
              key={item.slug}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type='button'
              className={`py-2 px-7 font-lufga rounded-full text-xs font-bold transition-all duration-500 ${
                item.disabled
                  ? 'text-gray'
                  : status === item.slug
                    ? 'bg-secondary'
                    : ' text-white'
              }`}
              disabled={item.disabled}
              onClick={() => setStatus(item.slug)}
            >
              {item.name}
            </motion.button>
          ))}
        </motion.div>
        <motion.div
          className='2xl:hidden relative w-[200px] bg-[#081916] rounded-lg'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className='w-full flex justify-between items-center px-4 text-base h-[54px] rounded-lg text-[#CAEAE566] hover:shadow-inner-3xl'
            onClick={() => setMobileStatus((prev) => !prev)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.p className='text-secondary font-lufga capitalize' layout>
              {hypervaultStatus.find((item) => item.slug === status)?.name}
            </motion.p>
            <img
              className={`w-6 transition-all duration-100`}
              src={downArrowIcon}
              alt='downArrow'
            />
          </motion.button>
          {mobileStatus && (
            <div className='absolute top-16 left-0 w-full flex flex-col bg-primary rounded-lg shadow-2xl'>
              {hypervaultStatus.map((item) => (
                <button
                  key={item.slug}
                  className={`py-4 px-7 font-lufga rounded-lg text-xs font-bold transition-all duration-500 ${
                    item.disabled
                      ? 'text-gray'
                      : ' text-secondary hover:bg-secondary/20 '
                  }`}
                  disabled={item.disabled}
                  onClick={() => {
                    setStatus(item.slug);
                    setMobileStatus(false);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <div className='flex items-center gap-2 lg:gap-16'>
          <div className='bg-[#081916] rounded-full hidden md:flex gap-2'>
            <div className='p-2 rounded-full'>
              <img src={magnifyIcon} alt='' />
            </div>
            <input
              className='bg-[#081916] rounded-full text-white font-lufga italic focus:outline-0'
              placeholder='Search your coins...'
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setMobileSearch((prev) => !prev)}
              className='bg-[#081916] rounded-full'
            >
              <img src={magnifyIcon} alt='' className='p-2 rounded-full' />
            </button>
            {mobileSearch && (
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
                  className='bg-[#081916] flex rounded-full'
                >
                  <div className='p-2 rounded-full'>
                    <img src={magnifyIcon} alt='' />
                  </div>
                  <input
                    className='bg-[#081916] rounded-full text-white font-lufga italic focus:outline-0'
                    placeholder='Search assets...'
                    value={searchText}
                    autoFocus
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
          <motion.div
            className='relative w-[80px] lg:w-[175px] bg-[#081916] rounded-lg'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className='w-full flex justify-between items-center px-2 sm:px-6 text-base h-[54px] rounded-lg text-[#CAEAE566]'
              onClick={() => setSort(sort === 'highest' ? 'lowest' : 'highest')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.p className='text-secondary font-lufga capitalize' layout>
                <span className='capitalize hidden lg:inline'>{sort}</span> TVL
              </motion.p>
              <motion.img
                className={`w-6 transition-all duration-100 ${sort === 'highest' ? '' : 'rotate-180'}`}
                src={downArrowIcon}
                alt='downArrow'
                animate={{ rotate: sort === 'highest' ? 0 : 180 }}
                transition={{ duration: 0.1 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </CardItem>
    </motion.div>
  );
}

export default HypervaultControl;
