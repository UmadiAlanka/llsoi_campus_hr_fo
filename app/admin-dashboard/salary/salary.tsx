"use client";

import React, { useState, useRef } from 'react';
import styles from './salary.module.css';
import Link from 'next/link';

interface SalaryRecord {
  id: string;
  name: string;
  basicSalary: string;
  netSalary: string;
  date: string;
  type: string;
}

const AdminSalary: React.FC = () => {
  const monthInputRef = useRef<HTMLInputElement>(null);
  
  const [records] = useState<SalaryRecord[]>([
    {
      id: '001',
      name: 'S.Perera',
      basicSalary: '50,000',
      netSalary: '52,000',
      date: '2025-10-10',
      type: 'Academic',
    }
  ]);

  const handleMonthClick = () => {
    if (monthInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
      monthInputRef.current.showPicker();
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '/icons/dashboard.png', active: false, href: '/' },
    { name: 'Manage Users', icon: '/icons/user.png', active: false, href: '/manage-users' },
    { name: 'Attendance', icon: '/icons/attendance.png', active: false, href: '/attendance' },
    { name: 'Salary & Pay Slip', icon: '/icons/salary.png', active: true, href: '/salary' },
    { name: 'Anomaly Detections', icon: '/icons/anomaly.png', active: false, href: '/anomaly' },
    { name: 'Report & Analytics', icon: '/icons/report.png', active: false, href: '/analytics' },
    { name: 'Leave management', icon: '/icons/leave.png', active: false, href: '/leave' },
    { name: 'Logout', icon: '/icons/logout.png', active: false, href: '/logout' },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
          <h1 className={styles.brandName}>LLSOI Campus HR <span>Management System</span></h1>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" alt="Admin" className={styles.adminAvatar} />
          <span className={styles.userName}>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav>
            <ul className={styles.menuList}>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={`${styles.menuItem} ${item.active ? styles.activeItem : ''}`}>
                    <img src={item.icon} alt="" className={styles.menuIconImage} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Salary & Pay Slip</h2>
          
          <div className={styles.topSection}>
            {/* Filter Bar */}
            <div className={styles.filterBar}>
              <div className={styles.filterBox}>
                <select className={styles.filterSelect}>
                  <option>Filter by Name</option>
                </select>
                <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
              </div>

              <div className={styles.filterBox} onClick={handleMonthClick}>
                <input type="month" ref={monthInputRef} className={styles.monthInput} />
                <span className={styles.monthPlaceholder}>Filter by Month</span>
                <img src="/icons/calendar.png" alt="calendar" className={styles.filterIcon} />
              </div>

              <div className={styles.filterBox}>
                <select className={styles.filterSelect}>
                  <option>Filter by Type</option>
                </select>
                <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
              </div>
            </div>

            {/* Add Salary Button */}
            <button className={styles.addSalaryBtn}>ADD SALARY</button>
          </div>

          {/* Table Container */}
          <div className={styles.tableCard}>
            <table className={styles.salaryTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Basic Salary</th>
                  <th>Net Salary</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Download</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.basicSalary}</td>
                    <td>{record.netSalary}</td>
                    <td>{record.date}</td>
                    <td>{record.type}</td>
                    <td>
                      <button className={styles.pdfBtn}>
                        <img src="/icons/pdf.png" alt="PDF" />
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editBtn}>Edit</button>
                        <button className={styles.deleteBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSalary;