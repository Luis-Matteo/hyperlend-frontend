import React from 'react'

interface CustomButtonProps {
    title: string;
    onPress?: (action: any) => any;
}

const CustomButton: React.FC<CustomButtonProps> = ({title, onPress}) => {
  return (
    <button onChange={onPress} className="bg-[#CAEAE5] w-full p-4 rounded-md mt-4">
    <p className="text-base text-black font-bold">{title}</p>
</button>
  )
}

export default CustomButton