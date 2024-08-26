import { ReactNode } from 'react';

type CardItemProps = {
  className: string;
  children: ReactNode
}

function CardItem({ className, children }: CardItemProps) {
  return (
    <div className={`rounded-2xl ${className} ${className.includes('bg' ? '' : 'bg-primary')}`}>
      {children}
    </div>
  );
}

export default CardItem;
