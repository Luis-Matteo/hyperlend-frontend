import { useState } from 'react';
import magnifyIcon from '../assets/icons/magnify-icon.svg';

type NavbarProps = {
  pageTitle: string;
};

function Navbar({ pageTitle }: NavbarProps) {
  const [searchText, setSearchText] = useState<string>('');
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
        <w3m-button />
      </div>
    </div>
  );
}

export default Navbar;
