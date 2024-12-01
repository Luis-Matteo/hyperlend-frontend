import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

import gearIcon from '../../assets/icons/gear-icon.svg';
import leftArrowIcon from '../../assets/icons/left-arrow.svg';

const slippageList = [
  {
    title: 'Low',
    value: 0.3,
  },
  {
    title: 'Normal',
    value: 0.5,
  },
  {
    title: 'High',
    value: 1,
  },
];

function HyperloopSetting() {
  const navigate = useNavigate();

  const [slippage, setSlippage] = useState(0);
  return (
    <>
      <Link className='flex gap-3 items-center mb-10' to='/hyperloop'>
        <img className='' src={leftArrowIcon} alt='back' />
        <p className='text-secondary font-lufga text-opacity-40'>Back</p>
      </Link>
      <p className='text-secondary font-lufga'>Set transaction slippage</p>
      <div className='grid grid-cols-3 gap-4 rounded-md mt-4 mb-4'>
        {slippageList.map((item, index) => (
          <button
            className='py-3 bg-[#071311]'
            onClick={() => setSlippage(item.value)}
            key={`slippage${index}`}
          >
            <p className='text-secondary font-lufga'>{item.title}</p>
            <p className='text-secondary font-lufga'>{item.value}%</p>
          </button>
        ))}
      </div>
      <p className='text-secondary font-lufga mt-10'>Or set manually</p>
      <div className='flex justify-between items-center p-3 w-full'>
        <input
          type='number'
          className='form-control-plaintext text-xl text-secondary text-opacity-40 border-0 p-0 text-left [100px]'
          value={slippage}
          step={0.01}
          min={0}
          onChange={(e) => {
            setSlippage(Number(e.target.value));
          }}
          style={{
            background: 'transparent',
            outline: 'none',
            boxShadow: 'none',
            width: 'auto',
            minWidth: '50px',
          }}
        />
        <p className='text-secondary font-lufga text-2xl'>%</p>
      </div>
      <Button title='Save Settings' />
      <div className='flex justify-end mt-6'>
        <button
          className='px-3 py-1.5 flex gap-2 items-center bg-[#050F0D] rounded-full'
          onClick={() => navigate('/hyperloop/setting')}
        >
          <img className='w-4' src={gearIcon} alt='setting' />
          <p className='uppercase font-lufga text-secondary'>settings</p>
        </button>
      </div>
    </>
  );
}

export default HyperloopSetting;
