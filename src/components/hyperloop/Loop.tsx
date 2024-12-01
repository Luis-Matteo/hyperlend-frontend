import { useState } from 'react';
import ProgressBar from '../../components/common/PercentBar';
import Button from '../../components/common/Button';
import gearIcon from '../../assets/icons/gear-icon.svg';
import ethIcon from '../../assets/icons/coins/eth-icon.svg';
import wbtcIcon from '../../assets/icons/coins/wbtc-icon.svg';
import { useNavigate } from 'react-router-dom';
import rightArrowSuccessIcon from '../../assets/icons/right-arrow-success.svg';
import rightArrowWarningIcon from '../../assets/icons/right-arrow-warning.svg';
import downArrowIcon from '../../assets/icons/down-arrow.svg';
import redStoneLogo from '../../assets/icons/red-stone-logo.svg';

const tokenList = [
    {
        id: 'eth',
        title: 'ETH',
        icon: ethIcon,
        amount: 19.99,
    },
    {
        id: 'btc',
        title: 'BTC',
        icon: wbtcIcon,
        amount: 19.99,
    },
];

function Loop() {
    const navigate = useNavigate();
    const availableLeverage = 1505;
    const [deposit, setDeposit] = useState<number>(0);
    const [selectedDepositToken, setSelectedDepositToken] = useState<any>(null);
    const [selectedBorrowToken, setSelectedBorrowToken] = useState<any>(null);
    const [depositOpen, setDepositOpen] = useState<boolean>(false);
    const [borrowOpen, setBorrowOpen] = useState<boolean>(false);
    const [borrow, setBorrow] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [leverage, setLeverage] = useState<number>(0);
    const handleProgessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(Number(e.target.value));
        setLeverage(availableLeverage * Number(e.target.value) / 100);
    };
    const details = selectedBorrowToken && selectedDepositToken;
    return (
        <>
            <p className='text-secondary font-lufga mt-10'>Your deposit</p>
            <div className='flex items-center justify-between bg-[#071311] rounded-md px-4 py-2 mt-4 mb-4'>
                <div className='flex gap-3 items-center p-3 w-[100px]'>
                    <input
                        type='number'
                        className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left '
                        value={deposit}
                        step={0.01}
                        min={0}
                        onChange={(e) => {
                            setDeposit(Number(e.target.value));
                        }}
                        style={{
                            background: 'transparent',
                            outline: 'none',
                            boxShadow: 'none',
                            width: 'auto',
                            minWidth: '50px',
                        }}
                    />
                </div>
                <div className='relative w-[175px] bg-[#081916] rounded-sm'>
                    <button
                        className='w-full flex justify-between items-center px-6 text-base h-[54px] rounded-sm text-[#CAEAE566]'
                        onClick={() => setDepositOpen((prev) => !prev)}
                    >
                        {selectedDepositToken ? (
                            <div className='flex gap-4 items-center'>
                                <img className='w-6 h-6 ' src={selectedDepositToken.icon} />
                                <div className='flex flex-col w-full'>
                                    <p className='text-secondary font-lufga'>
                                        {selectedDepositToken.title}
                                    </p>
                                    <p className='text-success font-lufga text-[13px]'>
                                        {selectedDepositToken.amount}%
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='flex justify-center items-center gap-4'>
                                <p className='text-secondary font-lufga'>Select Token</p>
                            </div>
                        )}
                        <img
                            className={`w-6 transition-all duration-300 ${depositOpen ? 'rotate-180' : ''}`}
                            src={downArrowIcon}
                            alt='downArrow'
                        />
                    </button>
                    {depositOpen && (
                        <div
                            className={`absolute w-full z-10 left-0 top-[54px] bg-[#0D1414] py-3 rounded-md
                      ${depositOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
                        >
                            {tokenList.map((item, index) => (
                                <button
                                    className='flex gap-2 px-5 w-full py-1.5 bg-[#0D1414] hover:bg-[#1b332f]'
                                    key={`depositToken${index}`}
                                    onClick={() => {
                                        setSelectedDepositToken(item);
                                        setDepositOpen(false);
                                    }}
                                >
                                    <img className='w-6 h-6 ' src={item.icon} />
                                    <div className='flex justify-between w-full'>
                                        <p className='text-secondary font-lufga'>{item.title}</p>
                                        <p className='text-success font-lufga text-[13px]'>
                                            {item.amount}%
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <p className='text-secondary font-lufga mt-10'>Your borrow</p>
            <div className='flex items-center justify-between bg-[#071311] rounded-md px-4 py-2 mt-4 mb-4'>
                <div className='flex gap-3 items-center p-3 w-[100px]'>
                    <input
                        type='number'
                        className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left '
                        value={borrow}
                        step={0.01}
                        min={0}
                        onChange={(e) => {
                            setBorrow(Number(e.target.value));
                        }}
                        style={{
                            background: 'transparent',
                            outline: 'none',
                            boxShadow: 'none',
                            width: 'auto',
                            minWidth: '50px',
                        }}
                    />
                </div>
                <div className='relative w-[175px] bg-[#081916] rounded-sm'>
                    <button
                        className='w-full flex justify-between items-center px-6 text-base h-[54px] rounded-sm text-[#CAEAE566]'
                        onClick={() => setBorrowOpen((prev) => !prev)}
                    >
                        {selectedBorrowToken ? (
                            <div className='flex gap-4 items-center'>
                                <img className='w-6 h-6 ' src={selectedBorrowToken.icon} />
                                <div className='flex flex-col w-full'>
                                    <p className='text-secondary font-lufga'>
                                        {selectedBorrowToken.title}
                                    </p>
                                    <p className='text-success font-lufga text-[13px]'>
                                        {selectedBorrowToken.amount}%
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='flex justify-center items-center gap-4'>
                                <p className='text-secondary font-lufga'>Select Token</p>
                            </div>
                        )}
                        <img
                            className={`w-6 transition-all duration-300 ${borrowOpen ? 'rotate-180' : ''}`}
                            src={downArrowIcon}
                            alt='downArrow'
                        />
                    </button>
                    {borrowOpen && (
                        <div
                            className={`absolute w-full z-10 left-0 top-[54px] bg-[#0D1414] py-3 rounded-md
                      ${borrowOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
                        >
                            {tokenList.map((item, index) => (
                                <button
                                    className='flex gap-2 px-5 w-full py-1.5 bg-[#0D1414] hover:bg-[#1b332f]'
                                    key={`borrowToken${index}`}
                                    onClick={() => {
                                        setSelectedBorrowToken(item);
                                        setBorrowOpen(false);
                                    }}
                                >
                                    <img className='w-6 h-6 ' src={item.icon} />
                                    <div className='flex justify-between w-full'>
                                        <p className='text-secondary font-lufga'>{item.title}</p>
                                        <p className='text-success font-lufga text-[13px]'>
                                            {item.amount}%
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className='relative my-10 '>
                <div className='flex justify-between items-center'>
                    <p className='font-lufga text-[#797979]'>Leverage Slider {leverage}</p>
                    <p className='font-lufga text-[#797979]'>
                        MAX: <span className='text-secondary'>{availableLeverage}</span>
                    </p>
                </div>
                <div className='relative my-2 '>
                    <ProgressBar progress={progress} control={true} className='h-1.5' />
                    <input
                        type='range'
                        min='0'
                        max='100'
                        value={progress}
                        onChange={handleProgessChange}
                        className='w-full top-0 left-0 absolute opacity-0 cursor-pointer'
                    />
                </div>
            </div>
            <Button title='Supply' />
            <div className='flex justify-end mt-6'>
                <button
                    className='px-3 py-1.5 flex gap-2 items-center bg-[#050F0D] rounded-full'
                    onClick={() => navigate('/hyperloop/setting')}
                >
                    <img className='w-4' src={gearIcon} alt='setting' />
                    <p className='uppercase font-lufga text-[#797979]'>settings</p>
                </button>
            </div>
            {
                details &&
                <div className='flex flex-col gap-4 mt-6'>
                    <div className='flex justify-between items-center'>
                        <p className='text-base font-lufga text-[#797979]'>
                            Price impact
                        </p>
                        <p className='text-base font-lufga text-warning'>
                            0.00%
                        </p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='text-base font-lufga text-[#797979]'>
                            Price impact
                        </p>
                        <p className='text-base font-lufga text-secondary'>
                            0.00%
                        </p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='text-base font-lufga text-[#797979]'>
                            Health
                        </p>
                        <div className='flex items-center gap-2 text-success'>
                            <p className='text-base font-lufga'>
                                0.00%
                            </p>
                            <img className='w-4 text-success' src={rightArrowSuccessIcon} alt='rightArrow' />
                            <p className='text-base font-lufga'>
                                0.00%
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='text-base font-lufga text-[#797979]'>
                            Liquidation price
                        </p>
                        <div className='flex items-center gap-2 text-warning'>
                            <p className='text-base font-lufga'>
                                0.00%
                            </p>
                            <img className='w-4 text-success' src={rightArrowWarningIcon} alt='rightArrow' />
                            <p className='text-base font-lufga'>
                                0.00%
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='text-base font-lufga text-[#797979]'>
                            Type
                        </p>
                        <p className='text-base font-lufga text-secondary'>
                            0.00%
                        </p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='text-base font-lufga text-[#797979]'>
                            Type
                        </p>
                        <div className='flex items-center gap-2 text-secondary'>
                            <img className='h-6' src={redStoneLogo} alt='redStone' />
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Loop;
