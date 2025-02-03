import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);

  // Handle errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Runtime error:', event.error);
      // You can add error reporting service here
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main 
        className={`flex-1 overflow-x-hidden transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="container mx-auto min-h-screen p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 