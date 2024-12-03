import { useState } from 'react';
import ethIcon from '../../assets/icons/coins/eth-icon.svg';
import wbtcIcon from '../../assets/icons/coins/wbtc-icon.svg';
import { formatNumber } from '../../utils/functions';
import leftArrowIcon from '../../assets/icons/left-arrow.svg';
import Factor from '../dashboard/Factor';

const pairs = [
    {
        id: 1,
        token1: {
            icon: ethIcon,
            name: "stHYPE",
        },
        token2: {
            icon: wbtcIcon,
            name: "MBTC",
        },
        apy: 41.84,
        value: 1987892173,
    },
    {
        id: 2,
        token1: {
            icon: ethIcon,
            name: "stHYPE",
        },
        token2: {
            icon: wbtcIcon,
            name: "MBTC",
        },
        apy: 41.84,
        value: 1987892173,
    },
]
function MyPositions() {
    const [selectedPair, setSelectedPair] = useState<number | null>(null);
    const availableAmount = 45566;
    const [amount, setAmount] = useState<number>(0);


    return (
        <>
            <div className='mt-6'>
                {
                    selectedPair ?
                        <div className='w-full'>
                            <div className='relative flex justify-between items-center'>
                                <button className='left-0 flex gap-2 items-center'
                                    onClick={() => setSelectedPair(null)}>
                                    <img src={leftArrowIcon} alt="left-arrow" />
                                    <p className='text-secondary/40 text-sm font-nexa'>Back</p>
                                </button>
                                <div className='flex gap-4 items-center'>
                                    <div className='flex -space-x-3'>
                                        <img className='w-10 h-10 object-cover rounded-full' src={pairs.find(item => item.id == selectedPair)?.token1.icon} alt="token" />
                                        <img className='w-10 h-10 object-cover rounded-full' src={pairs.find(item => item.id == selectedPair)?.token2.icon} alt="token" />
                                    </div>
                                    <p className='text-secondary text-lg font-lufga'>{pairs.find(item => item.id == selectedPair)?.token1.name} / {pairs.find(item => item.id == selectedPair)?.token2.name}</p>
                                </div>
                                <div className='sm:block hidden'/>
                            </div>
                            <div className='flex flex-col gap-3 mt-8'>
                                <div className='p-5 bg-[#071311] rounded-2xl'>
                                    <p className='text-sm italic text-[#E1E1E1]'>Health Factor</p>
                                    <div className='relative flex text-center justify-center items-end overflow-hidden'>
                                        <div className='translate-y-20 top-0'>
                                            <Factor healthFactor={1.2} />
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full py-6 bg-[#071311] rounded-2xl flex flex-col justify-center items-center gap-2'>
                                    <p className='text-secondary font-lufga'>${formatNumber(98915548, 2)}</p>
                                    <p className='text-secondary/40 text-sm font-lufga'>Position Value</p>
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='w-full py-6 bg-[#071311] rounded-2xl flex flex-col justify-center items-center gap-2'>
                                        <p className='text-secondary font-lufga'>${formatNumber(98915548, 2)}</p>
                                        <p className='text-secondary/40 text-sm font-lufga'>Dept Value</p>
                                    </div>
                                    <div className='w-full py-6 bg-[#071311] rounded-2xl flex flex-col justify-center items-center gap-2'>
                                        <p className='text-secondary font-lufga'>${formatNumber(98915548, 2)}</p>
                                        <p className='text-secondary/40 text-sm font-lufga'>Supply Value</p>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='w-full py-6 bg-[#071311] rounded-2xl flex flex-col justify-center items-center gap-2'>
                                        <p className='text-success font-lufga'>{84.28}%</p>
                                        <p className='text-secondary/40 text-sm font-lufga'>APY</p>
                                    </div>
                                    <div className='w-full py-6 bg-[#071311] rounded-2xl flex flex-col justify-center items-center gap-2'>
                                        <p className='text-secondary font-lufga'>9x</p>
                                        <p className='text-secondary/40 text-sm font-lufga'>Laverage</p>
                                    </div>
                                </div>
                                <div className='w-full p-5 bg-[#071311] rounded-2xl'>
                                    <div className='flex items-center justify-between bg-[#081916] rounded-md px-4 p-2 mb-4'>
                                        <div className='flex gap-3 items-center p-3'>
                                            <img
                                                src={pairs.find(item => item.id == selectedPair)?.token1.icon}
                                                height={'30px'}
                                                width={'30px'}
                                                alt='coinIcon'
                                            />
                                            <p className='text-base text-[#CAEAE566] w-[120px]'>
                                                <input
                                                    type='number'
                                                    className='form-control-plaintext text-xl text-secondary/40 border-0 p-0 text-left min-w-[120px]'
                                                    value={amount}
                                                    onChange={(e) => {
                                                        setAmount(Number(e.target.value) >= availableAmount
                                                            ? availableAmount
                                                            : Number(e.target.value))
                                                    }}
                                                    style={{
                                                        background: 'transparent',
                                                        outline: 'none',
                                                        boxShadow: 'none',
                                                        width: 'auto',
                                                        minWidth: '50px',
                                                    }}
                                                />
                                            </p>
                                        </div>
                                        <div className='bg-primary px-4 py-3 rounded'>
                                            <button
                                                className='text-base text-[#CAEAE566]'
                                                onClick={() => {
                                                    setAmount(availableAmount);
                                                }}
                                            >
                                                MAX
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center mb-4'>
                                        <p className='text-base font-lufga text-[#797979]'>
                                            Type
                                        </p>
                                        <p className='text-base font-lufga text-secondary'>
                                            {availableAmount}
                                        </p>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <button
                                            onClick={() => { }}
                                            className='border-success border-2 w-full p-4 rounded-xl mt-4 font-lufga active:scale-95 duration-200'
                                        >
                                            <p className='text-success font-extrabold'>Add Position</p>
                                        </button>
                                        <button
                                            onClick={() => { }}
                                            className='border-error border-2 w-full p-4 rounded-xl mt-4 font-lufga active:scale-95 duration-200'
                                        >
                                            <p className='text-error font-extrabold'>Remove Position</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className=''>
                            <div className='mt-4 flex justify-between items-center'>
                                <p className='text-secondary text-opacity-40 text-sm font-lufga'>Pairs</p>
                                <p className='text-secondary text-opacity-40 text-sm font-lufga'>Position Value</p>
                            </div>
                            <div className='flex flex-col max-h-[400px] overflow-auto'>
                                {
                                    pairs.map((item) => (
                                        <button className='flex justify-between items-center py-3 border-b-[1px] border-[#212325] hover:bg-secondary/10'
                                            key={item.id}
                                            onClick={() => setSelectedPair(item.id)}>
                                            <div className='flex gap-2 items-center'>
                                                <div className='flex -space-x-3'>
                                                    <img className='w-10 h-10 object-cover rounded-full' src={item.token1.icon} alt="token" />
                                                    <img className='w-10 h-10 object-cover rounded-full' src={item.token2.icon} alt="token" />
                                                </div>
                                                <div className='text-left'>
                                                    <p className='text-secondary font-lufga'>{item.token1.name}/{item.token2.name}</p>
                                                    <p className='text-success font-lufga'>APY: {item.apy}</p>
                                                </div>
                                            </div>
                                            <p className='text-secondary font-lufga'>{formatNumber(item.value, 2)}</p>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                }
            </div >
        </>
    );
}

export default MyPositions;
