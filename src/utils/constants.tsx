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
    id: 'markets',
    title: 'Markets',
    url: '/markets',
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
