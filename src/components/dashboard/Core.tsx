import { FC, useRef } from 'react';
import { useConfirm } from '../../provider/ConfirmProvider';
import { motion } from 'framer-motion';
import PositionsDeskTop from './PositionsDeskTop';
import PositionsMobile from './PositionsMobile';
import { ModalType } from '../../utils/types';

interface CorePositionsProps {
  setModalToken: React.Dispatch<React.SetStateAction<string>>;
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  userPositions: any;
  sendToggleCollateralTx: (asset: string, isEnabled: boolean) => any;
}

const Core: FC<CorePositionsProps> = ({
  setModalToken,
  setModalStatus,
  setModalType,
  userPositions,
  sendToggleCollateralTx,
}) => {
  const { guided } = useConfirm();

  const divRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col'
      >
        <motion.div
          ref={divRefs[3]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`lg:flex lg:flex-col xl:flex-row gap-5 justify-between ${guided > 0 && guided !== 4 ? 'lg:blur-[8px]' : ''}`}
        >
          <div className='w-full hidden md:block lg:block xl:block'>
            <PositionsDeskTop
              setModalToken={setModalToken}
              setModalStatus={setModalStatus}
              setModalType={setModalType}
              userPositions={userPositions}
              sendToggleCollateralTx={sendToggleCollateralTx}
            />
          </div>
          <div className='w-full block md:hidden lg:hidden xl:hidden'>
            <PositionsMobile />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Core;
