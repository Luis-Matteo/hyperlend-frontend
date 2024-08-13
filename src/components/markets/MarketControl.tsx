import React from 'react';
import CardItem from '../common/CardItem';
import magnifyIcon from '../../assets/icons/magnify-icon.svg';

type MarketControlProps = {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  stable: boolean;
  setStable: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string,
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}
function MarketControl({ status, setStatus, stable, setStable, setSearchText }: MarketControlProps) {
  return (
    <div className="pt-16 pb-4">
      <CardItem
        className="py-3 px-6 flex justify-between items-center"
      >
        <div className="bg-[#081916] rounded-full">
          <button
            type="button"
            className={`py-2 px-4 font-lufga rounded-full text-xs font-bold ${status === 'core' ? 'bg-secondary' : 'text-white'}`}
            onClick={() => setStatus('core')}
          >
            Core
          </button>
          <button
            type="button"
            className={`py-2 px-4 font-lufga rounded-full text-xs font-bold ${status === 'isolated' ? 'bg-secondary' : 'text-white'}`}
          >
            Isolated
          </button>
        </div>
        <div className="bg-[#081916] rounded-full hidden md:flex gap-2">
          <div className="p-2 rounded-full">
            <img src={magnifyIcon} alt="" />
          </div>
          <input
            className="bg-[#081916] rounded-full text-white font-lufga italic focus:outline-0"
            placeholder="Search your coins..."
            onChange={(e) => { setSearchText(e.target.value); }}
          />
        </div>
        <div className="flex gap-5">
          <div className="flex gap-3">
            <button
              type="button"
              className="p-0.5 bg-[#081916] rounded-full flex items-center"
              onClick={() => setStable((prev) => !prev)}
            >
              <div className={`p-2 rounded-full ${stable && 'bg-secondary'}`} />
              <div className={`p-2 rounded-full ${!stable && 'bg-secondary'}`} />
            </button>
            <p className="text-bold text-white font-bold">Stablecoins</p>
          </div>
          {/* <div className="flex gap-3">
            <button
              type="button"
              className="p-0.5 bg-[#081916] rounded-full flex items-center"
              onClick={() => setPersonal((prev) => !prev)}
            >
              <div className={`p-2 rounded-full ${personal && 'bg-secondary'}`} />
              <div className={`p-2 rounded-full ${!personal && 'bg-secondary'}`} />
            </button>
            <p className="text-bold text-white font-bold">Personal Positions</p>
          </div> */}
        </div>
      </CardItem>
    </div>
  );
}

export default MarketControl;
