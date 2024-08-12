import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Markets from '../pages/Markets';
import backgroundImage from '../assets/img/background.svg';
import Sidebar from '../layouts/Sidebar';

function Router() {
  return (
    <BrowserRouter>
      <Sidebar />
      <main className="bg-primary-light flex-1 relative">
        <div className="relative h-screen p-14 z-20">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="markets" element={<Markets />} />
          </Routes>
        </div>
        <div className="absolute top-0 right-0 h-full z-10">
          <img className="h-full" src={backgroundImage} alt="" />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default Router;
