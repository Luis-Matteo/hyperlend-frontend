import { NavLink } from '../utils/types';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { navLinks } from '../utils/constants';
import NavButton from '../components/header/NavButton';
import logo from '../assets/icons/logo-text.svg';
import Status from '../components/header/Status';
import logoutIcon from '../assets/icons/logout-icon.svg';

function Sidebar() {
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  console.log(isSidebarOpen)
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
          </div>
        </div>
        <div className="">
          <button className="flex gap-4 items-center" type="button">
            <img className="" src={logoutIcon} alt="" />
            <p className="font-lufga text-grey-light">
              Logout
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
