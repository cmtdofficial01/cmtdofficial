import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

// Lazy load other pages when ready
const Profile = React.lazy(() => import('./pages/Profile'));
const WorkPlan = React.lazy(() => import('./pages/WorkPlan'));
const SchoolCadet = React.lazy(() => import('./pages/SchoolCadet'));
const SchoolRegistration = React.lazy(() => import('./pages/forms/SchoolRegistration'));
const TrainerRequest = React.lazy(() => import('./pages/forms/TrainerRequest'));
const StaffJobApplication = React.lazy(() => import('./pages/forms/StaffJobApplication'));
const DefenceTrainingRegistration = React.lazy(() => import('./pages/forms/DefenceTrainingRegistration'));

import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { firebaseService } from './services/firebaseService';

export default function App() {
  React.useEffect(() => {
    firebaseService.testConnection();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/work-plan" element={<WorkPlan />} />
              <Route path="/school-cadet" element={<SchoolCadet />} />
              
              {/* Forms */}
              <Route path="/forms/school-reg" element={<SchoolRegistration />} />
              <Route path="/forms/trainer-req" element={<TrainerRequest />} />
              <Route path="/forms/staff-app" element={<StaffJobApplication />} />
              <Route path="/forms/defence-reg" element={<DefenceTrainingRegistration />} />
              
              {/* Auth Panels */}
              <Route path="/staff-login" element={<StaffLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Protected Dashboards */}
              <Route 
                path="/staff-dashboard" 
                element={
                  <ProtectedRoute type="staff">
                    <StaffDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute type="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
