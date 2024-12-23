import dashboardIcon from '../../assets/icons/dashboard-icon.svg';
import lendborrowIcon from '../../assets/icons/lend-borrow-icon.svg';
import {
  // hyperVaultIcon,
  // hyperLoopIcon,
  // referralsIcon,
  // pointsIcon,
  analyticsIcon,
} from '../../assets';

type NavLinkProps = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  disabled: boolean;
};
type TransactionTableTitleProps = {
  id: string;
  title: string;
};

export const supplyTransactionTableTitles: TransactionTableTitleProps[] = [
  { title: 'Assets', id: 'assets' },
  { title: 'Balance', id: 'balance' },
  { title: 'Value', id: 'value' },
  { title: 'APR', id: 'apr' },
  { title: 'Collateral', id: 'collateral' },
];
export const supplyTransactionTableTitlesMobile: TransactionTableTitleProps[] =
  [
    { title: 'Assets', id: 'assets' },
    { title: 'Value', id: 'value' },
    { title: 'APR', id: 'apr' },
  ];
export const borrowTransactionTableTitles: TransactionTableTitleProps[] = [
  { title: 'Assets', id: 'assets' },
  { title: 'Balance', id: 'balance' },
  { title: ' Value', id: 'value' },
  { title: 'APR', id: 'apr' },
  { title: 'Pool', id: 'pool' },
];
export const borrowTransactionTableTitlesMobile: TransactionTableTitleProps[] =
  [
    { title: 'Assets', id: 'assets' },
    { title: ' Value', id: 'value' },
    { title: 'APR', id: 'apr' },
  ];
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
  // {
  //   id: 'hypervault',
  //   title: 'HyperVault',
  //   url: '/hypervault',
  //   icon: hyperVaultIcon,
  //   disabled: false,
  // },
  // {
  //   id: 'hyperloop',
  //   title: 'HyperLoop',
  //   url: '/hyperloop',
  //   icon: hyperLoopIcon,
  //   disabled: false,
  // },
  {
    id: 'analytics',
    title: 'Analytics',
    url: '/analytics',
    icon: analyticsIcon,
    disabled: false,
  },
  // {
  //   id: 'points',
  //   title: 'Points',
  //   url: '/referrals',
  //   icon: pointsIcon,
  //   disabled: false,
  // },
  // {
  //   id: 'staking',
  //   title: 'Staking',
  //   url: '/staking',
  //   disabled: true,
  // },
];

const navLinksDown: NavLinkProps[] = [
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
