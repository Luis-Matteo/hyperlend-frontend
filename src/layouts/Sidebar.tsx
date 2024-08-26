import { NavLink } from '../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { navLinks } from '../utils/constants';
import NavButton from '../components/header/NavButton';
import logo from '../assets/icons/logo-text.svg';
import Status from '../components/header/Status';
import logoutIcon from '../assets/icons/logout-icon.svg';
import referralsIcon from '../assets/icons/referralsIcon.svg'
import { toggleModalOpen } from '../store/sidebarSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  return (
    <div className={`bg-primary ${isSidebarOpen ? 'hidden' : 'block'}`}>
      <div className="w-64 p-10 flex-col justify-between flex h-screen ">
        <div className="">
          <div className="pt-4">
            <img className="" src={logo} alt="" />
          </div>
          <div className="pt-8">
            <Status />
          </div>
          <div className="flex flex-col gap-6 pt-10">
            {navLinks.map((item: NavLink) => (
              <NavButton
                key={item.id}
                id={item.id}
                title={item.title}
                url={item.url}
                icon={item.icon}
                disabled={item.disabled}
              />
            ))}
            <button
              className="flex items-center gap-2 rounded-full hover:bg-[#1F2A29]"
              type="button"
              onClick={() => dispatch(toggleModalOpen())}
              
            >
              <div
                className="p-3 "
              >
                <img src={referralsIcon} className="w-5" alt="referrals"/>
              </div>
              <p
                className="font-lufga font-medium text-secondary"
              >
                Referrals
              </p>
            </button>
          </div>
        </div>
        <div className="">
          <button className="flex gap-4 items-center" type="button">
            <img className="" src={logoutIcon} alt="" />
            <a href='https://docs.hyperlend.finance' target="_blank"><p className="font-lufga text-grey-light">
              Docs
            </p></a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
