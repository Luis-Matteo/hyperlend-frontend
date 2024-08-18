import { useState } from 'react'; 
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/sidebarSlice';
import magnifyIcon from '../assets/icons/magnify-icon.svg';
import dashboardIcon from '../assets/icons/dashboard-icon.svg';

type NavbarProps = {
  pageTitle: string;
  pageIcon?: string;
};

function Navbar({ pageTitle, pageIcon }: NavbarProps) {
  const dispatch = useDispatch();
  
  const [searchText, setSearchText] = useState<string>('');
  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <div className='flex gap-2'>
          <button className='font-lufga text-white lg:hidden' onClick={() => dispatch(toggleSidebar())}
          >
            <img src={dashboardIcon} alt=''/>
          </button>
          {
            pageIcon ? <img src={pageIcon} height="30px" width="30px" alt=''/> : ""
          }
          <h2 className="font-lufga text-3xl text-white">
          {pageTitle}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-1 bg-primary hidden md:flex rounded-full gap-2">
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
    </div>
  );
}

export default Navbar;
