import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import xmarkIcon from '../../assets/icons/xmark-icon.svg';
import { formatNumber, capitalizeString } from '../../utils/functions';
import ProgressBar from '../common/PercentBar';
import {
  useAccount,
  useWriteContract,
  useBalance,
  usePublicClient,
} from 'wagmi';

import { ModalProps } from '../../utils/types';
import {
  contracts,
  tokenNameMap,
  tokenDecimalsMap,
  iconsMap,
  wrappedTokens,
} from '../../utils/config';

import {
  getTokenPrecision,
  calculateAvailableBalance,
  calculatePredictedHealthFactor,
} from '../../utils/user/functions/utils';

import { useProtocolPriceData } from '../../utils/protocol/prices';
import { useProtocolInterestRate } from '../../utils/protocol/interestRates';
import { useProtocolAssetReserveData } from '../../utils/protocol/reserves';

import {
  useUserPositionsData,
  useUserAccountData,
} from '../../utils/user/positions';
import {
  useUserWrappedTokenAllowanceData,
  useUserAllowance,
  useUserTokenBalance,
} from '../../utils/user/wallet';
import { wrappedTokenAction } from '../../utils/user/functions/wrappedEth';
import { protocolAction } from '../../utils/user/functions/actions';

import { useProtocolReservesData } from '../../utils/protocol/reserves';

function Modal({ token, modalType, onClose }: ModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const percentList = [25, 50, 75, 100];

  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const [predictedHealth, setPredictedHealth] = useState<number>(0);
  const [useMaxAmount, setUseMaxAmount] = useState(false);

  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();
  const { data: userEthBalance } = useBalance({ address: address });

  const { data: userWalletTokenBalance } = useUserTokenBalance(
    isConnected,
    token,
    address,
  );
  const userAllowance = useUserAllowance(
    isConnected,
    token,
    address || '0x0000000000000000000000000000000000000000',
    contracts.pool,
  );
  const { hTokenAllowance, dTokenAllowance } = useUserWrappedTokenAllowanceData(
    address || '0x0000000000000000000000000000000000000000',
    contracts.wrappedTokenGatewayV3,
  );

  const { priceDataMap } = useProtocolPriceData();
  const { interestRateDataMap } = useProtocolInterestRate();
  const { reserveDataMap } = useProtocolReservesData();

  const { userAccountData, refetch: refetchUserAccountData } =
    useUserAccountData(address);
  const protocolAssetReserveData = useProtocolAssetReserveData(token);

  const userPositionsData = useUserPositionsData(isConnected, address);
  const assetReserveData = useProtocolAssetReserveData(token);

  console.log(userAccountData)

  const updateAvailableAmount = () => {
    const avBalance = calculateAvailableBalance(
      token,
      userPositionsData,
      userAccountData,
      priceDataMap,
      protocolAssetReserveData,
      reserveDataMap,
      userEthBalance,
      userWalletTokenBalance,
      modalType,
    );
    setAvailableBalance(avBalance);
  };

  useEffect(() => {
    updateAvailableAmount();
  }, [userWalletTokenBalance, userEthBalance]);

  useEffect(() => {
    if (amount != 0) {
      const newHealth = calculatePredictedHealthFactor(
        token,
        amount,
        modalType,
        priceDataMap,
        userPositionsData,
      );
      setPredictedHealth(newHealth);
    }
  }, [amount]);

  useEffect(() => {
    setUseMaxAmount(progress == 100);
  }, [progress]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(event.target.value));
    setAmount((availableBalance / 100) * parseFloat(event.target.value));

    setAllowance(
      Number(userAllowance as any) / Math.pow(10, tokenDecimalsMap[token]),
    );
    updateAvailableAmount();
  };

  const handleDirectInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let inputValue = parseFloat(event.target.value) as any;
    if (!isNaN(inputValue)) {
      setAmount(inputValue <= availableBalance ? inputValue : availableBalance);
      setProgress(
        inputValue >= availableBalance
          ? 100
          : (inputValue / availableBalance) * 100,
      );

      setAllowance(
        Number(userAllowance as any) / Math.pow(10, tokenDecimalsMap[token]),
      );
      updateAvailableAmount();
    }
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const sendTransaction = async () => {
    const bgIntAmount = parseFloat(
      (amount * Math.pow(10, tokenDecimalsMap[token])).toString(),
    )
      .toFixed(0)
      .toString() as any as bigint;

    if (wrappedTokens.includes(token)) {
      await wrappedTokenAction(
        modalType,
        token,
        bgIntAmount,
        address || '0x0000000000000000000000000000000000000000',
        hTokenAllowance,
        dTokenAllowance,
        writeContractAsync,
        publicClient,
        useMaxAmount,
      );
      return;
    }

    await protocolAction(
      modalType,
      token,
      address || '0x0000000000000000000000000000000000000000',
      allowance,
      amount,
      bgIntAmount,
      writeContractAsync,
      publicClient,
      useMaxAmount,
    );

    setAllowance(amount);
    console.log(hash);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClickOutside}
        className='fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm'
      >
        <motion.div
          initial={{ scale: 0, rotate: '12.5deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          exit={{ scale: 0, rotate: '0deg' }}
          className='px-6 py-4 bg-primary-light rounded-2xl'
        >
          <div className='flex justify-between items-center mb-6'>
            <p className='font-lufga font-light text-[#797979]'>
              You {capitalizeString(modalType)}
            </p>
            <button className='' onClick={onClose}>
              <img src={xmarkIcon} alt='close' />
            </button>
          </div>
          <div className='px-6 py-4 bg-[#050F0D] rounded-2xl flex flex-col gap-4 mb-5'>
            <div className='flex justify-between items-center'>
              <div className='flex gap-2 items-center'>
                <img
                  src={iconsMap[tokenNameMap[token]]}
                  width='30px'
                  height='30px'
                  alt=''
                />
                <div className=''>
                  <p className='text-white font-lufga'>{tokenNameMap[token]}</p>
                  <p className='text-success text-xs font-lufga'>
                    {modalType == 'supply' || modalType == 'withdraw'
                      ? formatNumber(
                          interestRateDataMap[token].supply,
                          getTokenPrecision(token, priceDataMap),
                        )
                      : formatNumber(
                          interestRateDataMap[token].borrow,
                          getTokenPrecision(token, priceDataMap),
                        )}
                    % APY
                  </p>
                </div>
              </div>
              <input
                type='number'
                className='form-control-plaintext text-xl text-secondary border-0 p-0 text-right'
                value={amount}
                onChange={(e) => {
                  handleDirectInputChange(e);
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
            <div className='flex gap-14'>
              <p className='text-[#797979] text-xs font-lufga'>
                {modalType == 'supply'
                  ? 'Wallet'
                  : modalType == 'borrow'
                    ? 'Available'
                    : modalType == 'repay'
                      ? 'Position'
                      : modalType == 'withdraw'
                        ? 'Position'
                        : ''}
                :{' '}
                {formatNumber(
                  availableBalance,
                  getTokenPrecision(token, priceDataMap),
                )}{' '}
                {tokenNameMap[token]}
              </p>
              <ul className='flex gap-2 items-center'>
                {percentList.map((item) => (
                  <button
                    className='px-2 py-0.5 bg-[#081916] rounded-full'
                    key={item}
                    onClick={() => {
                      setAmount((availableBalance / 100) * item);
                      setProgress(item);
                    }}
                  >
                    <p className='text-[#797979] text-xs font-lufga'>
                      {item === 100 ? 'MAX' : `${item}%`}
                    </p>
                  </button>
                ))}
              </ul>
            </div>
          </div>
          <div className='mb-6'>
            <div className='flex justify-between mb-2'>
              <p className='font-lufga font-light text-[#797979]'>Available</p>
              <p className='font-lufga font-light text-[#797979]'>
                {formatNumber(
                  availableBalance,
                  getTokenPrecision(token, priceDataMap),
                )}
              </p>
            </div>
            <div className='relative '>
              <ProgressBar
                progress={progress}
                control={true}
                className='h-1.5'
              />
              <input
                type='range'
                min='0'
                max='100'
                value={progress}
                onChange={handleInputChange}
                className='w-full top-0 left-0 absolute opacity-0 cursor-pointer'
              />
            </div>
          </div>
          <button
            className='w-full py-4 bg-secondary font-lufga rounded-xl font-bold mb-6'
            onClick={() => {
              sendTransaction();
            }}
          >
            {modalType == 'supply' || modalType == 'repay'
              ? wrappedTokens.includes(token)
                ? capitalizeString(modalType)
                : allowance >= amount
                  ? capitalizeString(modalType)
                  : 'Approve'
              : modalType == 'borrow' && wrappedTokens.includes(token)
                ? Number(dTokenAllowance) / Math.pow(10, 18) >= amount
                  ? capitalizeString(modalType)
                  : 'Approve'
                : capitalizeString(modalType)}
          </button>
          {/* <div className='flex justify-end mb-6'>
            <button className='px-3 py-1.5 flex gap-2 items-center bg-[#050F0D] rounded-full'>
              <img src={gearIcon} alt="" />
              <p className='uppercase text-[#797979]'>settings</p>
            </button>
          </div> */}
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between'>
              <p className='font-lufga text-[#797979] text-xs'>
                {modalType == 'supply' ? 'Supply' : 'Borrow'} APY
              </p>
              <p className='font-lufga text-white text-xs'>
                {modalType == 'supply'
                  ? formatNumber(interestRateDataMap[token].supply, 2)
                  : formatNumber(interestRateDataMap[token].borrow, 2)}
                %
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='font-lufga text-[#797979] text-xs'>Health Factor</p>
              <p className='font-lufga text-warning text-xs'>
                {predictedHealth
                  ? formatNumber(userPositionsData?.healthFactor || 0, 2) +
                    ' → ' +
                    formatNumber(predictedHealth, 2)
                  : formatNumber(userPositionsData?.healthFactor || 0, 2)}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='font-lufga text-[#797979] text-xs'>Liquidity</p>
              <p className='font-lufga text-white text-xs'>
                {formatNumber(
                  Number(assetReserveData.totalAToken) /
                    Math.pow(10, tokenDecimalsMap[token]),
                  getTokenPrecision(token, priceDataMap),
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='font-lufga text-[#797979] text-xs'>Type</p>
              <p className='font-lufga text-white text-xs'>Global pool</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Modal;
