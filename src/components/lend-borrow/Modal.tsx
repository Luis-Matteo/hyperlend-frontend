import { useState, useEffect } from 'react'
import xmarkIcon from '../../assets/icons/xmark-icon.svg'
import gearIcon from '../../assets/icons/gear-icon.svg'
import { formatNumber } from '../../utils/functions';
import ProgressBar from '../common/PercentBar';

import PoolAbi from "../../abis/PoolAbi.json"

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { erc20Abi } from 'viem'

interface ModalProps {
    token: string,
    onClose: () => void;
}

import { contracts, assetAddresses, tokenNameMap, tokenDecimalsMap, iconsMap, ltvMap } from '../../utils/tokens';
import { getInterestRate } from '../../utils/protocolState';

function Modal({ token, onClose }: ModalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const percentList = [25, 50, 75, 100]

    const [availableBalance, setAvailableBalance] = useState<number>(0)
    const [allowance, setAllowance] = useState<number>(0)

    const { supplyInterest } = getInterestRate()

    const { data: hash, writeContractAsync } = useWriteContract()
    const { address, isConnected } = useAccount();
    const { data: userWalletBalance } = useReadContract(
      isConnected && address
      ?
      {
        abi: erc20Abi,
        address: token,
        functionName: 'balanceOf',
        args: [address],
      } as any : undefined
    );

    const { data: userAllowance } = useReadContract(
      isConnected && address
      ?
      {
        abi: erc20Abi,
        address: token,
        functionName: 'allowance',
        args: [address, contracts.pool],
      } as any : undefined
    );

    useEffect(() => {
        if (userWalletBalance) {
          setAvailableBalance(Number(userWalletBalance as any) / Math.pow(10, tokenDecimalsMap[token]));
        }
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(Number(event.target.value));
        setAmount(availableBalance / 100 * Number(event.target.value))
        setAvailableBalance(Number(userWalletBalance as any) / Math.pow(10, tokenDecimalsMap[token]));
        setAllowance(Number(userAllowance as any) / Math.pow(10, tokenDecimalsMap[token]))
    };

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const supplyTransaction = () => {
      const bgIntAmount = parseFloat((amount * Math.pow(10, tokenDecimalsMap[token])).toString()).toFixed(0).toString() as any as bigint

      if (allowance < amount){
        writeContractAsync({
          address: token as any,
          abi: erc20Abi,
          functionName: 'approve',
          args: [contracts.pool, bgIntAmount],
        })
        setAllowance(Number(amount) / Math.pow(10, tokenDecimalsMap[token]))
      }

      writeContractAsync({
        address: contracts.pool,
        abi: PoolAbi,
        functionName: 'supply',
        args: [token,amount, address, 0],
      })
    }

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
                            <img src={iconsMap[tokenNameMap[token]]} width="30px" height="30px" alt=""/>
                            <div className=''>
                                <p className='text-white font-lufga'>{tokenNameMap[token]}</p>
                                <p className='text-success text-xs font-lufga'>{supplyInterest[token]}% APY</p>
                            </div>
                        </div>
                        <p className='text-xl text-secondary'>
                            {formatNumber(amount, 2)}
                        </p>
                    </div>
                    <div className='flex gap-14'>
                        <p className='text-[#797979] text-xs font-lufga'>Wallet: {formatNumber(availableBalance, 2)} {tokenNameMap[token]}</p>
                        <ul className='flex gap-2 items-center'>
                            {
                                percentList.map((item) => (
                                    <button className='px-2 py-0.5 bg-[#081916] rounded-full'
                                        key={item}
                                        onClick={() => setAmount(availableBalance / 100 * item)}>
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
                        <p className="font-lufga font-light text-[#797979]">${formatNumber(availableBalance, 2)}</p>
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
                <button className='w-full py-4 bg-secondary font-lufga rounded-xl font-bold mb-3'
                onClick={
                () => {
                   supplyTransaction()
                }
                }>
                    {allowance >= amount ? "Supply" : "Approve"}
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
                        <p className='font-lufga text-white text-xs'>0 {tokenNameMap[token]}</p>
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