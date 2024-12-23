import { ReactNode } from 'react';
import CardItem from '../common/CardItem';

type BorderCardProps = {
  title: string;
  className?: string;
  children?: ReactNode;
};

function BorderCard({ title, className, children }: BorderCardProps) {
  return (
    <>
      <div className='p-[1px] rounded-2xl bg-gradient-to-b from-[#FFFFFF1A] to-[#FFFFFF00]'>
        <CardItem className={`px-8 py-9 h-full ${className}333333333333333333333333333333333333333333333333333333333333333333333333`}>
          <p className='text-secondary text-xl font-lufga'>{title}</p>
          {children}
        </CardItem>
      </div>
    </>
  );
}

export default BorderCard;
