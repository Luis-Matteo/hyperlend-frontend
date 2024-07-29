import { useState } from 'react';
import CardItem from './CardItem';
import magnifyIcon from '../assets/icons/magnify-icon.svg';

function LendControl() {
  const [status, setStatus] = useState<string>('borrow');
  const [searchText, setSearchText] = useState<string>('');
  const [stable, setStable] = useState<boolean>(false);
  const [personal, setPersonal] = useState<boolean>(false);

  return (
    <div className="pt-16">
      <CardItem
        className="py-3 px-6 flex justify-between items-center"
      >
        <div className="bg-[#081916] rounded-full">
          <button
            type="button"
            className={`py-2 px-4 font-lufga rounded-full text-xs font-bold ${status === 'lend' ? 'bg-secondary' : 'text-white'}`}
            onClick={() => setStatus('lend')}
          >
            Lend
          </button>
          <button
            type="button"
            className={`py-2 px-4 font-lufga rounded-full text-xs font-bold ${status === 'borrow' ? 'bg-secondary' : 'text-white'}`}
            onClick={() => setStatus('borrow')}
          >
            Borrow
          </button>
        </div>
        <div className="bg-[#081916] rounded-full flex gap-2">
          <div className="p-2 rounded-full">
            <img src={magnifyIcon} alt="" />
          </div>
          <input
            className="bg-[#081916] rounded-full text-white font-lufga italic focus:outline-0"
            placeholder="Search your coins..."
            onChange={(e) => { setSearchText(e.target.value); console.log(searchText); }}
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
          <div className="flex gap-3">
            <button
              type="button"
              className="p-0.5 bg-[#081916] rounded-full flex items-center"
              onClick={() => setPersonal((prev) => !prev)}
            >
              <div className={`p-2 rounded-full ${personal && 'bg-secondary'}`} />
              <div className={`p-2 rounded-full ${!personal && 'bg-secondary'}`} />
            </button>
            <p className="text-bold text-white font-bold">Personal Positions</p>
          </div>
        </div>
      </CardItem>
    </div>
  );
}

export default LendControl;
