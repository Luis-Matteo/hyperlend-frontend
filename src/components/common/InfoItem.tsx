import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { balanceEyeIcon } from '../../assets';

interface InfoItemProps {
  title: ReactNode;
  className?: string;
  currentTitle?:string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, className,currentTitle }) => {
  return (
    <div className='relative group'>
     {
      currentTitle === "Current balance" ? <img src={balanceEyeIcon} alt="" /> :  <Info size={11} className='text-[#FFFFFF66] dark:text-[#3E3E3E]' />
     }
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`fixed z-10 font-lufga bg-primary-light rounded-md p-2 text-[#E1E1E1] hidden group-hover:block shadow-custom ${className}`}
      >
        {title}
      </motion.p>
    </div>
  );
};

export default InfoItem;
