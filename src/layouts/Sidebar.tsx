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
import { useEffect, useRef } from 'react';

import { networkChainId, contracts, abis } from '../utils/config';
import { useAccount, useWriteContract } from 'wagmi';
import faucetIcon from '../assets/icons/faucet-color.svg';
import { claimFaucet } from '../utils/protocol/faucet';
import explorerIcon from '../assets/icons/explorer-icon.svg';

function Sidebar() {
  const { isConnected, address } = useAccount();

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);
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
    writeContractAsync({
      address: contracts.faucet,
      abi: abis.faucet,
      functionName: 'claim',
      args: [],
    });
    if (error && error.message) alert(error.message);
    console.log('MockBTC claimed: ', hash);
  };

  return (
    <div
      ref={sidebarRef}
      className={`bg-primary transition-transform duration-300 absolute z-30 lg:relative ${isSidebarOpen ? 'translate-x-0 shadow-custom' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className='w-64 p-10 flex-col justify-between flex h-screen'>
        <div className=''>
          <div className='pt-4'>
            <img className='' src={logo} alt='' />
          </div>
          <div className='pt-8'>
            <Status />
          </div>
          <div className='flex flex-col gap-6 pt-10'>
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
              className='flex items-center gap-2 rounded-full'
              type='button'
              onClick={() => {
                window.open('https://explorer.hyperlend.finance', '_blank');
              }}
            >
              <div className='px-3'>
                <img src={explorerIcon} className='w-5' alt='faucet' />
              </div>
              <p className='font-lufga font-medium text-secondary'>Explorer</p>
            </button>

            <button
              className='flex items-center gap-2 rounded-full'
              type='button'
              onClick={() => dispatch(toggleModalOpen())}
            >
              <div className='p-3'>
                <img src={referralsIcon} className='w-5' alt='referrals' />
              </div>
              <p className='font-lufga font-medium text-secondary'>Referrals</p>
            </button>

            {networkChainId == 998 && isConnected ? (
              <button
                className='flex items-center gap-2 rounded-full'
                type='button'
                onClick={() => {
                  claimFaucet(address);
                  sendClaimTx();
                }}
              >
                <div className='px-3 '>
                  <img src={faucetIcon} className='w-5' alt='faucet' />
                </div>
                <p className='font-lufga font-medium text-secondary'>Faucet</p>
              </button>
            ) : (
              ''
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
          <button className='flex gap-4 items-center' type='button'>
            <a href='https://docs.hyperlend.finance' target='_blank'>
              <img className='' src={logoutIcon} alt='' />
              <p className='font-lufga text-grey-light'>Docs</p>
            </a>
          </button>
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
