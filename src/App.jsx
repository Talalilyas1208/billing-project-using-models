import React, { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import DashboardLayout from "./components/layout/DashboardLayout";
import { logoutUser } from "./firebase/config";

const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const InvoicesPage = React.lazy(() => import("./pages/InvoicesPage"));
const Newinvoice = React.lazy(() => import("./pages/Newinvoice"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const OffersPage = React.lazy(() => import("./pages/OffersPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const CustomerPage = React.lazy(() => import("./pages/CustomerPage"));

const PageLoader = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
    <Spin size="large" />
  </div>
);

function App() {
  // Session storage management: secure, tab-isolated, auto-cleared on browser/tab close
  const [userSession, setUserSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem("direct_user_session");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user session from sessionStorage:", e);
      return null;
    }
  });

  const handleAuthenticate = (session) => {
    try {
      sessionStorage.setItem("direct_user_session", JSON.stringify(session));
    } catch (e) {
      console.error("Failed to save user session to sessionStorage:", e);
    }
    setUserSession(session);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Firebase sign out failed:", e);
    }
    try {
      sessionStorage.removeItem("direct_user_session");
    } catch (e) {
      console.error("Failed to clear user session from sessionStorage:", e);
    }
    setUserSession(null);
  };

  return (
    <BrowserRouter>
      <Suspense fallback={PageLoader}>
        <Routes>
          {/* Public Login Route */}
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

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              userSession ? (
                <DashboardLayout
                  userSession={userSession}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route
              index
              element={<Navigate to="/dashboard/invoices" replace />}
            />

            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/new" element={<Newinvoice />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="customer" element={<CustomerPage />} />
          </Route>

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <Navigate
                to={userSession ? "/dashboard/invoices" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
