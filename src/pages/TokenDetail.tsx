import { useState } from 'react';
import Navbar from '../layouts/Navbar';
import CardItem from '../components/common/CardItem';
import ProgressBar from '../components/common/PercentBar'
import { supplies, supplyInfos, borrowInfos, rateModels } from '../utils/mock';
import { useParams } from 'react-router-dom';


function TokenDetail() {

    const {address} = useParams();
    console.log(address)
    const [activeButton, setActiveButton] = useState(1);
    const [stable, setStable] = useState(true);
    const [progress, setProgress] = useState<number>(80);

    const handleButtonClick = (button: number) => {
        setActiveButton(button);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(Number(event.target.value));
    };

    const buttons = [
        { id: 1, label: 'Supply' },
        { id: 2, label: 'Withdraw' },
        { id: 3, label: 'Borrow' },
        { id: 4, label: 'Repay' }
    ];

    return (
        <div className="w-full">
            <Navbar pageTitle={`PURR`} />
            <CardItem className="p-12 my-6">
                <div className="flex gap-20">
                    {(supplies || []).map((supply, index) => (
                        <div className="font-lufga" key={index}>
                            <p className="text-xs pb-4 text-[#E1E1E1]">{supply.name}</p>
                            <p className="text-3xl text-white">{supply.value}</p>
                        </div>
                    ))}
                </div>
            </CardItem>
            <div className="flex gap-8">
                <div className="w-2/3">
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-[#797979] text-xl font-lufga">Supply Info</p>
                            <ul className="flex gap-4 items-center">
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">30D</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">6M</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">1Y</p>
                                </button>
                            </ul>
                        </div>
                        <div className='flex items-center mt-8 mb-8'>
                            <span className="w-2 h-2 bg-[#2DC24E] rounded-full mr-2"></span>
                            <p className="text-xs text-[#797979] font-lufga">Supply API</p>
                        </div>
                        <div className="flex gap-12">
                            {(supplyInfos || []).map((supplyInfo, index) => (
                                <div className="font-lufga" key={index}>
                                    <p className="text-[9px] pb-2 text-[#E1E1E1]">{supplyInfo.name}</p>
                                    <p className="text-2xl text-white">{supplyInfo.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardItem>
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-[#797979] text-xl font-lufga">Borrow Info</p>
                            <ul className="flex gap-4 items-center">
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">30D</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">6M</p>
                                </button>
                                <button className="px-4 py-1.5 bg-[#081916] rounded-full">
                                    <p className="text-[#797979] text-sm font-lufga">1Y</p>
                                </button>
                            </ul>
                        </div>
                        <div className='flex items-center mt-8 mb-8'>
                            <span className="w-2 h-2 bg-[#302DC2] rounded-full mr-2"></span>
                            <p className="text-xs text-[#797979] font-lufga">Borrow API</p>
                        </div>
                        <div className="flex gap-12">
                            {(borrowInfos || []).map((borrowInfo, index) => (
                                <div className="font-lufga" key={index}>
                                    <p className="text-[9px] pb-2 text-[#E1E1E1]">{borrowInfo.name}</p>
                                    <p className="text-2xl text-white">{borrowInfo.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardItem>
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-[#797979] text-xl font-lufga">Interest Rate Model</p>
                            <ul className="flex gap-4 items-center">
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-[#302DC2] rounded-full"></span>
                                    <p className="text-xs text-[#797979]">Utilization rate</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-[#2DC296] rounded-full"></span>
                                    <p className="text-xs text-[#797979]">Borrow API</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-[#BFC22D] rounded-full"></span>
                                    <p className="text-xs text-[#797979]">Supply API</p>
                                </div>
                            </ul>
                        </div>
                    </CardItem>
                    <CardItem className="p-8 mb-6">
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-[#797979] text-xl font-lufga">Interest Rate Model</p>
                        </div>
                        {(rateModels || []).map((rateModel, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center">
                                    <p className="text-base text-lufga text-[#CAEAE5B2]">{rateModel.name}</p>
                                    <p className="text-base text-lufga text-[#CAEAE5]">{rateModel.value}</p>
                                </div>
                                <hr className="mt-4 mb-4 text-[#212325] border-t-[0.25px]" />
                            </div>
                        ))}
                    </CardItem>
                </div>
                <div className="w-1/3">
                    <CardItem className="p-8 mb-6 font-lufga">
                        <div className="w-full grid grid-cols-4 text-center">
                            {buttons.map((button) => (
                                <button key={button.id} onClick={() => handleButtonClick(button.id)}>
                                    <p className={`text-base ${activeButton === button.id ? 'text-white' : 'text-[#CAEAE566]'}`}>{button.label}</p>
                                    <hr
                                        className={`mt-4 mb-4 border ${activeButton === button.id ? 'text-white' : 'text-[#546764]'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-base text-[#CAEAE566]">Collateral</p>
                            <button
                                type="button"
                                className="p-0.5 bg-[#081916] rounded-full flex items-center"
                                onClick={() => setStable((prev) => !prev)}
                            >
                                <div
                                    className={`p-2 rounded-full transition-all duration-500 ${stable ? 'bg-secondary translate-x-0' : 'bg-transparent translate-x-full'
                                        }`}
                                />
                                <div
                                    className={`p-2 rounded-full transition-all duration-500 ${!stable ? 'bg-secondary translate-x-0' : 'bg-transparent -translate-x-full'
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between bg-[#071311] rounded-md p-4 mt-4 mb-4">
                            <p className="text-base text-[#CAEAE566]">0.00</p>
                            <div className="bg-[#081916] p-4 rounded">
                                <p className="text-base text-[#CAEAE566]">MAX</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between items-center">
                                <p className="text-base text-lufga text-[#CAEAE5B2]">Suppliable amount</p>
                                <p className="text-base text-lufga text-[#CAEAE5]">9281 PURR</p>
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
                            <div className='relative '>
                                <ProgressBar
                                    progress={progress} className='h-1.5' />
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
                        <button className="bg-[#CAEAE5] w-full p-4 rounded-md mt-4">
                            <p className="text-base text-black font-bold">Supply</p>
                        </button>
                    </CardItem>
                </div>
            </div>
        </div>
    )
}

export default TokenDetail;