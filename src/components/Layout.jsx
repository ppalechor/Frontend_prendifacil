import React from 'react';
import Sidebar from './sidebar/Sidebar.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
