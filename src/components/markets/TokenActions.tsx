import React, { useState } from "react";
import ProgressBar from "../common/PercentBar";
import Button from "../common/Button";
import { catImage } from "../../assets/img";
import { TokenActionsProps } from "../../utils/interfaces";
import ToggleButton from "../common/ToggleButton";


const TokenActions: React.FC<TokenActionsProps> = ({
    amountTitle,
    amount,
    totalApy,
    percentBtn,
    balanceTitle,
    balance,
    limitTitle,
    limit,
    dailyEarning,
    btnTitle,
}) => {
    const [progress, setProgress] = useState<number>(80);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(Number(event.target.value));
    };

    const [collateral, setCollateral] = useState(false);

    return (
        <>
            {
                btnTitle === 'Supply' &&
                <div className="flex justify-between items-center mt-4">
                    <p className="text-base text-[#CAEAE566]">Collateral</p>
                    <ToggleButton
                        status={collateral}
                        setStatus={setCollateral} />
                </div>
            }
            <div className="flex items-center justify-between bg-[#071311] rounded-md px-4 py-2 mt-4 mb-4">
                <div className="flex gap-3 items-center w-fit p-3">
                    <img src={catImage} alt="cat" />
                    <p className="text-base text-[#CAEAE566]">0.00</p>
                </div>
                <div className="bg-[#081916] px-4 py-3 rounded">
                    <p className="text-base text-[#CAEAE566]">{percentBtn === 100 ? 'MAX' : `${percentBtn}% LIMIT`} </p>
                </div>
            </div>
            {
                btnTitle === 'Borrow' &&
                <p className="text-xs text-[#FF0000] mt-2">
                    You need to supply tokens and enable them as collateral before you
                    can borrow PURR from this pool
                </p>
            }
            <div className="mt-4">
                <div className="flex justify-between items-center">
                    <p className="text-base text-lufga text-[#4B5E5B]">
                        {amountTitle} amount
                    </p>
                    <p className="text-base text-lufga text-[#CAEAE5]">{amount}</p>
                </div>
                <hr className="mt-4 mb-4 text-[#212325] border-t-[0.25px]" />
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center">
                    <p className="text-base text-lufga text-[#4B5E5B]">Total APY</p>
                    <p className="text-base text-lufga text-[#CAEAE5]">{totalApy}%</p>
                </div>
                <hr className="mt-4 mb-4 text-[#212325] border-t-[0.25px]" />
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-base text-lufga text-[#4B5E5B]">
                            Current: {"  "}{" "}
                        </p>
                        <p className="text-[#CAEAE5]  text-base text-lufga font-thin ">
                            {" "}
                            $918{" "}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-base text-lufga text-[#4B5E5B]">MAX: </p>
                        <p className="text-[#CAEAE5]  text-base text-lufga font-thin ">
                            {" "}
                            $1505{" "}
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative my-2 ">
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
            <div>
                <div className="flex justify-between items-center mt-2 mb-2">
                    <p className="text-base text-lufga mt-2 text-[#4B5E5B]">
                        {balanceTitle}: {"  "}{" "}
                    </p>
                    <p className="text-[#CAEAE5]  text-base text-lufga font-thin ">{balance}</p>
                </div>
                <div className="flex justify-between items-center mt-2 mb-2">
                    <p className="text-base text-lufga text-[#4B5E5B]">{limitTitle}</p>
                    <p className="text-[#CAEAE5]  text-base text-lufga font-thin ">
                        {" "}
                        ${limit}
                    </p>
                </div>
                <div className="flex justify-between items-center mt-2 mb-2">
                    <p className="text-base text-lufga text-[#4B5E5B]">Daily earnings</p>
                    <p className="text-[#2DC24E]  text-base text-lufga  ">
                        {" "}
                        ${dailyEarning}
                    </p>
                </div>
            </div>
            <Button title={btnTitle} />
        </>
    );
};

export default TokenActions;
