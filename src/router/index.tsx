import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Navbar from '../layouts/Navbar';
import LendBorrow from '../pages/LendBorrow';
import backgroundImage from '../assets/img/background.svg';

function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="bg-primary-light flex-1 relative">
        <div className="relative h-screen p-14 z-20">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lend-and-borrow" element={<LendBorrow />} />
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
