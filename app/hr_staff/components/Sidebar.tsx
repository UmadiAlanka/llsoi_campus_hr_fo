import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Calculator, AlertTriangle, FileText, CalendarDays, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/hr_staff/dashboard' },
    { name: 'Employee Data', icon: <Users size={20} />, path: '/hr_staff/employees' },
    { name: 'Attendance and payroll operations', icon: <Calculator size={20} />, path: '/hr_staff/attendance' },
    { name: 'Anomaly Review and Validation', icon: <AlertTriangle size={20} />, path: '/hr_staff/anomalies' },
    { name: 'Document Management', icon: <FileText size={20} />, path: '/hr_staff/documents' },
    { name: 'Leave Management', icon: <CalendarDays size={20} />, path: '/hr_staff/leave' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="LLSOI Logo" className={styles.logo} />
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path} className={styles.navItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.name}</span>
          </Link>
        ))}
        <button className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;