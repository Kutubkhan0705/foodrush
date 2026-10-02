import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import AddFood from './pages/AddFood';
import FoodList from './pages/FoodList';
import AdminOrders from './pages/AdminOrders';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  if (!token) return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="*" element={<AdminLogin setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontWeight: '600' } }} />
      <div style={{ display: 'flex' }}>
        <Sidebar setToken={setToken} />
        <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', background: '#f5f5f5' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-food" element={<AddFood />} />
            <Route path="/food-list" element={<FoodList />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
