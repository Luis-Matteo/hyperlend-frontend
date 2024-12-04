import { useState } from 'react';

import ethIcon from '../../assets/icons/coins/eth-icon.svg';
import wbtcIcon from '../../assets/icons/coins/wbtc-icon.svg';
import magnifyIcon from '../../assets/icons/magnify-dark-icon.svg';
import xmarkIcon from '../../assets/icons/xmark-dark-icon.svg';

const tokenList = [
  {
    id: 'eth',
    title: 'ETH',
    icon: ethIcon,
    percent: 19.99,
    value: 1.3,
    price: 4228.8,
  },
  {
    id: 'btc',
    title: 'BTC',
    icon: wbtcIcon,
    percent: 19.99,
    value: 1.3,
    price: 4228.8,
  },
];

function HyperloopSearch() {
  const [searchText, setSearchText] = useState<string>('');
  return (
    <>
      <div className='flex justify-between items-center gap-3 px-6 py-4 w-full bg-[#071311] rounded-md'>
        <img className='w-[18px]' src={magnifyIcon} alt='magnify' />
        <div className='flex justify-between w-full items-center'>
          <input
            type='text'
            placeholder='Search token...'
            className='text-xl font-lufga text-[#CAEAE566] border-0 p-0 text-left [100px]'
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            style={{
              background: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              width: 'auto',
              minWidth: '50px',
            }}
          />
          <button className=''>
            <img className='' src={xmarkIcon} alt='close' />
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-6 my-6 max-h-[366px] overflow-auto'>
        {tokenList.map((item, index) => (
          <button
            className='flex items-center gap-2 px-5 w-full py-1.5 hover:bg-[#0D1414]'
            key={`depositToken${index}`}
          >
            <img className='w-8 h-8 ' src={item.icon} />
            <div className='flex justify-between items-center w-full'>
              <div className=''>
                <p className='text-secondary font-lufga text-left'>
                  {item.title}
                </p>
                <p className='text-success font-lufga text-[13px] text-left'>
                  {item.percent}%
                </p>
              </div>
              <div className=''>
                <p className='text-secondary font-lufga text-right'>
                  {item.value}
                </p>
                <p className='text-secondary font-lufga text-[13px] text-right'>
                  ${item.price}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default HyperloopSearch;
