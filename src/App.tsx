import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ClientAuthProvider } from './contexts/ClientAuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import WebsiteManagementPage from './pages/WebsiteManagementPage';
import SubscribePage from './pages/SubscribePage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ClientLoginPage from './pages/ClientLoginPage';
import ClientDashboardPage from './pages/ClientDashboardPage';

function App() {
  return (
    <AuthProvider>
      <ClientAuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="services/website-management" element={<WebsiteManagementPage />} />
              <Route path="subscribe" element={<SubscribePage />} />
            </Route>
            {/* Admin routes outside of main layout */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Client routes outside of main layout */}
            <Route path="/client_area/login" element={<ClientLoginPage />} />
            <Route path="/client_area" element={<ClientDashboardPage />} />
            {/* Redirect /client_area/* to login if not authenticated */}
            <Route path="/client_area/*" element={<Navigate to="/client_area/login" replace />} />
          </Routes>
        </Router>
      </ClientAuthProvider>
    </AuthProvider>
  );
}

export default App;