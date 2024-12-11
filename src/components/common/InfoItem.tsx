import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoItemProps {
  title: ReactNode;
  className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, className }) => {
  return (
    <div className='relative group'>
      <Info size={14} className='text-[#D7DBDF] dark:text-[#3E3E3E]' />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`fixed z-10 font-lufga bg-primary-light rounded-md p-2 text-[#D7DBDF] hidden group-hover:block shadow-custom ${className}`}
      >
        {title}
      </motion.p>
    </div>
  );
};

export default InfoItem;
