import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Markets from '../pages/Markets';
import TokenDetails from '../pages/TokenDetail'
import backgroundImage from '../assets/img/background.svg';
import Sidebar from '../layouts/Sidebar';
import Overview from '../pages/Overview';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Referrals from '../pages/Referrals';

function Router() {

  const modalOpen = useSelector((state: RootState) => state.sidebar.modalOpen)

  return (
    <BrowserRouter>
      <Sidebar />
      <main className="bg-primary-light flex-1 relative lg:h-screen">
        <div className="relative px-4 py-8 md:px-6 xl:p-14 z-20 lg:max-h-screen h-full overflow-auto ">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="markets" element={<Markets />} >
              <Route path="" element={<Overview />} />
              <Route path=":token" element={<TokenDetails />} />
            </Route>
          </Routes>
          {
            modalOpen &&
            <Referrals />
          }
        </div>
        <div className="absolute top-0 right-0 h-full z-10">
          <img className="h-full" src={backgroundImage} alt="" />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default Router;
