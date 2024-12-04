import { AnimatePresence, motion } from 'framer-motion';
import CardItem from '../common/CardItem';

import {
  loadingAnimationData,
  successAnimationData,
  warningAnimationData,
} from '../../utils/constants/animationData';
import LottieAnimation from '../common/LottieAnimation';
import { animationModal } from '../../utils/constants/animationModal';

export type AnimateModalProps = {
  type: 'loading' | 'completed' | 'failed';
  actionType: 'supply' | 'borrow' | 'repay' | 'withdraw' | 'approve';
  txLink?: string;
  extraDetails?: string;
  onClick?: () => void;
};

function AnimateModal({
  type,
  actionType,
  txLink,
  onClick,
  extraDetails,
}: AnimateModalProps) {
  const background = {
    loading: 'bg-[#071311] shadow-[0px_0px_32px_0px_#4D605D80]',
    completed:
      'bg-gradient-to-b from-[#071311] via-[#00000000] via-[60%] to-[#2DC24E33] shadow-[0px_0px_32px_0px_#2DC24E4D]',
    failed:
      'bg-gradient-to-b from-[#071311] via-[#00000000] via-[60%] to-[#FF0D0D33] shadow-[0px_0px_32px_0px_#FF0D0D4D]',
  }[type];

  const color = {
    loading: 'bg-[#071311]',
    completed: 'bg-[#CAEAE5]',
    failed: 'bg-[#EACACB]',
  }[type];

  const animationData = {
    loading: loadingAnimationData,
    completed: successAnimationData,
    failed: warningAnimationData,
  }[type];

  function getModalContent(
    type: 'loading' | 'completed' | 'failed',
    status: 'supply' | 'withdraw' | 'repay' | 'borrow' | 'approve',
  ) {
    const modalData = animationModal[type]?.[actionType];

    if (!modalData) {
      throw new Error(`Invalid type or status: ${type}, ${status}`);
    }

    return {
      title: modalData.title,
      content: modalData.content,
    };
  }

  const { title, content } = getModalContent(type, actionType);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm'
      >
        <CardItem
          className={`relative max-w-[448px] w-full max-h-[500px] h-full flex flex-col justify-center p-5  ${background}`}
        >
          <div className={`text-center ${onClick ? 'mb-10' : ''}`}>
            <div className='w-[110px] h-[110px] mx-auto '>
              <LottieAnimation animationData={animationData} />
            </div>
            <h5 className='text-center text-sm text-secondary font-nexa mt-11'>
              {title}
            </h5>
            <p className='mx-11 text-center text-xs text-secondary font-lufga mt-2'>
              {content}
              {extraDetails && (
                <>
                  <br></br>
                  <br></br>
                  {extraDetails}
                </>
              )}
            </p>
            {txLink && (
              <a
                className='text-xs text-secondary font-lufga mt-4'
                href={txLink}
                target='_blank'
              >
                [View Transaction]
              </a>
            )}
          </div>
          {(onClick && type !== "loading") && (
            <div className='absolute bottom-0 left-0 p-5 w-full'>
              <button
                className={`w-full py-4 rounded-lg font-nexa ${color}`}
                onClick={onClick}
              >
                {type == 'completed' ? 'Done' : 'Try Again'}
              </button>
            </div>
          )}
        </CardItem>
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimateModal;
