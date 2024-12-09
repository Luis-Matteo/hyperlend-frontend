import Navbar from '../../layouts/Navbar';
import CardItem from '../../components/common/CardItem';
import { motion } from 'framer-motion';

import hyperloopIcon from '../../assets/icons/hyperloop-icon.svg';
import { Outlet } from 'react-router-dom';

function Hyperloop() {
  return (
    <>
      <div className='w-full'>
        <Navbar />
        <motion.div
          className='max-w-[500px] mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className='mb-10 text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className='flex gap-3 items-center justify-center'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img className='w-11 h-11' src={hyperloopIcon} alt='hyperloop' />
              <h4 className='text-secondary font-lufga text-3xl'>HyperLoop</h4>
            </motion.div>
            <p className='mt-4 text-secondary text-opacity-40 font-lufga'>
              Maximize gains by making your deposits work harder.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CardItem className='p-4 md:p-6'>
              <Outlet />
            </CardItem>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Hyperloop;
