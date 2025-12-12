import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * MainLayout - A layout component that wraps all pages with a consistent
 * header and footer, ensuring they don't reload between page navigations.
 * Uses React Router's Outlet to render the current page content.
 */
const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Fixed navbar at the top */}
      <Navbar />
      
      {/* Main content area - this will render the current route */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout; 