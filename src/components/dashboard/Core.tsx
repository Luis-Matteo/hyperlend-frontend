import { useRef } from 'react';
import { useConfirm } from '../../provider/ConfirmProvider';
import { motion } from 'framer-motion';
import TransactionsDeskTop from './TransactionsDeskTop';
import TransactionsMobile from './TransactionsMobile';

function Core() {
  const { guided } = useConfirm();

  const divRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col'
      >
        <motion.div
          ref={divRefs[3]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`lg:flex lg:flex-col xl:flex-row gap-5 justify-between ${guided > 0 && guided !== 4 ? 'lg:blur-[8px]' : ''}`}
        >
          <div className='w-full hidden md:block lg:block xl:block'>
            <TransactionsDeskTop />
          </div>
          <div className='w-full block md:hidden lg:hidden xl:hidden'>
            <TransactionsMobile />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Core;
