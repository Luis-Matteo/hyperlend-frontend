import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface InfoItemProps {
  title: ReactNode;
  className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, className }) => {
  return (
    <div className='relative group'>
      <Info size={14} className='text-[#D7DBDF] dark:text-[#3E3E3E]' />
      <p
        className={`fixed z-10 font-lufga bg-primary-light rounded-md p-2 text-[#D7DBDF] hidden group-hover:block shadow-custom ${className}`}
      >
        {title}
      </p>
    </div>
  );
};

export default InfoItem;
