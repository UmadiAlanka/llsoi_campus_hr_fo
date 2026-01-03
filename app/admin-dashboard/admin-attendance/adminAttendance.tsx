"use client";

import React, { useState, useRef } from 'react';
import styles from './adminAttendance.module.css';
import Link from 'next/link';

interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  timeMarked: string;
  type: string;
}

const adminAttendance: React.FC = () => {
  const [records] = useState<AttendanceRecord[]>([
    {
      id: '001',
      name: 'S.Perera',
      date: '10/09/2025',
      timeMarked: '8.00AM',
      type: 'Academic',
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger the native calendar picker
  const handleIconClick = () => {
    if (dateInputRef.current) {
      // showPicker() is the modern standard for triggering date inputs
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '/icons/home.png', active: false, href: '/admin-dashboard/Dashboard' },
    { name: 'Manage Users', icon: '/icons/user.png', active: false, href: '/manage-users' },
    { name: 'Attendence', icon: '/icons/dattendance.png', active: true, href: '/attendance' },
    { name: 'Salary & Pay Slip', icon: '/icons/dsalary.png', active: false, href: '/salary' },
    { name: 'Anomaly Detections', icon: '/icons/anomaly.png', active: false, href: '/anomaly' },
    { name: 'Report & Analytics', icon: '/icons/report.png', active: false, href: '/analytics' },
    { name: 'Leave management', icon: '/icons/leave.png', active: false, href: '/leave' },
    { name: 'Logout', icon: '/icons/logout.png', active: false, href: '/logout' },
  ];

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/logo.png" alt="LLSOI Logo" className={styles.headerLogo} />
          <h1 className={styles.brandName}>
            LLSOI Campus HR <span>Management System</span>
          </h1>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" alt="Admin" className={styles.adminAvatar} />
          <span className={styles.userName}>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        {/* --- Sidebar --- */}
        <aside className={styles.sidebar}>
          <nav>
            <ul className={styles.menuList}>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className={`${styles.menuItem} ${item.active ? styles.activeItem : ''}`}
                  >
                    <img src={item.icon} alt="" className={styles.menuIconImage} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Attendance</h2>
          
          <div className={styles.filterSection}>
            <div className={styles.filterGrid}>
              
              {/* --- UPDATED DATE FILTER --- */}
              <div className={styles.filterBox} onClick={handleIconClick}>
                <input 
                  type="date" 
                  ref={dateInputRef}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={styles.filterInputDate} 
                />
                {/* Placeholder text logic if no date is selected */}
                {!selectedDate && <span className={styles.datePlaceholder}>Filter by Date</span>}
                <img src="/icons/calendar.png" alt="calendar" className={styles.filterIcon} />
              </div>

              <div className={styles.filterBox}>
                <select className={styles.filterSelect}>
                  <option>Filter by Department</option>
                  <option>HR</option>
                  <option>Management</option>
                  <option>Language</option>
                  <option>IT</option>
                  <option>Behavioral</option>
                </select>
                <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
              </div>
              <div className={styles.filterBox}>
                <select className={styles.filterSelect}>
                  <option>Select Type</option>
                  <option>Acedemic</option>
                  <option>Non-Acedemic</option>
                </select>
                <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
              </div>
            </div>

            <button className={styles.markAttendanceBtn}>
              Mark Attendance
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.attendanceTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time Marked</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.date}</td>
                    <td>{record.timeMarked}</td>
                    <td>{record.type}</td>
                    <td>
                      <button className={styles.editBtn}>EDIT/View</button>
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

export default adminAttendance;