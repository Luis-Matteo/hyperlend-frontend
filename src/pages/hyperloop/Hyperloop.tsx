import Navbar from '../../layouts/Navbar';
import CardItem from '../../components/common/CardItem';

import hyperloopIcon from '../../assets/icons/hyperloop-icon.svg';
import { Outlet } from 'react-router-dom';

function Hyperloop() {
  return (
    <>
      <div className='w-full'>
        <Navbar />
        <div className='max-w-[500px] mx-auto'>
          <div className='mb-10 text-center'>
            <div className='flex gap-3 items-center justify-center'>
              <img className='w-11 h-11' src={hyperloopIcon} alt='hyperloop' />
              <h4 className='text-secondary font-lufga text-3xl'>HyperLoop</h4>
            </div>
            <p className='mt-4 text-secondary text-opacity-40 font-lufga'>
              Maximize gains by making your deposits work harder.
            </p>
          </div>
          <CardItem className='p-6'>
            <Outlet />
          </CardItem>
        </div>
      </div>
    </>
  );
}

export default Hyperloop;
