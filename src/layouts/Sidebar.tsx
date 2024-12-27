import { NavLink } from '../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

import {
  navLinksDown,
  navLinksTop,
  //navLinksDown
} from '../utils/constants/constants';
import NavButton from '../components/header/NavButton';
import { logo, myLogo, referralsIcon } from '../assets';
import logoutIcon from '../assets/icons/logout-icon.svg';
import xmarkIcon from '../assets/icons/xmark-icon.svg';
// import referralsIcon from '../assets/icons/referralsIcon.svg';
import {
  toggleModalOpen,
  //toggleModalOpen,
  toggleSidebar,
} from '../store/sidebarSlice';
import { useEffect, useRef, useState } from 'react';
import { networkChainId, contracts, abis } from '../utils/config';
import { useAccount, useWriteContract } from 'wagmi';
import faucetIcon from '../assets/icons/faucet-color.svg';
import { claimFaucet } from '../utils/protocol/faucet';
import explorerIcon from '../assets/icons/explorer-icon.svg';
import { useConfirm } from '../provider/ConfirmProvider';

import Turnstile from 'react-turnstile';
import { parseGwei } from 'viem';

function Sidebar() {
  const { isConnected, address } = useAccount();
  const { guided } = useConfirm();
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [faucetButtonText, setFaucetButtonText] = useState('Faucet');
  const [isCapcthaRequested, setIsCaptchaRequested] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (isSidebarOpen) {
          dispatch(toggleSidebar());
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, dispatch]);

  const { data: hash, writeContractAsync, error } = useWriteContract();
  const sendClaimTx = () => {
    try {
      writeContractAsync({
        address: contracts.faucet,
        abi: abis.faucet,
        functionName: 'claim',
        args: [],
        maxFeePerGas: parseGwei('0.1'),
      });
      if (error && error.message) alert(error.message);
      console.log('MockBTC claimed: ', hash);
    } catch (e) {
      console.log(e);
      alert(`Error claiming MBTC: ${JSON.stringify(e)}`);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`bg-primary transition-transform duration-300 fixed z-30 lg:relative ${isSidebarOpen ? 'translate-x-0 shadow-custom' : '-translate-x-full lg:translate-x-0'} ${guided > 0 ? 'lg:blur-[8px]' : ''}`}
    >
      <div className='w-64 p-10 flex flex-col justify-between  h-screen'>
        <div className=''>
          <div className='pt-4 flex gap-3 justify-center align-middle items-center'>
            <img className='' src={logo} alt='' />
            <span className='text-[#CAEAE5] font-nexa font-bold text-lg'>
              HyperLend
            </span>
          </div>
          <div className='pt-8 flex justify-center align-middle items-center gap-3 flex-row'>
            <div className=''>
              <img
                className=''
                src={myLogo}
                alt=''
                width='100%'
                height='100%'
              />
            </div>
            <div className='flex flex-col justify-end align-bottom items-center'>
              <span className='text-[#AEEAB9] font-lufga font-regular text-[16px]'>
                Global Elite
              </span>
              <span className='text-[#4F4F4F] font-lufga font-medium text-[14px]'>
                Rank: 12,988
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-4 pt-10'>
            {navLinksTop.map((item: NavLink) => (
              <NavButton
                key={item.id}
                id={item.id}
                title={item.title}
                url={item.url}
                icon={item.icon}
                disabled={item.disabled}
              />
            ))}
            <button
              className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform`}
              onClick={() => {
                window.open('https://testnet.purrsec.com', '_blank');
              }}
              key={'openExplorer'}
              type='button'
            >
              <div
                className={`transition-all duration-300 ease-in-out transform px-3`}
              >
                <img src={explorerIcon} className='w-5' alt={'explorer'} />
              </div>
              <p
                className={`font-lufga font-medium transition-colors duration-300 ease-in-out text-secondary`}
              >
                Explorer
              </p>
            </button>

            <button
              className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform`}
              onClick={() => dispatch(toggleModalOpen())}
              key={'openReferrals'}
              type='button'
            >
              <div
                className={`transition-all duration-300 ease-in-out transform px-3`}
              >
                <img src={referralsIcon} className='w-5' alt={'referrals'} />
              </div>
              <p
                className={`font-lufga font-medium transition-colors duration-300 ease-in-out text-secondary`}
              >
                Referrals
              </p>
            </button>

            {networkChainId == 998 && isConnected ? (
              isCapcthaRequested ? (
                <Turnstile
                  sitekey='0x4AAAAAAA2Qg1SB87LOUhrG'
                  onVerify={async (token) => {
                    setIsCaptchaRequested(false);
                    setFaucetButtonText('Sending tokens...');
                    await claimFaucet(token, address);
                    setFaucetButtonText('Faucet');
                    // sendClaimTx();
                  }}
                  onError={() => {
                    sendClaimTx();
                  }}
                />
              ) : (
                <>
                  <button
                    className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform`}
                    onClick={async () => {
                      setIsCaptchaRequested(true);
                    }}
                    key={'openFaucet'}
                    type='button'
                  >
                    <div
                      className={`transition-all duration-300 ease-in-out transform px-3`}
                    >
                      <img src={faucetIcon} className='w-5' alt={'faucet'} />
                    </div>
                    <p
                      className={`font-lufga font-medium transition-colors duration-300 ease-in-out text-secondary`}
                    >
                      {faucetButtonText}
                    </p>
                  </button>
                  <button
                    className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform`}
                    onClick={async () => {
                      sendClaimTx();
                    }}
                    key={'openMbtcFaucet'}
                    type='button'
                  >
                    <div
                      className={`transition-all duration-300 ease-in-out transform px-3`}
                    >
                      <img src={faucetIcon} className='w-5' alt={'faucet'} />
                    </div>
                    <p
                      className={`font-lufga font-medium transition-colors duration-300 ease-in-out text-secondary`}
                    >
                      MBTC faucet
                    </p>
                  </button>
                </>
              )
            ) : (
              <button
                className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform`}
                onClick={async () => {
                  sendClaimTx();
                }}
                key={'openMbtcFaucet'}
                type='button'
              >
                <div
                  className={`transition-all duration-300 ease-in-out transform px-3`}
                >
                  <img src={faucetIcon} className='w-5' alt={'faucet'} />
                </div>
                <p
                  className={`font-lufga font-medium transition-colors duration-300 ease-in-out text-secondary`}
                >
                  MBTC faucet
                </p>
              </button>
            )}
            {navLinksDown.map((item: NavLink) => (
              <NavButton
                key={item.id}
                id={item.id}
                title={item.title}
                url={item.url}
                icon={item.icon}
                disabled={item.disabled}
              />
            ))}
          </div>
        </div>
        <div className='flex justify-between'>
          <a
            className='flex gap-2 items-center'
            href='https://docs.hyperlend.finance'
            target='_blank'
          >
            <img className='' src={logoutIcon} alt='' />
            <p className='font-lufga text-grey-light'>Docs</p>
          </a>
          <div className='font-lufga flex items-center text-white'>
            <small>v0.1.100</small>
          </div>
          <button
            className='lg:hidden'
            type='button'
            onClick={() => dispatch(toggleSidebar())}
          >
            <img className='' src={xmarkIcon} alt='twitter' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
