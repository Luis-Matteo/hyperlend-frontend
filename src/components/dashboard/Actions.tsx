import React, { useState } from "react";
import ProgressBar from "../common/PercentBar";
// import CustomButton from "./CustomButton";
import { catImage } from "../../assets/img";

interface ActionProps {
  amountTitle: string;
  amountValue: string;
  btnTitle: string;
  inputDeal: string; // 80%, max ...
  noteUnderInput?: JSX.Element;
  noteAboveInput?: JSX.Element;
}

const Actions: React.FC<ActionProps> = ({
  amountTitle,
  amountValue,
  inputDeal,
  noteUnderInput,
  noteAboveInput,
  // btnTitle
}) => {
  const [progress, setProgress] = useState<number>(80);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(event.target.value));
  };
 
  return (
    <div>
      {noteAboveInput}
      <div className="flex items-center justify-between bg-[#071311] rounded-md p-4 mt-4 mb-4">
        <div className="flex gap-3 items-center w-fit p-3">
            <img src={catImage} alt="cat" />
        <p className="text-base text-[#CAEAE566]">0.00</p>
        </div>  
        <div className="bg-[#081916] p-4 rounded">
          <p className="text-base text-[#CAEAE566]">{inputDeal}</p>
        </div>
      </div>
      {noteUnderInput}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <p className="text-base text-lufga text-[#CAEAE5B2]">
            {amountTitle} amount
          </p>
          <p className="text-base text-lufga text-[#CAEAE5]">{amountValue}</p>
        </div>
        <hr className="mt-4 mb-4 text-[#212325] border-t-[0.25px]" />
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <p className="text-base text-lufga text-[#CAEAE5B2]">Total APY</p>
          <p className="text-base text-lufga text-[#CAEAE5]">9.92%</p>
        </div>
        <hr className="mt-4 mb-4 text-[#212325] border-t-[0.25px]" />
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <p className="text-base text-lufga text-[#CAEAE5B2]">Current: $918</p>
          <p className="text-base text-lufga text-[#CAEAE5]">Max: $1505</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mt-2 mb-2">
          <p className="text-xs text-lufga text-[#CAEAE5B2]">Current: $918</p>
          <p className="text-xs text-lufga text-[#CAEAE5]">Max: $1505</p>
        </div>
        <div className="flex justify-between items-center mt-2 mb-2">
          <p className="text-xs text-lufga text-[#CAEAE5B2]">Borrow limit</p>
          <p className="text-xs text-lufga text-[#CAEAE5]">$1505</p>
        </div>
        <div className="relative ">
          <ProgressBar progress={progress} className="h-1.5" />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleInputChange}
            className="w-full top-0 left-0 absolute opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between items-center mt-2 mb-2">
          <p className="text-xs text-lufga text-[#CAEAE5B2]">Daily earnings</p>
          <p className="text-xs text-lufga text-[#2DC24E]">$687</p>
        </div>
      </div>
      {/* <CustomButton title={btnTitle} /> */}
    </div>
  );
};

export default Actions;
