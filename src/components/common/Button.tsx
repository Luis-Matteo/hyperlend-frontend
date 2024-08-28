import React from 'react'

interface ButtonProps {
  title: string;
  onClick?: (action: any) => any;
}

const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className="bg-[#CAEAE5] w-full p-4 rounded-md mt-4">
      <p className="text-lg text-black font-extrabold">{title}</p>
    </button>
  )
}

export default Button