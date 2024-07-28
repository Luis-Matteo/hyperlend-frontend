import { ReactNode } from 'react';

type CardItemProps = {
    className: string;
    content: ReactNode
}

function CardItem({ className, content }: CardItemProps) {
  return (
    <div className={`bg-primary rounded-2xl ${className}`}>
      {content}
    </div>
  );
}

export default CardItem;
