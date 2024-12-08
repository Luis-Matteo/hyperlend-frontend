import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/sidebarSlice';
import hamburgerIcon from '../assets/icons/hamburger-icon.svg';
import { useConfirm } from '../provider/ConfirmProvider';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icons/left-arrow-white.svg';
import ConnectButton from '../components/header/ConnectButton';

type NavbarProps = {
  pageTitle?: string | ReactNode;
  pageIcon?: ReactNode;
  back?: boolean;
};

function Navbar({ pageTitle, pageIcon, back }: NavbarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { guided } = useConfirm();

  return (
    <div className={`${guided > 0 ? 'lg:blur-[8px]' : ''}`}>
      <div className='flex justify-between items-center lg:hidden mb-6'>
        <button
          className='font-lufga text-white'
          onClick={() => dispatch(toggleSidebar())}
        >
          <img src={hamburgerIcon} alt='' />
        </button>
        <div className=''>
          <ConnectButton />
        </div>
      </div>
      <div className='w-full flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          {back && (
            <button onClick={() => navigate(-1)}>
              <img src={backIcon} className='w-6 h-6' alt='back' />
            </button>
          )}
          {pageIcon && pageIcon}
          {pageTitle && (
            <h2
              className={` ${pageTitle == 'MBTC' ? 'text-orange-400' : 'text-blue-300'} font-lufga text-3xl text-white`}
            >
              {pageTitle}
            </h2>
          )}
        </div>
        <div className='hidden lg:block'>
          {/* <div className="p-1 bg-primary hidden md:flex rounded-full gap-2">
            <div className="p-2 bg-gray-dark rounded-full">
              <img src={magnifyIcon} alt="" />
            </div>
            <input
              className="bg-primary rounded-full text-white font-lufga italic focus:outline-0"
              placeholder="Search your coins..."
              onChange={(e) => { setSearchText(e.target.value); console.log(searchText); }}
            />
          </div> */}
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
