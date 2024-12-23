import { useState, useEffect, useRef } from 'react';
import {
  useSwitchChain,
  useAccount,
  useWriteContract,
  useBlockNumber,
} from 'wagmi';
import ReactGA from 'react-ga4';

import Modal from '../../components/common/Modal';
import Navbar from '../../layouts/Navbar';

import { ModalType } from '../../utils/types';
import { contracts, abis, networkChainId } from '../../utils/config';
// import { useUserPositionsData } from '../../utils/user/core/positions';
// import { useNavigate } from 'react-router-dom';
import { useConfirm } from '../../provider/ConfirmProvider';
import { motion } from 'framer-motion';
import Hero from '../../components/dashboard/Hero';
import { HeroSidebar } from '../../components';

import DashboardTransactions from './DashboardTransactions';

function Dashboard() {
  ReactGA.send({ hitType: 'pageview', page: '/dashboard' });

  const {
    guided,
    //, closeGuide, nextStep
  } = useConfirm();
  // const navigate = useNavigate();
  const { data: hash, writeContractAsync } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const {
    //address,
    chainId,
    isConnected,
  } = useAccount();
  const { error: blockNumberError } = useBlockNumber();

  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [
    modalToken,
    //,setModalToken
  ] = useState<string>('');
  const [
    modalType,
    //,setModalType
  ] = useState<ModalType>('supply');
  const closeModal = () => setModalStatus(false);

  const [isNetworkDown, setIsNetworkDown] = useState(false);

  useEffect(() => {
    if (blockNumberError) {
      console.log(blockNumberError?.name);
      setIsNetworkDown(true);
    }
  }, [blockNumberError]);

  useEffect(() => {
    if (isConnected && chainId != networkChainId) {
      switchChain({ chainId: networkChainId });
    }
  }, [isConnected, chainId]);

  // const {
  //   supplied,
  //   borrowed,
  // } = useUserPositionsData(isConnected, address);

  const sendToggleCollateralTx = (asset: string, isEnabled: boolean) => {
    writeContractAsync({
      address: contracts.pool,
      abi: abis.pool,
      functionName: 'setUserUseReserveAsCollateral',
      args: [asset, !isEnabled],
    });
    console.log(hash);
  };

  const divRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [divDimensions, setDivDimensions] = useState<
    { width: number; height: number }[]
  >([
    { width: 0, height: 0 },
    { width: 0, height: 0 },
    { width: 0, height: 0 },
    { width: 0, height: 0 },
  ]);
  console.log(divDimensions);
  console.log(sendToggleCollateralTx);
  // Update widths and heights
  const updateDimensions = () => {
    const newDimensions = divRefs.map((ref) => ({
      width: ref.current?.offsetWidth || 0,
      height: ref.current?.offsetHeight || 0,
    }));
    setDivDimensions(newDimensions);
  };

  useEffect(() => {
    // Update the dimensions immediately when the component mounts
    updateDimensions();

    // Add resize event listener to update dimensions during window resizing
    window.addEventListener('resize', updateDimensions);

    // Clean up event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col'
      >
        <Navbar pageTitle='Dashboard' />
        {isNetworkDown && (
          <div className='text-white'>
            ⚠️ Hyperliquid EVM Testnet network is currently down, please try
            again later.
          </div>
        )}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='pt-8 flex flex-col gap-4 relative'
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='flex flex-col md:flex-row gap-4 justify-between'
          >
            <div className='flex gap-4 flex-col lg:flex-col xl:flex-row w-[100%] py-3 justify-start'>
              <Hero />
              <HeroSidebar />
            </div>
          </motion.div>
          <DashboardTransactions />
          <motion.div
            ref={divRefs[3]}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`lg:flex gap-5 justify-between ${guided > 0 && guided !== 4 ? 'lg:blur-[8px]' : ''}`}
          ></motion.div>
        </motion.div>
      </motion.div>
      {modalStatus && (
        <Modal token={modalToken} modalType={modalType} onClose={closeModal} />
      )}
    </>
  );
}

export default Dashboard;
