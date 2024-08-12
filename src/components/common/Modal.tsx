import { useState, useEffect } from 'react'
import xmarkIcon from '../../assets/icons/xmark-icon.svg'
import gearIcon from '../../assets/icons/gear-icon.svg'
import { formatNumber, capitalizeString } from '../../utils/functions';
import ProgressBar from '../common/PercentBar';
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { erc20Abi } from 'viem'

import { ModalProps, UserPositionsData } from '../../utils/types';
import { contracts, tokenNameMap, tokenDecimalsMap, iconsMap, abis, ltvMap } from '../../utils/tokens';

import { useProtocolReservesData, useProtocolInterestRate, useProtocolPriceData, useProtocolAssetReserveData } from '../../utils/protocolState';
import { useUserPositionsData } from '../../utils/userState' 

function Modal({ token, modalType, onClose }: ModalProps) {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract()

  const { data: userWalletBalance } = useReadContract(
    isConnected && address?
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

  /*
  supply:
    - selecting amount from wallet
  withdraw:
    - selecting amount from supply position
  borrow:
    - selecting amount from max available to borrow
  repay:
    - selecting amount from borrow position
  */

  const { reserveDataMap } = useProtocolReservesData()
  const { priceDataMap } = useProtocolPriceData()
  const { interestRateDataMap } = useProtocolInterestRate();

  const userPositionsData = useUserPositionsData();
  const assetReserveData  = useProtocolAssetReserveData(token)

  const [amount, setAmount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const percentList = [25, 50, 75, 100]

  const [availableBalance, setAvailableBalance] = useState<number>(0)
  const [allowance, setAllowance] = useState<number>(0)
  const [predictedHealth, setPredictedHealth] = useState<number>(0)

  const getBorrowLimit = () => {
    const tokenPriceUsd = Number(priceDataMap[token]) / Math.pow(10, 8)
    const borrowAvailableTokens = (userPositionsData?.totalBorrowLimit || 0) / tokenPriceUsd
    return borrowAvailableTokens;
  }

  const updateAvailableAmount = () => {
    const userTokenSuppliedPosition = userPositionsData?.supplied.find(e => e.underlyingAsset == token);
    const userTokenBorrowedPosition = userPositionsData?.borrowed.find(e => e.underlyingAsset == token);
    const userBorrowLimitToken = getBorrowLimit();

    switch(modalType){
      case "supply":
        const normalizedWalletBalance = (Number(userWalletBalance) / Math.pow(10, tokenDecimalsMap[token]))
        setAvailableBalance(normalizedWalletBalance)
        break;
      case "withdraw":
        setAvailableBalance(userTokenSuppliedPosition?.balance || 0)
        break;
      case "borrow":
        setAvailableBalance(userBorrowLimitToken)
        break;
      case "repay":
        setAvailableBalance(userTokenBorrowedPosition?.balance || 0)
        break;
    }
  }

  useEffect(() => {
    updateAvailableAmount();
  }, []);

  useEffect(() => {
    if (amount != 0){
      const tokenPriceUsd = Number(priceDataMap[token]) / Math.pow(10, 8)
      const amountUsd = amount * tokenPriceUsd
      //if we are borrowing/repaying, total borrow will change
      const newTotalBorrow = modalType == "borrow" || modalType == "repay" 
      ? ((userPositionsData?.totalBorrowUsd || 0) + amountUsd) : (userPositionsData?.totalBorrowUsd || 0)
      //if we are supplying/withdrawing, total borrow limit will change
      const newTotalBorrowLimit = modalType == "supply" || modalType == "withdraw" 
      ? ((userPositionsData?.totalBorrowLimit || 0) + (amountUsd * ltvMap[token])) : (userPositionsData?.totalBorrowLimit || 0)

      const newHealth = newTotalBorrowLimit / newTotalBorrow
      setPredictedHealth(newHealth)
    }
  }, [amount])

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

  const sendTransaction = () => {
    const bgIntAmount = parseFloat((amount * Math.pow(10, tokenDecimalsMap[token])).toString()).toFixed(0).toString() as any as bigint

    if (modalType == "supply"){
      if (allowance < amount){
        writeContractAsync({
          address: token as any,
          abi: erc20Abi,
          functionName: 'approve',
          args: [contracts.pool, bgIntAmount],
        })
        setAllowance(amount)
      }
    }

    const functionParams: any = {
      "supply": [token, bgIntAmount, address, 0], //asset, amount, onBehalfOf, refCode
      "withdraw": [token, bgIntAmount, address], //asset, amount, to
      "borrow": [token, bgIntAmount, 2, 0, address], //asset, amount, interestRateMode (2 = variable), refCode, onBehalfOf
      "repay": [token, bgIntAmount, 2, address] //asset, amount, interestRateMode, onBehalfOf
    }

    writeContractAsync({
      address: contracts.pool,
      abi: abis.pool,
      functionName: modalType,
      args: functionParams[modalType]
    })
  }

  return (
    <div
      onClick={handleClickOutside}
      className="fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm">
      <div className="px-6 py-4 bg-primary-light rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <p className="font-lufga font-light text-[#797979]">You {capitalizeString(modalType)}</p>
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
                <p className='text-success text-xs font-lufga'>{
                  modalType == "supply" || modalType == "withdraw" ? formatNumber(interestRateDataMap[token].supply, 2) : formatNumber(interestRateDataMap[token].borrow, 2)
                }% APY</p>
              </div>
            </div>
            <p className='text-xl text-secondary'>
              {formatNumber(amount, 2)}
            </p>
          </div>
          <div className='flex gap-14'>
            <p className='text-[#797979] text-xs font-lufga'>{
              modalType == "supply" ? "Wallet" : 
              modalType == "repay" ? "Position" : ""
            }: {formatNumber(availableBalance, 2)} {tokenNameMap[token]}</p>
            <ul className='flex gap-2 items-center'>
              {
                percentList.map((item) => (
                  <button className='px-2 py-0.5 bg-[#081916] rounded-full'
                    key={item}
                    onClick={() => {
                      setAmount(availableBalance / 100 * item)
                      setProgress(item)
                    }}>
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
            sendTransaction()
          }
        }>
          {allowance >= amount ? (modalType == "supply" ? "Supply" : "Repay") : "Approve"}
        </button>
        <div className='flex justify-end mb-6'>
          <button className='px-3 py-1.5 flex gap-2 items-center bg-[#050F0D] rounded-full'>
            <img src={gearIcon} alt="" />
            <p className='uppercase text-[#797979]'>settings</p>
          </button>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex justify-between'>
            <p className='font-lufga text-[#797979] text-xs'>{modalType == "supply" ? "Supply" : "Borrow"} APY</p>
            <p className='font-lufga text-white text-xs'>{modalType == "supply" ? formatNumber(interestRateDataMap[token].supply, 2) : formatNumber(interestRateDataMap[token].borrow, 2)}%</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-lufga text-[#797979] text-xs'>Health Factor</p>
            <p className='font-lufga text-warning text-xs'>{
              predictedHealth ? 
              formatNumber(userPositionsData?.healthFactor || 0, 2) + " → " + formatNumber(predictedHealth, 2)
              :
              formatNumber(userPositionsData?.healthFactor || 0, 2) 
            }</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-lufga text-[#797979] text-xs'>Pool size</p>
            <p className='font-lufga text-white text-xs'>{formatNumber(Number(assetReserveData.totalAToken) / Math.pow(10, tokenDecimalsMap[token]), 2)}</p>
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