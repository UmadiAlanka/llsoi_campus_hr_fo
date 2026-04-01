import React from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import styles from './adminLayout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <AdminHeader />
      <div className={styles.body}>
        <AdminSidebar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}