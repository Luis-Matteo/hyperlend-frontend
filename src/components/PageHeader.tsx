import { useState } from 'react';
import magnifyIcon from '../assets/icons/magnify-icon.svg';
import downArrowIcon from '../assets/icons/down-arrow.svg';
import { formatAddress } from '../utils/functions';

type PageHeaderProps = {
    pageTitle: string;
};

function PageHeader({ pageTitle }: PageHeaderProps) {
  const [searchText, setSearchText] = useState<string>('');
  const walletAddress = '0xCA526199F6ce9A7217B6E249ee9Ff177Fa0dFA00';
  return (
    <div className="w-full flex justify-between items-center">
      <h2 className="font-lufga text-3xl text-white">{pageTitle}</h2>
      <div className="flex items-center gap-4">
        <div className="p-1 bg-primary rounded-full flex gap-2">
          <div className="p-2 bg-gray-dark rounded-full">
            <img src={magnifyIcon} alt="" />
          </div>
          <input
            className="bg-primary rounded-full text-white font-lufga italic focus:outline-0"
            placeholder="Search your coins..."
            onChange={(e) => { setSearchText(e.target.value); console.log(searchText); }}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-light rounded-full" />
          <div className="flex items-center gap-1 text-white font-lufga">
            <p className="">{formatAddress(walletAddress)}</p>
            <img src={downArrowIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
