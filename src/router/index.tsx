import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Navbar from '../layouts/Navbar';
import LendBorrow from '../pages/LendBorrow';

function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="bg-primary-light flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lend-and-borrow" element={<LendBorrow />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default Router;
