import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="layout-main">
        <Header onMenuClick={toggleSidebar} />
        <main className="layout-content" role="main">
          {children}
        </main>
      </div>
      {sidebarOpen && <div className="layout-overlay" onClick={closeSidebar} />}
    </div>
  );
};

export default Layout;
