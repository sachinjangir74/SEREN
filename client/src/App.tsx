import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import React, { Suspense } from 'react';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Layout>
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center bg-surface-light dark:bg-surface-dark">
            <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        }>
          <AnimatedRoutes />
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
