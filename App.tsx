import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import TestimonialsList from './admin/testimonials/TestimonialsList';
import TestimonialForm from './admin/testimonials/TestimonialForm';
import PortfolioList from './admin/portfolio/PortfolioList';
import PortfolioForm from './admin/portfolio/PortfolioForm';
import ServicesList from './admin/services/ServicesList';
import ServiceForm from './admin/services/ServiceForm';
import ProposalsList from './admin/proposals/ProposalsList';
import ProposalBuilder from './admin/proposals/ProposalBuilder';
import ProposalView from './components/ProposalView';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/proposal/:slug" element={<ProposalView />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Testimonials */}
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <TestimonialsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials/:id"
            element={
              <ProtectedRoute>
                <TestimonialForm />
              </ProtectedRoute>
            }
          />
          
          {/* Portfolio */}
          <Route
            path="/admin/portfolio"
            element={
              <ProtectedRoute>
                <PortfolioList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/portfolio/:id"
            element={
              <ProtectedRoute>
                <PortfolioForm />
              </ProtectedRoute>
            }
          />
          
          {/* Services */}
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <ServicesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services/:id"
            element={
              <ProtectedRoute>
                <ServiceForm />
              </ProtectedRoute>
            }
          />
          
          {/* Proposals */}
          <Route
            path="/admin/proposals"
            element={
              <ProtectedRoute>
                <ProposalsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proposals/:id"
            element={
              <ProtectedRoute>
                <ProposalBuilder />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect root to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
