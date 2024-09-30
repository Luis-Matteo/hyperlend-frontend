import React, { useEffect, useState } from 'react';
import ProgressBar from '../common/PercentBar';
import Button from '../common/Button';
import { TokenActionsProps } from '../../utils/interfaces';
import ToggleButton from '../common/ToggleButton';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { erc20Abi } from 'viem';

import { formatNumber } from '../../utils/functions';
import {
  iconsMap,
  tokenNameMap,
  tokenDecimalsMap,
  contracts,
  abis,
} from '../../utils/tokens';
import { useUserAllowance } from '../../utils/userState';
import { getErrorMessage } from '../../utils/errorCodes';

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
}) => {
  const [progress, setProgress] = useState<number>(0);
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

  const actionType = btnTitle.toLowerCase();
  useEffect(() => {
    setButtonText(btnTitle);
  }, [btnTitle]);

  const { address } = useAccount();
  const { data: hash, writeContract, error } = useWriteContract();
  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const userAllowanceBn = useUserAllowance(
    token,
    address || '0x',
    contracts.pool,
  );

  const [userAllowance, setUserAllowance] = useState(0);
  const [buttonText, setButtonText] = useState(btnTitle);
  const [collateral, setCollateral] = useState(isCollateralEnabled);
  const [amount, setAmount] = useState(0);

  //update button after approval
  useEffect(() => {
    if (txReceipt && txReceipt.status == 'success') {
      setButtonText(btnTitle);
    }
  }, [txReceipt]);

  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    if (error?.message) {
      setErrorMsg(error?.message);
    }
  }, [error?.message]);

  console.log('___error', error);
  console.log('___errorMSG___', errorMsg);

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
      if (amount > allowance) {
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

  const triggerAction = () => {
    const bgIntAmount = parseFloat(
      (amount * Math.pow(10, tokenDecimalsMap[token])).toString(),
    )
      .toFixed(0)
      .toString() as any as bigint;
    const allowance =
      Number(userAllowance) / Math.pow(10, tokenDecimalsMap[token]);

    if (actionType == 'supply' || actionType == 'repay') {
      if (allowance < amount) {
        writeContract({
          address: token as any,
          abi: erc20Abi,
          functionName: 'approve',
          args: [contracts.pool, 999999999999999999999999999999999999999n],
        });
        setButtonText(btnTitle);
      }
    }

    const functionParams: any = {
      supply: [token, bgIntAmount, address, 0], //asset, amount, onBehalfOf, refCode
      withdraw: [token, bgIntAmount, address], //asset, amount, to
      borrow: [token, bgIntAmount, 2, 0, address], //asset, amount, interestRateMode (2 = variable), refCode, onBehalfOf
      repay: [token, bgIntAmount, 2, address], //asset, amount, interestRateMode, onBehalfOf
    };

    if (actionType == 'supply' && allowance >= amount) {
      writeContract({
        address: contracts.pool,
        abi: abis.pool,
        functionName: actionType,
        args: functionParams[actionType],
      });
      console.log(hash);
    } else {
      writeContract({
        address: contracts.pool,
        abi: abis.pool,
        functionName: actionType,
        args: functionParams[actionType],
      });
      console.log(hash);
    }
  };

  const updateCollateral = () => {
    writeContract({
      address: contracts.pool,
      abi: abis.pool,
      functionName: 'setUserUseReserveAsCollateral',
      args: [token, !collateral],
    });
    if (hash) setCollateral(!collateral);
    console.log(hash);
  };

  const setMaxAmount = () => {
    setAmount(availableAmount);
    setProgress(100);
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
              value={amount.toFixed(2)}
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
            : errorMsg.split('Request Arguments')[0]}
        </p>
      ) : (
        ''
      )}
      {/* <div className="mt-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-base text-lufga text-[#4B5E5B]">
                            Current: {"  "}{" "}
                        </p>
                        <p className="text-[#CAEAE5]  text-base text-lufga font-thin ">
                            {" "}
                            {protocolBalance}{" "}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-base text-lufga text-[#4B5E5B]">MAX: </p>
                        <p className="text-[#CAEAE5]  text-base text-lufga font-thin ">
                            {" "}
                            {availableAmount + protocolBalance}{" "}
                        </p>
                    </div>
                </div>
            </div> */}
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
            {availableAmount}
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
            {protocolBalance}
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
          >
            {' '}
            ${formatNumber(dailyEarning, 3)}
          </p>
        </div>
      </div>
      <Button title={buttonText} onClick={() => triggerAction()} />
    </>
  );
};

export default TokenActions;
