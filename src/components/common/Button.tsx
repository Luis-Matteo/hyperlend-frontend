import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  title: string;
  onClick?: (action: any) => any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  variant = 'primary',
}) => {
  return (
    <button
      onClick={onClick}
      className={`${variant === 'primary' ? 'bg-[#CAEAE5] hover:bg-[#CAEAE5]/80' : 'border-[#CAEAE5] border-2 hover:bg-[#CAEAE5]/20'} w-full p-4 rounded-xl mt-4 font-lufga active:scale-95 duration-200`}
    >
      <p
        className={`${variant === 'primary' ? 'text-black' : 'text-[#CAEAE5]'} capitalize text-lg font-extrabold`}
      >
        {title}
      </p>
    </button>
  );
};

export default Button;
