import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Calculator, AlertTriangle, FileText, CalendarDays, LogOut, HomeIcon, Home } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} strokeWidth={4.5} />, path: '/hr_staff/dashboard' },
    { name: 'Employee Data', icon: <Users size={20} fill="currentColor" />, path: '/hr_staff/employees' },
    { name: 'Attendance and payroll operations', icon: <Calculator size={20} strokeWidth={3.5} />, path: '/hr_staff/attendance' },
    { name: 'Anomaly Review and Validation', icon: <AlertTriangle size={20} strokeWidth={4.5} />, path: '/hr_staff/anomalies' },
    { name: 'Document Management', icon: <FileText size={20} strokeWidth={4.5} />, path: '/hr_staff/documents' },
    { name: 'Leave Management', icon: <CalendarDays size={20} strokeWidth={4.5} />, path: '/hr_staff/leave' },
    { name: 'Logout', icon: <LogOut size={20} fill="currentColor" />, path: 'logout' }
  ];

  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path} className={styles.navItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.name}</span>
          </Link>
        ))}
      </nav>

    
    </div>
  );
};

export default Sidebar;