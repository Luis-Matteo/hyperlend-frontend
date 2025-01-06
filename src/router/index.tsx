import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import Markets from '../pages/markets/Markets';
import CoreTokenDetails from '../pages/markets/core/CoreTokenDetail';
import Sidebar from '../layouts/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Referrals from '../pages/markets/Referrals';
import backgroundImage from '../assets/img/background.svg';
import { useLocation } from 'react-router-dom';
import backgroundGradientOrange from '../assets/img/background-orange.svg';
import { tokenToGradient } from '../utils/config';
import ConfirmModal from '../components/ConfirmModal';
import Hyperloop from '../pages/hyperloop/Hyperloop';
import HyperloopOverview from '../pages/hyperloop/HyperloopOverview';
import HyperloopSetting from '../pages/hyperloop/HyperloopSetting';
import HyperloopSearch from '../pages/hyperloop/HyperloopSearch';
import { useConfirm } from '../provider/ConfirmProvider';
import NotFound from '../pages/not-found/NotFound';
import Analytics from '../pages/analytics/Analytics';
import MarketOverview from '../pages/markets/MarketOverview';
import IsolatedTokenDetails from '../pages/markets/isolated/IsolatedTokenDetail';
import Hypervault from '../pages/hypervault/Hypervault';
import HypervaultOverview from '../pages/hypervault/HypervaultOverview';
import HypervaultDetails from '../pages/hypervault/HypervaultDetails';
import Points from '@/pages/points/Points';

function MainContent() {
  const { guided } = useConfirm();
  const location = useLocation();
  const modalOpen = useSelector((state: RootState) => state.sidebar.modalOpen);
  const is404 = location.pathname === '/404';

  const [searchParams] = useSearchParams();
  if (searchParams.get('ref')) {
    localStorage.setItem('referredBy', searchParams.get('ref') || 'null');
  }
  if (searchParams.get('r')) {
    localStorage.setItem('referredBy', searchParams.get('r') || 'null');
  }

  return (
    <>
      <ConfirmModal />
      <main
        className={`bg-primary-light w-full relative lg:h-screen inset-0 z-0 ${!is404 ? 'lg:w-[calc(100vw-256px)]' : ''}`}
      >
        <div className='inset-0 px-4 py-8 md:px-6 xl:p-14 z-20 lg:max-h-screen h-full overflow-auto '>
          <Routes>
            <Route path='/' element={<Navigate to='/dashboard' />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='markets' element={<Markets />}>
              <Route path='' element={<MarketOverview />} />
              <Route path=':token' element={<CoreTokenDetails />} />
              <Route path='isolated' element={<Markets />}>
                <Route path='' element={<MarketOverview />} />
                <Route path=':pairAddress' element={<IsolatedTokenDetails />} />
              </Route>
            </Route>
            <Route path='hypervault' element={<Hypervault />}>
              <Route path='' element={<HypervaultOverview />} />
              <Route path=':vaultId' element={<HypervaultDetails />} />
            </Route>
            <Route path='analytics' element={<Analytics />} />
            <Route path='points' element={<Points />} />
            <Route path='hyperloop' element={<Hyperloop />}>
              <Route path='' element={<HyperloopOverview />} />
              <Route path='setting' element={<HyperloopSetting />} />
              <Route path='search' element={<HyperloopSearch />} />
            </Route>
            <Route path='404' element={<NotFound />} />
            <Route path='*' element={<Navigate to='/404' />} />
          </Routes>
          {modalOpen && <Referrals />}
        </div>
        <div
          className={`absolute top-0 right-0 w-full h-screen -z-10 ${guided > 0 ? 'lg:blur-[8px]' : ''}`}
        >
          {location.pathname.match(/^\/markets\/[^/]+$/) &&
          !location.pathname.match(/^\/markets\/isolated\/?$/) ? (
            <img
              className='w-full'
              src={
                tokenToGradient[location.pathname.split('/')[2]]
                  ? tokenToGradient[location.pathname.split('/')[2]]
                  : backgroundGradientOrange
              }
              alt=''
            />
          ) : (
            <img className='h-full w-full' src={backgroundImage} alt='' />
          )}
        </div>
      </main>
    </>
  );
}

export default function Router() {
  const location = useLocation();
  const is404 = location.pathname === '/404';

  return (
    <div className='flex'>
      {!is404 && <Sidebar />}
      <MainContent />
    </div>
  );
}
