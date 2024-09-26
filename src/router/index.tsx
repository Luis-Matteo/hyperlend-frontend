import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Markets from '../pages/Markets';
import TokenDetails from '../pages/TokenDetail';
import Sidebar from '../layouts/Sidebar';
import Overview from '../pages/Overview';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Referrals from '../pages/Referrals';
import backgroundImage from '../assets/img/background.svg';
import backgroundGradient from '../assets/img/background-gradient.svg';
import { useLocation } from 'react-router-dom';

function MainContent() {
  const location = useLocation();
  const modalOpen = useSelector((state: RootState) => state.sidebar.modalOpen);

  return (
    <main className="bg-primary-light w-full lg:w-[calc(100vw-256px)] relative lg:h-screen">
      <div className="relative px-4 py-8 md:px-6 xl:p-14 z-20 lg:max-h-screen h-full overflow-auto ">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="markets" element={<Markets />}>
            <Route path="" element={<Overview />} />
            <Route path=":token" element={<TokenDetails />} />
          </Route>
        </Routes>
        {modalOpen && <Referrals />}
      </div>
      <div className="absolute top-0 right-0 w-full h-screen z-10">
        {
          location.pathname.match(/^\/markets\/[^/]+$/) ?
            <img
              className="w-full"
              src={backgroundGradient}
              alt=""
            />
            :
            <img
              className="h-full w-full"
              src={backgroundImage}
              alt=""
            />
        }
      </div>
    </main>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <Sidebar />
      <MainContent />
    </BrowserRouter>
  );
}

export default Router;
