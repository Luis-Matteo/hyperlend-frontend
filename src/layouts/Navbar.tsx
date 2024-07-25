import { NavLink } from '../utils/types';
import { navLinks } from '../utils/constants';
import NavButton from '../components/NavButton';
import logo from '../assets/icons/logo-text.svg';

function Navbar() {
  return (

    <div className="w-64 h-screen bg-primary">
      <div className="p-10">
        <div className="pt-4">
          <img className="" src={logo} alt="" />
        </div>
        <div className="pt-8" />
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
    </div>
  );
}

export default Navbar;
