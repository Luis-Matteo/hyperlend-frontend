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

import {
  tokenNameMap,
  tokenDecimalsMap,
  iconsMap,
  abis,
} from '../../utils/config';

import { getErrorMessage } from '../../utils/constants/errorCodes';

import { useUserTokenBalance } from '../../utils/user/wallet';

import AnimateModal, {
  AnimateModalProps,
} from '../../components/markets/AnimateModal';
type AnimateModalStatus = AnimateModalProps & {
  isOpen: boolean;
};

interface WrappedEthModalProps {
  token: string;
  modalType: string;
  onClose: () => void;
}

function WrappedEthModal({ token, modalType, onClose }: WrappedEthModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const percentList = [25, 50, 75, 100];

  const [availableBalance, setAvailableBalance] = useState<number>(0);
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
      onClick: () => {
        setAnimateModalStatus((prevState) => ({
          ...prevState,
          isOpen: false,
        }));
        if (type != 'failed') {
          onClose(); // Close the Modal when AnimateModal is done
        }
      },
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

  const txReceiptResult = useWaitForTransactionReceipt({
    hash: hash,
  });

  const updateAvailableAmount = () => {
    if (modalType == 'supply') {
      setAvailableBalance(Number(userEthBalance?.formatted) - 0.0002);
    } else {
      setAvailableBalance(Number(userWalletTokenBalance) / Math.pow(10, 18));
    }
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
    }
  }, [isTxPending]);

  useEffect(() => {
    updateAvailableAmount();
  }, [userWalletTokenBalance, userEthBalance]);

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

    if (amount == 0) {
      setErrorMsg('Amount should be greater than 0');
      return;
    }

    setIsTxPending(true);

    try {
      const txResult = await writeContractAsync({
        address: token as `0x${string}`,
        abi: abis.weth,
        functionName: modalType == 'supply' ? 'deposit' : 'withdraw',
        args: modalType == 'supply' ? [] : [bgIntAmount],
        value: modalType == 'supply' ? bgIntAmount : 0n,
      });
      await publicClient?.waitForTransactionReceipt({ hash: txResult });
    } catch (e) {
      console.log(e);
    }

    setIsTxPending(false);
    console.log(hash);
  };

  useEffect(() => {
    setButtonText(getButtonText());
  }, [modalType, amount]);

  const getButtonText = () => {
    return modalType == 'supply' ? 'Wrap ETH' : 'Unwrap WETH';
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
              {modalType == 'supply'
                ? 'Wrap ETH to WETH'
                : 'Unwrap WETH to ETH'}
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
                  <p className='text-white font-lufga'>
                    {modalType == 'supply' ? tokenNameMap[token] : 'WETH'}
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
                : {formatNumber(availableBalance, 6)}{' '}
                {modalType == 'supply' ? tokenNameMap[token] : 'WETH'}
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
            {errorMsg ? (
              <div className='flex justify-between mb-2'>
                <p className='font-lufga font-light text-xs text-[#FF0000] mt-2'>
                  {parseErrorMsg(errorMsg)}
                </p>
              </div>
            ) : (
              ''
            )}
            <div className='flex justify-between mb-2'>
              <p className='font-lufga font-light text-[#797979]'>Available</p>
              <p className='font-lufga font-light text-[#797979]'>
                {formatNumber(availableBalance, 6)}
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
        </motion.div>
        {animateModalStatus.isOpen && (
          <AnimateModal
            type={animateModalStatus.type}
            actionType={animateModalStatus.actionType}
            txLink={animateModalStatus.txLink}
            extraDetails={animateModalStatus.extraDetails}
            onClick={() => {
              setAnimateModalStatus((prevState) => ({
                ...prevState,
                isOpen: false,
              }));
              if (animateModalStatus.type != 'failed') {
                onClose(); // Close the Modal when AnimateModal is done
              }
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default WrappedEthModal;
