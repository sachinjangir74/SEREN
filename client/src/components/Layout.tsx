import React, { useEffect } from 'react';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import { useAppStore } from '../store/useAppStore';
import { FloatingChat } from './ai/FloatingChat';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppStore();    

  // Initialize theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Always render the main layout with Navbar and Footer
  // Authenticated users will see their options inside the Navbar Dropdown
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-[104px]">
        {children}
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Layout;
