import { useNavigate, useLocation } from 'react-router-dom';
import lockIcon from '../../assets/icons/lock-icon.svg';

interface NavButtonProps {
  id: string;
  title: string;
  url: string;
  icon?: string;
  disabled: boolean;
}

function NavButton({
  id,
  title,
  url,
  icon = lockIcon,
  disabled,
}: NavButtonProps) {
  const location = useLocation();
  const currentRoute = location.pathname;
  const navigate = useNavigate();

  if (disabled) {
    return (
      <button
        className="flex items-center gap-2 cursor-not-allowed"
        disabled
        key={id}
        type="button"
      >
        <div className="px-3">
          <img src={lockIcon} className="w-5" alt="locked" />
        </div>
        <p className="font-lufga font-medium text-gray">{title}</p>
      </button>
    );
  }

  return (
    <button
      className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform ${currentRoute === url ? 'bg-secondary p-1 rounded-full' : ''
        }`}
      onClick={() => navigate(url)}
      key={id}
      type="button"
    >
      <div
        className={`transition-all duration-300 ease-in-out transform ${currentRoute === url ? 'p-2 bg-grey rounded-full' : 'px-3'
          }`}
      >
        <img src={icon} className="w-5" alt={title} />
      </div>
      <p
        className={`font-lufga font-medium transition-colors duration-300 ease-in-out ${currentRoute === url ? '' : 'text-secondary'
          }`}
      >
        {title}
      </p>
    </button>
  );
}

export default NavButton;
