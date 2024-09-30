import React, { useState } from 'react';
import CardItem from '../common/CardItem';
import magnifyIcon from '../../assets/icons/magnify-icon.svg';
import ToggleButton from '../common/ToggleButton';
import { motion } from "framer-motion";

type MarketControlProps = {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  stable: boolean;
  setStable: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string,
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}
function MarketControl({ status, setStatus, stable, setStable, searchText, setSearchText }: MarketControlProps) {

  const [mobileSearch, setMobileSearch] = useState<boolean>(false);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const onClose = () => {
    setMobileSearch((prev) => !prev)
  }
  return (
    <div className="pt-8 pb-4">
      <CardItem
        className="py-3 px-2 md:px-6 flex justify-between items-center"
      >
        <div className="bg-[#081916] rounded-full p-1">
          <button
            type="button"
            className={`py-2 px-4 font-lufga rounded-full text-xs font-bold transition-all duration-500 ${status === 'core'
              ? 'bg-secondary'
              : ' text-white'
              }`}
            onClick={() => setStatus('core')}
          >
            Core
          </button>
          <button
            type="button"
            className={`py-2 px-4 font-lufga rounded-full text-xs font-bold transition-all duration-500 ${status === 'isolated'
              ? 'bg-secondary'
              : ' text-white'
              }`}
            // onClick={() => setStatus('isolated')}
            style={{
              color: "#36454F"
            }}
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
        <div className='md:hidden flex items-center'>
          <button
            onClick={() => setMobileSearch((prev) => !prev)}
            className='bg-[#081916] rounded-full'>
            <img src={magnifyIcon} alt="" className='p-2 rounded-full' />
          </button>
          {
            mobileSearch &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClickOutside}
              className="fixed flex justify-center items-center top-0 left-0 w-full h-screen backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                className="bg-[#081916] flex rounded-full">
                <div className="p-2 rounded-full">
                  <img src={magnifyIcon} alt="" />
                </div>
                <input
                  className="bg-[#081916] rounded-full text-white font-lufga italic focus:outline-0"
                  placeholder="Search your coins..."
                  value={searchText}
                  autoFocus
                  onChange={(e) => { setSearchText(e.target.value); }}
                />
              </motion.div>
            </motion.div>
          }
        </div>
        <div className="flex gap-5">
          <div className="flex gap-3">
            <ToggleButton
              status={stable}
              setStatus={setStable} />
            <p className="text-bold text-white font-bold">Stable<span className="hidden sm:inline-block">coins</span></p>
          </div>
        </div>
      </CardItem>
    </div>
  );
}

export default MarketControl;
