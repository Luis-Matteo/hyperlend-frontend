import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/sidebarSlice';
import hamburgerIcon from '../assets/icons/hamburger-icon.svg';
import { useConfirm } from '../provider/ConfirmProvider';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icons/left-arrow-white.svg';
import ConnectButton from '../components/header/ConnectButton';
import { motion } from 'framer-motion';

type NavbarProps = {
  pageTitle?: string | ReactNode;
  pageIcon?: ReactNode;
  back?: boolean;
};

function Navbar({ pageTitle, pageIcon, back }: NavbarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { guided } = useConfirm();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${guided > 0 ? 'lg:blur-[8px]' : ''}`}
    >
      <div className="flex justify-between items-center lg:hidden mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='font-lufga text-white'
          onClick={() => dispatch(toggleSidebar())}
        >
          <img src={hamburgerIcon} alt='' />
        </motion.button>
        <div className=''>
          <ConnectButton />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='w-full flex justify-between items-center'
      >
        <div className='flex gap-2 items-center'>
          {back && (
            <motion.button
              onClick={() => navigate(-1)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img src={backIcon} className='w-6 h-6' alt='back' />
            </motion.button>
          )}
          {pageIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {pageIcon}
            </motion.div>
          )}
          {pageTitle && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`${pageTitle == 'MBTC' ? 'text-orange-400' : 'text-blue-300'} font-lufga text-3xl text-white`}
            >
              {pageTitle}
            </motion.h2>
          )}
        </div>
        <div className='hidden lg:block'>
          {/* <div className="p-1 bg-primary hidden md:flex rounded-full gap-2">
            <div className="p-2 bg-gray-dark rounded-full">
              <img src={magnifyIcon} alt="" />
            </div>
            <input
              className="bg-primary rounded-full text-white font-lufga italic focus:outline-0"
              placeholder="Search your coins..."
              onChange={(e) => { setSearchText(e.target.value); console.log(searchText); }}
            />
          </div> */}
          <ConnectButton />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Navbar;
