import { ReactNode } from "react";

type CardItemProps = {
  className: string;
  children: ReactNode;
};

function CardItem({ className, children }: CardItemProps) {
  return (
    <div className={`rounded-2xl bg-primary ${className}`}>{children}</div>
  );
}

export default CardItem;
