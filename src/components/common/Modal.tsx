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
  useWaitForTransactionReceipt,
} from 'wagmi';

import { ModalProps } from '../../utils/types';
import {
  contracts,
  tokenNameMap,
  tokenDecimalsMap,
  iconsMap,
  wrappedTokens,
} from '../../utils/config';

import { getErrorMessage } from '../../utils/constants/errorCodes';

import {
  getTokenPrecision,
  calculateAvailableBalance,
  calculatePredictedHealthFactor,
} from '../../utils/user/core/functions/utils';

import { useProtocolPriceData } from '../../utils/protocol/core/prices';
import { useProtocolInterestRate } from '../../utils/protocol/core/interestRates';
import { useProtocolAssetReserveData } from '../../utils/protocol/core/reserves';

import {
  useUserPositionsData,
  useUserAccountData,
} from '../../utils/user/core/positions';
import {
  useUserWrappedTokenAllowanceData,
  useUserAllowance,
  useUserTokenBalance,
} from '../../utils/user/wallet';
import { wrappedTokenAction } from '../../utils/user/core/functions/wrappedEth';
import { protocolAction } from '../../utils/user/core/functions/actions';

import { useProtocolReservesData } from '../../utils/protocol/core/reserves';

import AnimateModal, {
  AnimateModalProps,
} from '../../components/markets/AnimateModal';
type AnimateModalStatus = AnimateModalProps & {
  isOpen: boolean;
};

function Modal({ token, modalType, onClose }: ModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const percentList = [25, 50, 75, 100];

  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const [predictedHealth, setPredictedHealth] = useState<number>(0);
  const [useMaxAmount, setUseMaxAmount] = useState(false);
  const [isTxPending, setIsTxPending] = useState(false);
  const [buttonText, setButtonText] = useState(capitalizeString(modalType));
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [lastConfirmedTxHash, setLastConfirmedTxHash] = useState<string>('');

  const [animateModalStatus, setAnimateModalStatus] =
    useState<AnimateModalStatus>({
      isOpen: false,
      type: 'completed',
      actionType: 'supply',
      txLink: '',
      extraDetails: '',
      onClick: undefined,
    });

  const openAnimateModal = (
    type: 'loading' | 'completed' | 'failed',
    actionType: 'supply' | 'borrow' | 'repay' | 'withdraw' | 'approve',
    txLink?: string,
    extraDetails?: string,
  ) => {
    setAnimateModalStatus({
      isOpen: true,
      type: type,
      actionType: actionType,
      txLink: txLink,
      extraDetails: extraDetails,
      onClick: () =>
        setAnimateModalStatus((prevState) => ({
          ...prevState,
          isOpen: false,
        })),
    });
  };

  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const { data: hash, writeContractAsync, error } = useWriteContract();
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

  const { userAccountData } = useUserAccountData(address);
  const protocolAssetReserveData = useProtocolAssetReserveData(token);

  const userPositionsData = useUserPositionsData(isConnected, address);
  const assetReserveData = useProtocolAssetReserveData(token);

  const txReceiptResult = useWaitForTransactionReceipt({
    hash: hash,
  });

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

  const parseErrorMsg = (errorMessage: string) => {
    if (!errorMessage) return '';

    return errorMessage.includes('Contract Call')
      ? errorMessage.split('Contract Call')[0] +
          (errorMessage
            .split('Contract Call')[0]
            .includes('reverted with the following reason:')
            ? `(${getErrorMessage(errorMessage.split('Contract Call')[0].split('reverted with the following reason:')[1].trim())})`
            : '')
      : getErrorMessage(errorMessage.split('Request Arguments')[0]) !=
          'ERROR_MESSAGE_NOT_FOUND'
        ? getErrorMessage(errorMessage.split('Request Arguments')[0])
        : (errorMessage.split('Request Arguments')[0] as unknown as string);
  };

  useEffect(() => {
    if (isTxPending) {
      //TODO: add loading icon
      setButtonText('Sending transaction...');
      openAnimateModal(
        'loading',
        modalType.toLowerCase() as
          | 'supply'
          | 'borrow'
          | 'repay'
          | 'withdraw'
          | 'approve',
        '',
        '',
      );
    } else {
      setButtonText(getButtonText());
    }
  }, [isTxPending]);

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

  useEffect(() => {
    if (error?.message) {
      setErrorMsg(error?.message);
      openAnimateModal(
        'failed',
        modalType.toLowerCase() as
          | 'supply'
          | 'borrow'
          | 'repay'
          | 'withdraw'
          | 'approve',
        '',
        parseErrorMsg(error?.message),
      );
    }
  }, [error?.message]);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setErrorMsg(null);
      }, 4000);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (
      txReceiptResult.data &&
      txReceiptResult.data.status == 'success' &&
      txReceiptResult.data.transactionHash != lastConfirmedTxHash
    ) {
      setLastConfirmedTxHash(txReceiptResult.data.transactionHash);
      openAnimateModal(
        'completed',
        modalType.toLowerCase() as
          | 'supply'
          | 'borrow'
          | 'repay'
          | 'withdraw'
          | 'approve',
        'https://testnet.purrsec.com/tx/' +
          txReceiptResult.data.transactionHash,
        '',
      );
    }
  }, [txReceiptResult]);

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

    setIsTxPending(true);
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
      setIsTxPending(false);
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
    setIsTxPending(false);
    setAllowance(amount);
    console.log(hash);
  };

  useEffect(() => {
    setButtonText(getButtonText());
  }, [modalType, allowance, amount]);

  const getButtonText = () => {
    return modalType == 'supply' || modalType == 'repay'
      ? wrappedTokens.includes(token)
        ? capitalizeString(modalType)
        : allowance >= amount
          ? capitalizeString(modalType)
          : 'Approve'
      : modalType == 'borrow' && wrappedTokens.includes(token)
        ? Number(dTokenAllowance) / Math.pow(10, 18) >= amount
          ? capitalizeString(modalType)
          : 'Approve'
        : capitalizeString(modalType);
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
            {/* {errorMsg ? (
              <div className='flex justify-between mb-2'>
                <p className='font-lufga font-light text-xs text-[#FF0000] mt-2'>
                  {
                    parseErrorMsg(errorMsg)
                  }
                </p>
              </div>
            ) : (
              ''
            )} */}
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
            {buttonText}
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
        {animateModalStatus.isOpen && (
          <AnimateModal
            type={animateModalStatus.type}
            actionType={animateModalStatus.actionType}
            txLink={animateModalStatus.txLink}
            extraDetails={animateModalStatus.extraDetails}
            onClick={animateModalStatus.onClick}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default Modal;
