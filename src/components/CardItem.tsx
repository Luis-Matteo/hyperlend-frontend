import { ReactNode } from 'react';

type CardItemProps = {
    className: string;
    children: ReactNode
}

function CardItem({ className, children }: CardItemProps) {
  return (
    <div className={`bg-primary rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export default CardItem;
