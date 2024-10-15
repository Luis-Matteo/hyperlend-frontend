import React, { useEffect, useState } from 'react';
import ProgressBar from '../common/PercentBar';
import Button from '../common/Button';
import { TokenActionsProps } from '../../utils/types';
import ToggleButton from '../common/ToggleButton';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from 'wagmi';

import shareIcon from '../../assets/icons/share-2.svg';
import ShareImageModal from '../common/ShareImageModal';

import { formatNumber } from '../../utils/functions';
import {
  iconsMap,
  tokenNameMap,
  tokenDecimalsMap,
  contracts,
  wrappedTokens,
} from '../../utils/config';
import {
  useUserAllowance,
  useUserWrappedTokenAllowanceData,
} from '../../utils/user/wallet';
import { getErrorMessage } from '../../utils/constants/errorCodes';
import { wrappedTokenAction } from '../../utils/user/functions/wrappedEth';
import {
  protocolAction,
  updateCollateralAction,
} from '../../utils/user/functions/actions';
import { getTokenPrecision } from '../../utils/user/functions/utils';
import { useProtocolPriceData } from '../../utils/protocol/prices';

const TokenActions: React.FC<TokenActionsProps> = ({
  availableAmountTitle,
  availableAmount,
  totalApy,
  percentBtn,
  protocolBalanceTitle,
  protocolBalance,
  dailyEarning,
  btnTitle,
  token,
  isCollateralEnabled,
  handleDataFromActions,
}) => {
  const actionType = btnTitle.toLowerCase();

  const [progress, setProgress] = useState<number>(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [buttonText, setButtonText] = useState(btnTitle);
  const [collateral, setCollateral] = useState(isCollateralEnabled);
  const [amount, setAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [isTxPending, setIsTxPending] = useState(false);
  const [useMaxAmount, setUseMaxAmount] = useState(false);
  const [shareImageModalStatus, setShareImageModalStatus] =
    useState<boolean>(false);

  const handleProgessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(event.target.value));
    setAmount((availableAmount * Number(event.target.value)) / 100);
  };

  const handleDirectInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAmount(
      Number(event.target.value) >= availableAmount
        ? availableAmount
        : Number(event.target.value),
    );
  };

  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const { data: hash, writeContractAsync, error } = useWriteContract();
  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const userAllowanceBn = useUserAllowance(
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

  useEffect(() => {
    setButtonText(btnTitle);
  }, [btnTitle]);

  useEffect(() => {
    if (isTxPending) {
      //TODO: add loading icon
      setButtonText('Sending transaction...');
    } else {
      handleDataFromActions('refetch');
      setButtonText(btnTitle);
    }
  }, [isTxPending]);

  useEffect(() => {
    if (error?.message) {
      setErrorMsg(error?.message);
    }
  }, [error?.message]);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setErrorMsg(null);
      }, 4000);
    }
  }, [errorMsg]);

  //check approval amount on changes
  useEffect(() => {
    if (actionType == 'supply' || actionType == 'repay') {
      const allowance =
        Number(userAllowance) / Math.pow(10, tokenDecimalsMap[token]);

      if (amount > allowance && !wrappedTokens.includes(token)) {
        setButtonText('Approve');
      } else {
        setButtonText(btnTitle);
      }
    }

    if (wrappedTokens.includes(token)) {
      if (
        actionType == 'withdraw' &&
        amount > Number(hTokenAllowance) / Math.pow(10, 18)
      ) {
        setButtonText('Approve');
      } else if (
        actionType == 'borrow' &&
        amount > Number(dTokenAllowance) / Math.pow(10, 18)
      ) {
        setButtonText('Approve');
      } else {
        setButtonText(btnTitle);
      }
    }
  }, [amount, btnTitle, hash, userAllowance, txReceipt]);

  //update progress & amount on changes
  useEffect(() => {
    setProgress(
      Number(amount) >= availableAmount
        ? 100
        : (Number(amount) / availableAmount) * 100,
    );
    if (amount >= availableAmount) {
      setAmount(availableAmount);
    }
  }, [amount, btnTitle, hash, userAllowance]);

  useEffect(() => {
    if ((userAllowanceBn as number) >= userAllowance)
      setUserAllowance(userAllowanceBn as number);
  }, [amount, userAllowanceBn]);

  useEffect(() => {
    setUseMaxAmount(progress == 100);
  }, [progress]);

  const sendTransaction = async () => {
    const bgIntAmount = parseFloat(
      (amount * Math.pow(10, tokenDecimalsMap[token])).toString(),
    )
      .toFixed(0)
      .toString() as any as bigint;

    setIsTxPending(true);
    if (wrappedTokens.includes(token)) {
      await wrappedTokenAction(
        actionType,
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
      actionType,
      token,
      address || '0x0000000000000000000000000000000000000000',
      Number(userAllowance) / Math.pow(10, tokenDecimalsMap[token]),
      amount,
      bgIntAmount,
      writeContractAsync,
      publicClient,
      useMaxAmount,
    );
    setIsTxPending(false);
  };

  const updateCollateral = async () => {
    setIsTxPending(true);
    await updateCollateralAction(
      token,
      collateral,
      writeContractAsync,
      publicClient,
    );
    setIsTxPending(false);
    setCollateral(!collateral);
    console.log(hash);
  };

  const setMaxAmount = () => {
    setAmount(availableAmount);
    setProgress(100);
  };

  const toggleModal = () => {
    setShareImageModalStatus(!shareImageModalStatus);
  };

  return (
    <>
      {btnTitle === 'Supply' && (
        <div className='flex justify-between items-center mt-4'>
          <p className='text-base text-[#CAEAE566]'>Collateral</p>
          <ToggleButton
            status={collateral}
            setStatus={setCollateral}
            onClick={updateCollateral}
          />
        </div>
      )}
      <div className='flex items-center justify-between bg-[#071311] rounded-md px-4 py-2 mt-4 mb-4'>
        <div className='flex gap-3 items-center p-3'>
          <img
            src={iconsMap[tokenNameMap[token]]}
            height={'30px'}
            width={'30px'}
            alt='coinIcon'
          />
          <p className='text-base text-[#CAEAE566] w-[120px]'>
            <input
              type='number'
              className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left min-w-[120px]'
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
          </p>
        </div>
        <div className='bg-[#081916] px-4 py-3 rounded'>
          <button
            className='text-base text-[#CAEAE566]'
            onClick={() => {
              setMaxAmount();
            }}
          >
            {percentBtn === 100 ? 'MAX' : `${percentBtn}% LIMIT`}
          </button>
        </div>
      </div>
      {errorMsg ? (
        <p className='text-xs text-[#FF0000] mt-2'>
          {errorMsg.includes('Contract Call')
            ? errorMsg.split('Contract Call')[0] +
              (errorMsg
                .split('Contract Call')[0]
                .includes('reverted with the following reason:')
                ? `(${getErrorMessage(errorMsg.split('Contract Call')[0].split('reverted with the following reason:')[1].trim())})`
                : '')
            : getErrorMessage(errorMsg.split('Request Arguments')[0]) !=
                'ERROR_MESSAGE_NOT_FOUND'
              ? getErrorMessage(errorMsg.split('Request Arguments')[0])
              : errorMsg.split('Request Arguments')[0]}
        </p>
      ) : (
        ''
      )}
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
      <div className='mt-4'>
        <div className='flex justify-between items-center'>
          <p className='text-base text-lufga text-[#4B5E5B]'>
            {availableAmountTitle} amount
          </p>
          <p className='text-base text-lufga text-[#CAEAE5]'>
            {formatNumber(
              Number(availableAmount),
              getTokenPrecision(token, priceDataMap),
            )}
          </p>
        </div>
        <hr className='mt-4 mb-4 text-[#212325] border-t-[0.25px]' />
      </div>
      <div className='mt-4'>
        <div className='flex justify-between items-center'>
          <p className='text-base text-lufga text-[#4B5E5B]'>
            {protocolBalanceTitle}
          </p>
          <p className='text-base text-lufga text-[#CAEAE5]'>
            {formatNumber(
              Number(protocolBalance),
              getTokenPrecision(token, priceDataMap),
            )}
          </p>
        </div>
        <hr className='mt-4 mb-4 text-[#212325] border-t-[0.25px]' />
      </div>
      <div className='mt-4'>
        <div className='flex justify-between items-center'>
          <p className='text-base text-lufga text-[#4B5E5B]'>Total APY</p>
          <p className='text-base text-lufga text-[#CAEAE5]'>
            {formatNumber(totalApy, 3)}%
          </p>
        </div>
        <hr className='mt-4 mb-4 text-[#212325] border-t-[0.25px]' />
      </div>
      <div>
        <div className='flex justify-between items-center mt-2 mb-2'>
          <p className='text-base text-lufga text-[#4B5E5B]'>
            Daily{' '}
            {actionType == 'supply' || actionType == 'withdraw'
              ? 'earnings'
              : 'cost'}
          </p>
          <p
            className={`text-base text-lufga ${dailyEarning >= 0 ? 'text-[#2DC24E]' : 'text-red-500'}`}
            style={{ display: 'flex' }}
          >
            {' '}
            ${formatNumber(dailyEarning, 3)}
            &nbsp;
            <img
              style={{ cursor: 'pointer' }}
              src={shareIcon}
              alt='share'
              onClick={toggleModal}
            />
          </p>
        </div>
      </div>
      <Button title={buttonText} onClick={() => sendTransaction()} />
      {shareImageModalStatus && (
        <ShareImageModal
          token={token}
          apy={formatNumber(totalApy, 3)}
          onClose={toggleModal}
        />
      )}
    </>
  );
};

export default TokenActions;
