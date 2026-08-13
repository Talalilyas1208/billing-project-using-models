import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import InvoicesPage from './pages/InvoicesPage';
import ProductsPage from './pages/ProductsPage';
import OffersPage from './pages/OffersPage';
import ContactPage from './pages/ContactPage';
import CustomerPage from './pages/CustomerPage';

function App() {
  const [userSession, setUserSession] = useState(() => {
    try {
      const saved = localStorage.getItem('direct_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleAuthenticate = (session) => {
    setUserSession(session);
  };

  const handleLogout = () => {
    localStorage.removeItem('direct_user_session');
    setUserSession(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            userSession ? (
              <Navigate to="/dashboard/invoices" replace />
            ) : (
              <LoginPage onAuthenticate={handleAuthenticate} />
            )
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            userSession ? (
              <DashboardLayout userSession={userSession} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="/dashboard/invoices" replace />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="Customer" element={<CustomerPage />} />
        </Route>

        {/* Fallback Route */}
        <Route
          path="*"
          element={<Navigate to={userSession ? "/dashboard/invoices" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
