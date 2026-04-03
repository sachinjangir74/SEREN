import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';
import PageTransition from './PageTransition';

// Core component loaded instantly
import Home from '../pages/Home';

// Lazy loaded components for better performance
const Profile = lazy(() => import('../pages/Profile'));
const Contact = lazy(() => import('../pages/Contact'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Therapists = lazy(() => import('../pages/Therapists'));
const Appointment = lazy(() => import('../pages/Appointment'));
const Appointments = lazy(() => import('../pages/Appointments'));
const Chat = lazy(() => import('../pages/Chat'));
const Resources = lazy(() => import('../pages/Resources'));
const VideoCall = lazy(() => import('../pages/VideoCall'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const TherapistDashboard = lazy(() => import('../pages/TherapistDashboard'));
const ServiceDetail = lazy(() => import('../pages/services/ServiceDetail'));
const ProgramDetail = lazy(() => import('../pages/programs/ProgramDetail'));
const InteractiveProgramWorkspace = lazy(() => import('../pages/programs/InteractiveProgramWorkspace'));
const AssessmentFlow = lazy(() => import('../pages/assessments/AssessmentFlow'));

export default function AnimatedRoutes() {
  const location = useLocation();

  const withTransition = (Component: React.ComponentType) => (
    <PageTransition>
      <Component />
    </PageTransition>
  );

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={withTransition(Home)} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/therapists" element={<PageTransition><Therapists /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/chat" element={<ProtectedRoute><PageTransition><Chat /></PageTransition></ProtectedRoute>} />
        <Route path="/appointment" element={<ProtectedRoute><PageTransition><Appointment /></PageTransition></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><PageTransition><Appointments /></PageTransition></ProtectedRoute>} />
        <Route path="/video" element={<ProtectedRoute><PageTransition><VideoCall /></PageTransition></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
              <Route path="/therapist" element={<ProtectedRoute requireTherapist={true}><PageTransition><TherapistDashboard /></PageTransition></ProtectedRoute>} />
      <Route path="/services/:slug" element={<PageTransition><ServiceDetail /></PageTransition>} />
      <Route path="/programs/:slug" element={<PageTransition><ProgramDetail /></PageTransition>} />
      <Route path="/programs/:slug/workspace" element={<ProtectedRoute><PageTransition><InteractiveProgramWorkspace /></PageTransition></ProtectedRoute>} />
        <Route path="/assessments/:slug" element={<ProtectedRoute><PageTransition><AssessmentFlow /></PageTransition></ProtectedRoute>} />
    </Routes>
  </AnimatePresence>
  );
}
