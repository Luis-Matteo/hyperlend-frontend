import { NavLink } from '../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import { navLinks } from '../utils/constants';
import { navLinksTop, navLinksDown } from '../utils/constants/constants';
import NavButton from '../components/header/NavButton';
import logo from '../assets/icons/logo-text.svg';
import Status from '../components/header/Status';
import logoutIcon from '../assets/icons/logout-icon.svg';
import xmarkIcon from '../assets/icons/xmark-icon.svg';
import referralsIcon from '../assets/icons/referralsIcon.svg';
import { toggleModalOpen, toggleSidebar } from '../store/sidebarSlice';
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
      <div className='w-64 p-10 flex-col justify-between flex h-screen'>
        <div className=''>
          <div className='pt-4'>
            <img className='' src={logo} alt='' />
          </div>
          <div className='pt-8'>
            <Status />
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
          <div className='flex items-center text-white'>
            <small>v0.1.98</small>
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
