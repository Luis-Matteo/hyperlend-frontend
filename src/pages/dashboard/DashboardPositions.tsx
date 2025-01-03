import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Core, Isolated } from '../../components';
import { Link } from 'react-router-dom';
import { earningsIcon } from '../../assets';
import { ModalType } from '../../utils/types';

interface DashboardPositionsProps {
  setModalToken: React.Dispatch<React.SetStateAction<string>>;
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  userPositions: any;
  sendToggleCollateralTx: (asset: string, isEnabled: boolean) => any;
}

const DashboardPositions: FC<DashboardPositionsProps> = ({
  setModalToken,
  setModalStatus,
  setModalType,
  userPositions,
  sendToggleCollateralTx,
}) => {
  const [activeTab, setActiveTab] = useState<string>('core');

  const typeButtons = [
    {
      id: 'core',
      title: 'Core',
    },
    {
      id: 'isolated',
      title: 'Isolated',
    },
  ];
  return (
    <>
      <div className='flex justify-between items-center align-middle'>
        <div className='grid grid-cols-2 text-center w-full lg:w-auto'>
          {typeButtons.map((button) => (
            <motion.button
              key={button.id}
              onClick={() => setActiveTab(button.id)}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
            >
              <p
                className={`text-base lg:w-[159px] font-lufga capitalize transition-colors duration-300 ease-in-out ${activeTab === button.id ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}
              >
                {button.title}
              </p>
              <hr
                className={`mt-4 mb-4 border transition-colors duration-300 ease-in-out ${activeTab === button.id ? 'text-white' : 'text-[#546764]'}`}
              />
            </motion.button>
          ))}
        </div>
        <div className='w-auto hidden lg:block'>
          <Link
            to='/daily-earnings'
            className='text-[#CAEAE566] text-[18px] font-lufga font-light text-center underline'
          >
            <div className='flex flex-row justify-start align-bottom items-start gap-2'>
              <span className='text-[#CAEAE566] text-[18px] font-lufga font-light text-center underline'>
                Your Transactions
              </span>
              <img src={earningsIcon} alt='' className='mt-[2px]' />
            </div>
          </Link>
        </div>
      </div>
      <AnimatePresence mode='wait'>
        {activeTab === 'core' && (
          <Core
            setModalToken={setModalToken}
            setModalStatus={setModalStatus}
            setModalType={setModalType}
            userPositions={userPositions}
            sendToggleCollateralTx={sendToggleCollateralTx}
          />
        )}
        {activeTab === 'isolated' && (
          <Isolated
            setModalToken={setModalToken}
            setModalStatus={setModalStatus}
            setModalType={setModalType}
            userPositions={userPositions}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardPositions;
