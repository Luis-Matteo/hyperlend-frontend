import dashboardIcon from '../assets/icons/dashboard-icon.svg';
import lendborrowIcon from '../assets/icons/lend-borrow-icon.svg';

type NavLinkProps = {
    id: string;
    title: string;
    url: string;
    icon?: string;
    disabled: boolean;
}

const navLinks: NavLinkProps[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: '/dashboard',
    icon: dashboardIcon,
    disabled: false,
  },
  {
    id: 'lend-and-borrow',
    title: 'Lend & Borrow',
    url: '/lend-and-borrow',
    icon: lendborrowIcon,
    disabled: false,
  },
  {
    id: 'points',
    title: 'Points',
    url: '/points',
    disabled: true,
  },
  {
    id: 'staking',
    title: 'Staking',
    url: '/staking',
    disabled: true,
  },
];

export { navLinks };
