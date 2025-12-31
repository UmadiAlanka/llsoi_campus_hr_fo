import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import styles from './layout.module.css';

export default function HRStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutWrapper}>
      {/* Navigation Top Bar */}
      <Topbar />
      
      <div className={styles.mainContainer}>
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Dynamic Page Content */}
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}