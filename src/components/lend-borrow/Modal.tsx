import { useState } from 'react'
import xmarkIcon from '../../assets/icons/xmark-icon.svg'
import gearIcon from '../../assets/icons/gear-icon.svg'
import { formatNumber } from '../../utils/functions';
import ProgressBar from '../common/PercentBar';

interface ModalProps {
    onClose: () => void;
}

function Modal({ onClose }: ModalProps) {
    const [count, setCount] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const percentList = [25, 50, 75, 100]
    const availableCount = 19484.92;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(Number(event.target.value));
        setCount(availableCount / 100 * Number(event.target.value))
    };

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleClickOutside}
            className="fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm">
            <div
                className="px-6 py-4 bg-primary-light rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                    <p className="font-lufga font-light text-[#797979]">You Supply</p>
                    <button className="" onClick={onClose}>
                        <img src={xmarkIcon} alt="" />
                    </button>
                </div>
                <div className='px-6 py-4 bg-[#050F0D] rounded-2xl flex flex-col gap-4 mb-5'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2 items-center'>
                            <div className="w-9 h-9 bg-gray-light rounded-full"></div>
                            <div className=''>
                                <p className='text-white font-lufga'>JitoSOL</p>
                                <p className='text-success text-xs font-lufga'>1.93%APY</p>
                            </div>
                        </div>
                        <p className='text-xl text-secondary'>
                            {formatNumber(count, 2)}
                        </p>
                    </div>
                    <div className='flex gap-14'>
                        <p className='text-[#797979] text-xs font-lufga'>Wallet: 1,5M JitoSOL</p>
                        <ul className='flex gap-2 items-center'>
                            {
                                percentList.map((item) => (
                                    <button className='px-2 py-0.5 bg-[#081916] rounded-full'
                                        key={item}
                                        onClick={() => setCount(availableCount / 100 * item)}>
                                        <p className='text-[#797979] text-xs font-lufga'>{item === 100 ? "MAX" : `${item}%`}</p>
                                    </button>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className='mb-6'>
                    <div className='flex justify-between mb-2'>
                        <p className="font-lufga font-light text-[#797979]">Available collateral</p>
                        <p className="font-lufga font-light text-[#797979]">${formatNumber(availableCount, 2)}</p>
                    </div>
                    <div className='relative '>
                        <ProgressBar
                            progress={progress} className='h-1.5'/>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleInputChange}
                            className="w-full top-0 left-0 absolute opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
                <button className='w-full py-4 bg-secondary font-lufga rounded-xl font-bold mb-3'>
                    Swap
                </button>
                <div className='flex justify-end mb-6'>
                    <button className='px-3 py-1.5 flex gap-2 items-center bg-[#050F0D] rounded-full'>
                        <img src={gearIcon} alt="" />
                        <p className='uppercase text-[#797979]'>settings</p>
                    </button>
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='flex justify-between'>
                        <p className='font-lufga text-[#797979] text-xs'>Your amount</p>
                        <p className='font-lufga text-white text-xs'>0 JitoSOL</p>
                    </div>
                    <div className='flex justify-between'>
                        <p className='font-lufga text-[#797979] text-xs'>Health</p>
                        <p className='font-lufga text-warning text-xs'>38.11%</p>
                    </div>
                    <div className='flex justify-between'>
                        <p className='font-lufga text-[#797979] text-xs'>Pool size</p>
                        <p className='font-lufga text-white text-xs'>738.89K</p>
                    </div>
                    <div className='flex justify-between'>
                        <p className='font-lufga text-[#797979] text-xs'>Type</p>
                        <p className='font-lufga text-white text-xs'>Global pool</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal