import { useEffect } from "react";
import CardItem from "../../components/common/CardItem";
import { formatUnit } from "../../utils/functions";
import {
    networkChainId,
} from '../../utils/config';

import { useAccount, useSwitchChain } from "wagmi";
import { ModalType } from "../../utils/types";
import { mockIsolatedMarkets } from "../../utils/mocks/markets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tableVariants, itemVariants } from "../../utils/constants/effects";

interface CoreTableProps {
    stable: boolean;
    searchText: string;
    setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
    setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
    setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
}
function IsolatedTable({ }: CoreTableProps) {

    const account = useAccount();
    const { switchChain } = useSwitchChain()

    useEffect(() => {
        if (account.isConnected && account.chainId != networkChainId) {
            switchChain({ chainId: networkChainId });
        }
    }, [account]);


    return (
        <>
            <CardItem className='md:py-6 md:px-7 hidden xl:block'>
                <div className='w-full'>
                    <div className='py-3 px-2 border-y-[1px] bg-grey border-[#212325] flex justify-between xl:gap-2 2xl:gap-8'>
                        <div className='flex flex-1 items-center gap-2'>
                            <div className='text-white font-lufga text-[11px] w-[80px] 2xl:w-[120px]'>
                                Asset
                            </div>
                            <div className='text-white font-lufga text-[11px] w-[80px] 2xl:w-[120px]'>
                                Collateral
                            </div>
                            <div className="flex flex-1">
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[14%] text-center '>
                                    Total Assets
                                </p>
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[12%] text-center '>
                                    Supply APY
                                </p>
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[14%] text-center '>
                                    Total Borrowed
                                </p>
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[12%] text-center '>
                                    Borrow APY
                                </p>
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[16%] text-center '>
                                    Total Collateral
                                </p>
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[18%] text-center ' >
                                    Available Liquidity
                                </p>
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[8%] text-center '>
                                    Utilization
                                </p>
                                <p className='text-white font-lufga text-[11px] whitespace-nowrap w-[8%] text-center '>
                                    LTV
                                </p>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        className='lg:max-h-[calc(100vh-346px)] xl:max-h-[calc(100vh-394px)] h-full overflow-auto hidden xl:block'
                        variants={tableVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {(mockIsolatedMarkets || []).map((item, key) => (
                            <motion.div
                                variants={itemVariants}
                                className='flex justify-between items-center xl:gap-2 2xl:gap-8 py-[14px] px-2 border-b-[1px] border-[#212325] hover:bg-[#1F2A29] cursor-pointer'
                                key={key}
                            >
                                <Link
                                    className='flex flex-1 gap-2 items-center'
                                    to={`${item.underlyingAsset}?isolated=true`}
                                >
                                    <div className='flex items-center gap-2 h-full w-[80px] 2xl:w-[120px]'>
                                        <img
                                            src={item.assetIcon}
                                            alt='symbol'
                                            className='w-4 h-4 md:w-6 md:h-6'
                                        />
                                        <p className='text-xs md:text-base text-white font-lufga'>
                                            {item.assetSymbol}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2 h-full w-[80px] 2xl:w-[120px]'>
                                        <img
                                            src={item.collateralIcon}
                                            alt='symbol'
                                            className='w-4 h-4 md:w-6 md:h-6'
                                        />
                                        <p className='text-xs md:text-base text-white font-lufga'>
                                            {item.collateralSymbol}
                                        </p>
                                    </div>
                                    <div className="flex flex-1 items-center gap-2">
                                        <div className='text-white font-lufga w-[14%] flex justify-center'>
                                            <div className="text-sm">
                                                <p className=''>{formatUnit(item.totalAssets)}</p>
                                                <p className=''>${formatUnit(item.totalAssetsUsd)}</p>
                                            </div>
                                        </div>
                                        <div className='text-white font-lufga w-[12%] flex justify-center'>
                                            <div className="text-sm">
                                                <p className=''>{formatUnit(item.supplyApy)}</p>
                                                <p className=''>${formatUnit(item.supplyApyUsd)}</p>
                                            </div>
                                        </div>
                                        <div className='text-white font-lufga w-[14%] flex justify-center'>
                                            <div className="text-right text-sm">
                                                <p className=''>{formatUnit(item.totalBorrowed)}</p>
                                                <p className=''>${formatUnit(item.totalBorrowedUsd)}</p>
                                            </div>
                                        </div>
                                        <div className='font-lufga w-[12%] flex justify-center'>
                                            <p className='text-sm text-success'>{(item.borrowApy).toFixed(2)}%</p>
                                        </div>
                                        <div className='text-white font-lufga w-[16%] flex justify-center'>
                                            <div className="text-right text-sm">
                                                <p className=''>{formatUnit(item.totalCollateral)}</p>
                                                <p className=''>${formatUnit(item.totalCollateralUsd)}</p>
                                            </div>
                                        </div>
                                        <div className='text-white font-lufga w-[18%] flex justify-center'>
                                            <div className="text-right text-sm">
                                                <p className=''>{formatUnit(item.availableLiquidity)}</p>
                                                <p className=''>${formatUnit(item.availableLiquidityUsd)}</p>
                                            </div>
                                        </div>
                                        <div className='text-white font-lufga w-[8%] flex justify-center'>
                                            <p className='text-sm'>{item.utilization}%</p>
                                        </div>
                                        <div className='text-white font-lufga w-[8%] flex justify-center'>
                                            <p className='text-sm'>{item.ltv}%</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </CardItem>

            <motion.div
                className='xl:hidden w-full flex flex-col gap-4'
                variants={tableVariants}
                initial="hidden"
                animate="visible"
            >
                {(mockIsolatedMarkets || []).map((item, key) => (
                    <motion.div variants={itemVariants} key={key}>
                        <CardItem className=''>
                            <div
                                className='flex flex-col hover:bg-[#1F2A29] cursor-pointer rounded-t-2xl'
                            >
                                <div
                                    className={`flex items-center gap-8 h-full p-[20px] rounded-t-2xl bg-gradient-to-t from-transparent to-[#f7931a40]`}
                                >
                                    <div className="flex gap-2">
                                        <img src={item.assetIcon} alt='symbol' className='w-6 h-6' />
                                        <p className=' text-white font-lufga'>{item.assetSymbol}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <img src={item.collateralIcon} alt='symbol' className='w-6 h-6' />
                                        <p className=' text-white font-lufga'>{item.collateralSymbol}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-[30px] p-[24px] border-y-[1px] border-[#212325]'>
                                    <div className='grid grid-cols-2 gap-[30px]'>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                Supply APY
                                            </p>
                                            <p className='text-white font-medium font-lufga text-lg'>
                                                {formatUnit(item.supplyApy)}%
                                            </p>
                                        </div>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                Total Assets
                                            </p>
                                            <p className='text-white font-medium font-lufga text-lg'>
                                                {formatUnit(item.totalAssets)}{' '}
                                                <span className='text-[#B1B5C3] text-xs'>
                                                    ${formatUnit(item.totalAssetsUsd)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-[30px]'>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                Borrow APY
                                            </p>
                                            <p className='text-success font-medium font-lufga text-lg'>
                                                {formatUnit(item.borrowApy)}%
                                            </p>
                                        </div>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                Available Liquidity
                                            </p>
                                            <p className='text-white font-medium font-lufga text-lg'>
                                                {formatUnit(item.availableLiquidity)}{' '}
                                                <span className='text-[#B1B5C3] text-xs'>
                                                    ${formatUnit(item.availableLiquidityUsd)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-[30px]'>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                Supply APY
                                            </p>
                                            <p className='text-white font-medium font-lufga text-lg'>
                                                {formatUnit(item.supplyApy)}%
                                            </p>
                                        </div>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                Total Borrowed
                                            </p>
                                            <p className='text-white font-medium font-lufga text-lg'>
                                                {formatUnit(item.totalBorrowed)}{' '}
                                                <span className='text-[#B1B5C3] text-xs'>
                                                    ${formatUnit(item.totalBorrowedUsd)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-[30px]'>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                Utilization
                                            </p>
                                            <p className='text-white font-medium font-lufga text-lg'>
                                                {item.utilization}%
                                            </p>
                                        </div>
                                        <div className='flex flex-col gap-[14px]'>
                                            <p className='text-[#B1B5C3] font-lufga text-sm md:text-base '>
                                                LTV
                                            </p>
                                            <p className='text-white font-medium font-lufga text-lg'>
                                                {item.ltv}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='p-[24px]'>
                                <button
                                    className='w-full py-2 text-secondary font-lufga rounded-xl font-bold hover:text-gray underline'
                                >
                                    Details
                                </button>
                            </div>
                        </CardItem>
                    </motion.div>
                ))}
            </motion.div>
        </>
    )
}

export default IsolatedTable;