import { forwardRef, ReactNode } from 'react';

// Define the props for the CardItem component
type CardItemProps = {
  className: string;
  children: ReactNode;
};

// Forward ref to the div (or any element you want to apply it to)
const CardItem = forwardRef<HTMLDivElement, CardItemProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={`rounded-2xl bg-primary ${className}`}>
        {children}
      </div>
    );
  },
);

export default CardItem;
