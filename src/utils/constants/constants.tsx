import dashboardIcon from '../../assets/icons/dashboard-icon.svg';
import lendborrowIcon from '../../assets/icons/lend-borrow-icon.svg';
import analyticsIcon from '../../assets/icons/analytics-icon.svg';
import hyperloopIcon from '../../assets/icons/hyperloop-icon.svg';

type NavLinkProps = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  disabled: boolean;
};

// const navLinks: NavLinkProps[] = [
//   {
//     id: 'dashboard',
//     title: 'Dashboard',
//     url: '/dashboard',
//     icon: dashboardIcon,
//     disabled: false,
//   },
//   {
//     id: 'markets',
//     title: 'Markets',
//     url: '/markets',
//     icon: lendborrowIcon,
//     disabled: false,
//   },
//   {
//     id: 'points',
//     title: 'Points',
//     url: '/points',
//     disabled: true,
//   },
//   {
//     id: 'staking',
//     title: 'Staking',
//     url: '/staking',
//     disabled: true,
//   },
// ];

const navLinksTop: NavLinkProps[] = [
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
    id: 'analytics',
    title: 'Analytics',
    url: '/analytics',
    icon: analyticsIcon,
    disabled: false,
  },
  {
    id: 'hyperloop',
    title: 'HyperLoop',
    url: '/hyperloop',
    icon: hyperloopIcon,
    disabled: false,
  },
];

const navLinksDown: NavLinkProps[] = [
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

const assetsInfos = [
  {
    title: 'Total Supplied',
    tooltip: 'Total hyperlend deposits for each asset.',
  },
  {
    title: 'Supply APY',
    tooltip: 'A percentage you will earn on deposits over a year.',
  },
  {
    title: 'Total Borrowed',
    tooltip: 'Total hyperlend borrows for each asset.',
  },
  {
    title: 'Borrow APY',
    tooltip: 'A percentage you will pay on borrows over a year.',
  },
  {
    title: 'Available Liquidity',
    tooltip: 'The amount of tokens available to borrow for each asset.',
  },
  {
    title: 'Collateral',
    tooltip: 'Signals if you can borrow using this asset as a collateral.',
  },
  {
    title: 'LTV',
    tooltip:
      'The amount you can borrow against your collateral. e.g. 80% LTV means you can borrow up to 80% of the collateral value.',
  },
];

const tokenDetailButton = [
  { id: 1, label: 'supply' },
  { id: 2, label: 'withdraw' },
  { id: 3, label: 'borrow' },
  { id: 4, label: 'repay' },
];

// export { navLinks, assetsInfos };
export { navLinksTop, navLinksDown, assetsInfos, tokenDetailButton };
