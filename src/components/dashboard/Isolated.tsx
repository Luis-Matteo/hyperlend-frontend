import { FC } from 'react';
import { ModalType } from '../../utils/types';

interface IsolatedPositionsProps {
  setModalToken: React.Dispatch<React.SetStateAction<string>>;
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  userPositions: any;
}

const Isolated: FC<IsolatedPositionsProps> = (
  {
    // setModalToken,
    // setModalStatus,
    // setModalType,
  },
) => {
  return (
    <div className='flex justify-center items-center'>
      <span className='text-xl text-white'>Isolated Tab</span>
    </div>
  );
};

export default Isolated;
