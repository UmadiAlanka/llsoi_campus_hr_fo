"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Calculator, AlertTriangle, FileText, CalendarDays, LogOut, Home, UserCog } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  role?: 'Admin' | 'HR Staff';
}

const Sidebar: React.FC<SidebarProps> = ({ role = 'Admin' }) => {
  const pathname = usePathname();

  // Define Admin links
  const adminItems = [
    { name: 'Dashboard', icon: <Home size={22} />, path: '/admin-dashboard' },
    { name: 'Manage Users', icon: <UserCog size={22} />, path: '/admin-dashboard/admin-manage-users' },
    { name: 'Attendance', icon: <Users size={22} />, path: '/admin-dashboard/admin-attendance' },
    { name: 'Salary & Pay Slip', icon: <Calculator size={22} />, path: '/admin-dashboard/salary' },
    { name: 'Anomaly Detections', icon: <AlertTriangle size={22} />, path: '/admin-dashboard/anomaly' },
    { name: 'Report & Analytics', icon: <FileText size={22} />, path: '/admin-dashboard/analytics' },
    { name: 'Leave Management', icon: <CalendarDays size={22} />, path: '/admin-dashboard/leave' },
    { name: 'Logout', icon: <LogOut size={22} />, path: '/' }
  ];

  
  const hrItems = [
    { name: 'Dashboard', icon: <Home size={22} />, path: '/hr_staff/dashboard' },
    { name: 'Employee Data', icon: <Users size={22} />, path: '/hr_staff/employees' },
    { name: 'Attendance/Payroll', icon: <Calculator size={22} />, path: '/hr_staff/attendance' },
    { name: 'Anomaly Review', icon: <AlertTriangle size={22} />, path: '/hr_staff/anomalies' },
    { name: 'Documents', icon: <FileText size={22} />, path: '/hr_staff/documents' },
    { name: 'Leave Management', icon: <CalendarDays size={22} />, path: '/hr_staff/leave' },
    { name: 'Logout', icon: <LogOut size={22} />, path: '/login' }
  ];

  const menuItems = role === 'Admin' ? adminItems : hrItems;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.text}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;